const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    id: Number,
    username: String,
    title: String,
    text: String,

    voting: {
      type: {
        mbti: String,
        enneagram: String,
        zodiac: String,
      },
      default: {
        mbti: null,
        enneagram: null,
        zodiac: null,
      },
    },

    likes: [{ username: String }],

    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
