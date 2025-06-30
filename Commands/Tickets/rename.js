const { MessageEmbed } = require('discord.js');
const Data = require('pro.db');
const { owners } = require(`${process.cwd()}/config`);
module.exports = {
  name: 'rename',
  description: 'يقوم بتغيير اسم التذكرة',
  run: async (client, message, args) => {
    const userIds = await Data.get(`Users_${message.guild.id}`) || [];
    const claimerId = await Data.get(`claimed_${message.channel.id}`);

    // التحقق من الأذونات
    if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id) && !userIds.includes(message.author.id) && message.author.id !== claimerId) return message.react('❌');

    console.log("dd")
    // التحقق مما إذا كان الأمر مفعلًا
    const isEnabled = Data.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) {
      return message.reply('هذا الأمر غير مفعل.');
    }

    try {

      const newTicketName = args.join(" ");
      if (!newTicketName) {
        return message.reply("**يرجى إرفاق اسم التذكرة**.");
      }

      const ticketData = Data.get(`channel${message.channel.id}`);
      if (!ticketData) {
        return message.reply('لم يتم العثور على بيانات التذكرة لهذه القناة.');
      }

      await message.channel.setName(newTicketName);
      message.react('✅');

    } catch (error) {
      console.error('حدث خطأ أثناء تغيير اسم التذكرة:', error);
      message.reply('حدث خطأ أثناء معالجة الطلب.');
    }
  },
};
