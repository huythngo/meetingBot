const { Schema, model } = require('mongoose');
const validator = require('validator');
const MeetingSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    validate(value) {
      if (value < Date.now()) {
        throw new Error('Cannot set up meeting in the past');
      }
    },
  },
  everyone: {
    type: Boolean,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  scope: [
    {
      user: {
        type: String,
      },
    },
  ],
  complete: {
    default: false,
    type: Boolean,
  },
});

module.exports = model('Meeting', MeetingSchema);
