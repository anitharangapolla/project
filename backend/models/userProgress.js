// models/UserProgress.js
const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  course: { type: String, required: true },
  quizAnswers: [String],
  learningPath: [String],
  createdAt: { type: Date, default: Date.now },
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
