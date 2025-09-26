
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
import type { Comment } from './types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const COMMENTS_COLLECTION = 'comments';

// Type for the data we store in Firestore
type FirestoreCommentData = {
  userId: string;
  userEmail: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
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
