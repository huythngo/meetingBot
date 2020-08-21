const Meeting = require('../models/Meeting');

const createMeeting = async ({
  user,
  name,
  everyone,
  channel,
  scope,
  date,
}) => {
  try {
    const newMeeting = new Meeting({
      user,
      name,
      date,
      everyone,
      channel,
      scope,
    });

    await newMeeting.save();
    return newMeeting;
  } catch (error) {
    throw new Error(error.message);
  }
};

const viewMeetingByUser = async (userId) => {
  const meetings = await Meeting.find({
    $or: [{ everyone: true }, { scope: { $elemMatch: { user: userId } } }],
  });

  return meetings;
};

module.exports = { createMeeting, viewMeetingByUser };
