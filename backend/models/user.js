const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Don't forget to import jwt

const UserSchema = new mongoose.Schema({
  name : { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true, default: () => crypto.randomBytes(32).toString('hex') }, // Random key generated during user creation
});

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Generate authentication token for the user
UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, user.secretKey, { expiresIn: '1h' }); // Use user's secretKey
  return token;
};

// Password comparison method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
