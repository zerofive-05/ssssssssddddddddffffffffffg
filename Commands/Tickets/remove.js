const Data = require('pro.db');
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
  name: 'remove',
  description: 'يقوم بإزالة عضو من التذكرة',
  run: async (client, message, args) => {
    // التحقق من صلاحيات المستخدم
    const userIds = Data.get(`Users_${message.guild.id}`) || [];
    const claimerId = await Data.get(`claimed_${message.channel.id}`);

    if (!message.member.permissions.has('ADMINISTRATOR') && 
        !owners.includes(message.author.id) && 
        !userIds.includes(message.author.id) && 
        message.author.id !== claimerId) {
      return message.react('❌');
    }

    const isEnabled = Data.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) {
      return message.reply('هذا الأمر غير مفعل.');
    }

    try {
      // الحصول على العضو المذكور
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply("**يرجى ذكر العضو الذي تريد إزالته**.");
      }

      // التحقق من بيانات التذكرة في القناة
      const ticketData = Data.get(`channel${message.channel.id}`);
      if (!ticketData) {
        return message.reply('لم يتم العثور على بيانات التذكرة لهذه القناة.');
      }

      // إزالة صلاحيات عرض القناة للعضو المذكور
      await message.channel.permissionOverwrites.edit(member.id, {
        VIEW_CHANNEL: false
      });

      // تأكيد العملية
      message.react('✅');

    } catch (error) {
      console.error('حدث خطأ أثناء إزالة العضو من التذكرة:', error);
      message.reply('حدث خطأ أثناء معالجة الطلب.');
    }
  },
};
