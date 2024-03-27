// import mongoose from 'mongoose';
const mongoose = require('mongoose');

const { Schema } = mongoose;

const profileSchema = new Schema({
  id: Number,
  name: String,
  description: String,
  mbti: String,
  enneagram: String,
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  image: String,

  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
