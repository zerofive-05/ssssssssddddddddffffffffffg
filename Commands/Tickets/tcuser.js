const { Client, Message } = require('discord.js');
const db = require('pro.db');


module.exports = {
  name: 'tcuser',
  description: 'حدد المستخدمين واحفظهم في قاعدة البيانات.',
  run: async (client, message, args) => {
    console.log('Command invoked by:', message.author.id);

    // التأكد من أن الأمر يمكن استخدامه فقط من قبل المالكين
    // if (!client.owners.includes(message.author.id)) {
    //   console.log('Unauthorized user:', message.author.id);
    //   return message.react('❌');
    // }
    console.log('Authorized user:', message.author.id);

    // التحقق مما إذا كان الأمر مفعلًا
    const isEnabled = await db.get(`command_enabled_${module.exports.name}`);
    console.log('Command enabled status:', isEnabled);
    if (isEnabled === false) {
      console.log('Command is disabled.');
      return;
    }

    // تهيئة مصفوفة لاحتواء معرّفات المستخدمين
    let userIds = [];

    // إذا كان هناك إشارات للمستخدمين، الحصول على معرّفات المستخدمين المرسلة
    if (message.mentions.members.size > 0) {
      userIds = message.mentions.members.map(member => member.id);
      console.log('User IDs from mentions:', userIds);
    } else {
      // تقسيم محتوى الرسالة للحصول على معرّفات المستخدمين
      const ids = message.content.split(' ').slice(1);
      if (ids.length === 0) {
        console.log('No user IDs provided.');
        return message.reply({ content: '**يرجى تضمين منشن العضو أو معرّف المستخدم.**' });
      }

      // تصفية معرّفات المستخدمين غير الصحيحة
      userIds = ids.filter(id => message.guild.members.cache.has(id));
      console.log('User IDs from message content:', userIds);
    }

    if (userIds.length === 0) {
      console.log('No valid users found.');
      return message.reply({ content: '**الأعضاء غير موجودين.**' });
    }

    // التفاعل مع الرسالة وبدء المعالجة
    console.log('Reacting to the command message...');
    message.react('✅').then(async () => {
      // استرداد قائمة المستخدمين الحالية من قاعدة البيانات
      const existingUsers = await db.get(`Users_${message.guild.id}`) || [];
      console.log('Existing users from database:', existingUsers);

      // دمج المستخدمين الحاليين مع معرّفات المستخدمين الجديدة، مع التأكد من عدم وجود تكرارات
      const updatedUsers = Array.from(new Set([...existingUsers, ...userIds]));
      console.log('Updated user list:', updatedUsers);

      // تحديث قاعدة البيانات بالقائمة الجديدة للمستخدمين
      await db.set(`Users_${message.guild.id}`, updatedUsers);
      console.log('User list saved to database.');
    });
  },
};
