const { MessageEmbed } = require('discord.js');
const Data = require('pro.db');
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
  name: 'block',
  description: 'يقوم بحظر عضو من فتح أي تذكرة',
  run: async (client, message, args) => {
    const userIds = await Data.get(`Users_${message.guild.id}`) || [];
  
    // التحقق من صلاحيات المستخدم
    if (!message.member.permissions.has('ADMINISTRATOR') && 
        !owners.includes(message.author.id) && 
        !userIds.includes(message.author.id)) {
      return message.react('❌');
    }

    // التحقق من تفعيل الأمر
    const isEnabled = Data.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) {
      return message.reply('هذا الأمر غير مفعل.');
    }

    try {
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply("**يرجى ذكر العضو الذي تريد حظره**.");
      }

      const isBlocked = Data.get(`blocked_${member.id}`);

      if (isBlocked) {
        // إلغاء حظر العضو
        Data.delete(`blocked_${member.id}`);
        message.reply(`تم إلغاء الحظر عن ${member.user.tag}.`);
      } else {
        // حظر العضو
        Data.set(`blocked_${member.id}`, true);
        message.reply(`تم حظر ${member.user.tag} من فتح أي تذكرة.`);
      }

      message.react('✅');
      
    } catch (error) {
      console.error('حدث خطأ أثناء معالجة الطلب:', error);
      message.reply('حدث خطأ أثناء معالجة الطلب.');
    }
  },
};
