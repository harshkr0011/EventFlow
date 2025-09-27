

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  organizer: string;
  price: number;
  imageId: string;
  category: string;
  sustainability?: string[];
};

export type LoginFormData = {
    email: string;
    password: string
}

export type SignupFormData = {
    email: string;
    password: string;
    confirmPassword?: string;
}

export type Comment = {
    id: string;
    userId: string;
    userEmail: string;
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    createdAt: string;
};

export type Booking = {
    id: string;
    userId: string;
    eventId: string;
    bookingDate: string;
}
