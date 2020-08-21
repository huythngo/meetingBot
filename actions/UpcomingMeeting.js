const Meeting = require('../models/Meeting');
const { notifyMsg } = require('../msgTemplate/EmbedMsg');
const findUpcomingMeetings = async () => {
  try {
    const meetings = await Meeting.find({
      $and: [
        { date: { $lte: Date.now() + 3600000 } },
        { date: { $gte: Date.now() } },
      ],
    });

    return meetings;
  } catch (error) {
    console.error(error);
  }
};

const deletePastMeetings = async () => {
  try {
    const meetings = await Meeting.deleteMany({ date: { $lt: Date.now() } });
  } catch (err) {
    console.error(err);
  }
};

const callUpcomingMeeting = async (client, meeting) => {
  try {
    setTimeout(async () => {
      const replyChannel = client.channels.cache.find(
        (channel) => channel.id === meeting.channel
      );

      replyChannel.send(notifyMsg(meeting));
      await Meeting.findByIdAndDelete(meeting._id);
    }, meeting.date - Date.now());
  } catch (error) {
    console.error(error);
  }
};

const callUpcomingMeetings = async (client) => {
  try {
    const meetings = await findUpcomingMeetings();
    if (!meetings) {
      return;
    }
    meetings.forEach((meeting) => {
      callUpcomingMeeting(client, meeting);
    });
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  findUpcomingMeetings,
  callUpcomingMeetings,
  deletePastMeetings,
  callUpcomingMeeting,
};
