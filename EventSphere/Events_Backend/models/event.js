const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  event_type:String,
  description: {
    type: String,
    required: true,
  },
  clubs:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Clubs' }],
  imageUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Example: '10:00 AM'
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  isTeamEvent: {
    type: Boolean,
    required: true,
  },
  teamSize: {
    type: Number, // Required if `isTeamEvent` is true
    default: 1,
  },
  prizeMoney: {
    type: Number,
    default: 0, // 0 means no prize money
  },
  isPaid: {
    type: Boolean,
    default: false, // Indicates if the event is paid
  },
  amount: {
    type: Number, // Required if `isPaid` is true
    default: 0,
  },
  category: {
    type: String, 
    default: 'General',
  },
  contactInfo: {
    type: String, 
    required: true,
  },
  status:{type: String, default: 'pending'},
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  remarks:[String],
  prices:[String],
  about:String,
  timeline:[{
    time:String,
    speaker:String,
    topic:String,
    description:String,
    createdAt: { type: Date, default: Date.now }  
  }],
  ratings:[{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name:String,
    profile:String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now } 
  }]
}, { timestamps: true });

const Event = mongoose.model('Events', eventSchema);

module.exports = Event;