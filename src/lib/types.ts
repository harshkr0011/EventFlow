

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
};

export type LoginFormData = {
    email: string;
    password: string
}

export type SignupFormData = {
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword?: string;
}
