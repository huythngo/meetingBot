const Discord = require('discord.js');
const Meeting = require('../models/Meeting');

const notifyMsg = (meeting) => {
  let attendees = '';
  if (meeting.everyone) {
    attendees += '@everyone';
  } else if (meeting.scope) {
    meeting.scope.forEach((u) => (attendees += `<@${u.user}>`));
  }
  const embedMsg = new Discord.MessageEmbed()
    .setColor('#3467eb')
    .setTitle(meeting.name)
    .setDescription('You have a meeting now!!')
    .addFields({ name: `Attendees:`, value: `${attendees}` });
  return embedMsg;
};

const viewMeetingMsg = (user, meetings) => {
  const meetingMsg = new Discord.MessageEmbed()
    .setColor('#3467eb')
    .setTitle(`Upcoming Meeting`)
    .setDescription(`Meeting list of <@${user}>:`);
  meetings.forEach((meeting) => {
    meetingMsg.addFields({
      name: `${meeting.name}: `,
      value: `${meeting.date.toString()}`,
    });
  });

  return meetingMsg;
};
module.exports = { notifyMsg, viewMeetingMsg };
