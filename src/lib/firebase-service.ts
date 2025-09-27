

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  type Unsubscribe,
  type FirestoreError,
} from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import type { Comment, Booking } from './types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const COMMENTS_COLLECTION = 'comments';
const CONTACT_MESSAGES_COLLECTION = 'contact-messages';
const BOOKINGS_COLLECTION = 'bookings';


// Type for the data we store in Firestore
type FirestoreCommentData = {
  userId: string;
  userEmail: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
};

type ContactMessageData = {
  name: string;
  email: string;
  message: string;
};

// Add a new contact message
export const addContactMessage = async (messageData: ContactMessageData) => {
    try {
        await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
            ...messageData,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error adding contact message to Firestore:', error);
        throw new Error('Could not send message.');
    }
};

// Add a new comment to an event
export const addComment = async (
  eventId: string,
  commentData: FirestoreCommentData
) => {
  try {
    await addDoc(collection(db, COMMENTS_COLLECTION), {
      eventId,
      ...commentData,
      createdAt: Timestamp.fromDate(commentData.createdAt),
    });
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
    throw new Error('Could not post comment.');
  }
};

// Listen for real-time updates to comments for a specific event
export const onCommentsSnapshot = (
  eventId: string,
  callback: (comments: Comment[]) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe => {
  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const comments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        comments.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          text: data.text,
          sentiment: data.sentiment,
          createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        });
      });
      callback(comments);
    },
    (error) => {
      console.error('Error listening to comments snapshot:', error);
      onError(error);
    }
  );

  return unsubscribe;
};

// Add a new booking for a user
export const addBooking = async (userId: string, eventId: string) => {
    try {
        await addDoc(collection(db, BOOKINGS_COLLECTION), {
            userId,
            eventId,
            bookingDate: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error adding booking to Firestore:', error);
        throw new Error('Could not create booking.');
    }
};

// Listen for real-time updates to a user's bookings
export const onBookingsSnapshot = (
    userId: string,
    callback: (bookings: Booking[]) => void,
    onError: (error: FirestoreError) => void
): Unsubscribe => {
    const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('userId', '==', userId),
        orderBy('bookingDate', 'desc')
    );

    const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
            const bookings: Booking[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                bookings.push({
                    id: doc.id,
                    userId: data.userId,
                    eventId: data.eventId,
                    bookingDate: (data.bookingDate as Timestamp).toDate().toISOString(),
                });
            });
            callback(bookings);
        },
        (error) => {
            console.error('Error listening to bookings snapshot:', error);
            onError(error);
        }
    );

    return unsubscribe;
};
