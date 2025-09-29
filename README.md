# EventFlow - AI-Powered Event Management Platform

EventFlow is a comprehensive, AI-driven web application designed for discovering, booking, and managing events. Built with Next.js, Firebase, and Google's Genkit, it offers a seamless, interactive, and personalized user experience.

**Live Preview**: [https://6000-firebase-studio-1758873337243.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/landing](https://6000-firebase-studio-1758873337243.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev/landing)

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **AI Integration**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Key Features

- **User Authentication**: Secure sign-up, login, and password reset using Firebase Authentication (Email/Password & Google OAuth).
- **Event Discovery**: A dynamic dashboard to browse, search, and filter a wide range of events.
- **AI-Powered Recommendations**: A personalized recommendation engine that suggests events based on user-selected preferences.
- **AI Chatbot**: An interactive chatbot (Genkit) that provides information about events in a conversational manner.
- **AI Sentiment Analysis**: An AI flow that analyzes user comments to determine if the sentiment is positive, negative, or neutral.
- **Event Bookmarking**: Users can bookmark their favorite events for quick access.
- **Simulated Payment Flow**: A multi-step checkout process with simulated payment options for Credit Card, UPI ID, and QR Code.
- **Booking Management**: A dedicated "My Bookings" page where users can view all their booked events.
- **Community Engagement**: Users can post comments on event pages, which are stored in Firestore and displayed in real-time.
- **Responsive Design**: A mobile-first design that ensures a great experience on all devices, featuring a draggable bottom sheet for event details on mobile.
- **Static & Legal Pages**: Includes 'About', 'Contact', 'Privacy Policy', and 'Terms of Service' pages.

## Project Structure

The project follows a modular structure, separating concerns for better maintainability.

### `src/app/`

This directory contains all the routes and pages of the application.

- **`/` (Root)**: The main entry point that handles routing logic, directing users to the landing page or dashboard based on their authentication status.
- **`/dashboard`**: The central hub for authenticated users, displaying event listings, filters, and the AI recommendation tool.
- **`/landing`**: The marketing and entry page for new or unauthenticated users.
- **`/login`**: The authentication page containing both sign-in and sign-up forms.
- **`/bookings`**: Displays a list of events the logged-in user has booked.
- **`/payment/[eventId]`**: The dynamic route for the simulated payment process for a specific event.
- **`/about`, `/contact`, `/privacy-policy`, `/terms-of-service`**: Static content pages.

### `src/components/`

This directory contains all reusable React components.

- **`/layout`**: Components for the overall site structure, like `Header` and `Footer`.
- **`/ui`**: Core UI elements from ShadCN, such as `Button`, `Card`, `Input`, etc.
- **`EventCard.tsx`**: Displays a single event in a list format.
- **`EventList.tsx`**: Renders a grid of `EventCard` components.
- **`EventDetailsDialog.tsx` & `EventDetailsDrawer.tsx`**: Display detailed event information in a modal (desktop) or a draggable bottom sheet (mobile).
- **`EventDetailsContent.tsx`**: The shared content view for the dialog and drawer, including event info, booking buttons, and the comment section.
- **`EventComments.tsx`**: Handles posting and displaying real-time comments for an event.
- **`Chatbot.tsx`**: The floating chatbot widget.
- **`RecommendationTool.tsx`**: The AI-powered tool for getting personalized event suggestions.

### `src/ai/`

This is the home for all Genkit AI-related logic.

- **`/genkit.ts`**: Initializes and configures the global Genkit instance.
- **`/flows`**: Contains the individual AI workflows.
  - **`chatbot-flow.ts`**: Powers the conversational assistant by providing it with event data.
  - **`personalized-event-recommendations.ts`**: Takes user preferences and returns a curated list of events.
  - **`comment-flow.ts`**: Analyzes user comments for sentiment before saving them to the database.

### `src/lib/`

This directory contains core logic, type definitions, and configurations.

- **`firebase.ts`**: Holds the public Firebase configuration keys.
- **`firebase-service.ts`**: A service layer for interacting with Firestore (e.g., adding/fetching comments and bookings).
- **`events.ts`**: A static data source containing all the event information for the app.
- **`types.ts`**: Contains all shared TypeScript type definitions.
- **`utils.ts`**: Utility functions, such as `cn` for merging Tailwind classes.

### `src/hooks/`

This directory contains custom React hooks.

- **`use-auth.tsx`**: A comprehensive authentication hook and context provider that manages user state, login/logout functions, and session persistence with Firebase.
- **`use-mobile.tsx`**: A hook to detect if the application is being viewed on a mobile-sized screen.
- **`use-toast.ts`**: A hook for displaying toast notifications.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    This project uses Firebase. Ensure you have a `.env` file in the root of the project with your Firebase project's configuration if you are setting it up from scratch. However, the provided `src/lib/firebase.ts` is pre-configured for demonstration purposes.

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

5.  **Run the Genkit Inspector (Optional)**
    To monitor and debug your AI flows, you can run the Genkit inspector:
    ```bash
    npm run genkit:watch
    ```
    The inspector will be available at `http://localhost:4000`.
