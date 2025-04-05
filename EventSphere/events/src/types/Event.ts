import { ObjectId } from 'mongoose';

// Interface for the rating object
interface Rating {
  user: ObjectId; // Reference to the User model
  name: string;
  profile: string;
  rating: number; // Range from 1 to 5
  comment?: string;
  createdAt?: Date;
}

// Interface for the Event
export interface Event {
  _id?: ObjectId;
  title: string;
  event_type?: string;
  description: string;
  clubs: ObjectId[]; // References to the Clubs model
  imageUrl: string;
  date: Date;
  time: string; // Example: '10:00 AM'
  venue: string;
  isTeamEvent: boolean;
  teamSize?: number; // Required if `isTeamEvent` is true
  prizeMoney?: number; // Defaults to 0 if no prize money
  isPaid?: boolean; // Defaults to false
  amount?: number; // Required if `isPaid` is true
  category?: string; // Defaults to 'General'
  contactInfo: string;
  status?: string; // Defaults to 'pending'
  participants?: ObjectId[]; // References to the User model
  remarks?: string[];
  prices?: string[];
  ratings?: Rating[];
  createdAt?: Date; // Automatically managed by Mongoose
  updatedAt?: Date; // Automatically managed by Mongoose
}
