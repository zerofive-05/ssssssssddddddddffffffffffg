const { Client, Message } = require("discord.js");
const { owners } = require(`${process.cwd()}/config`);
const db = require(`pro.db`);

module.exports = {
  name: "tcbrole",
  description: "A simple command to set block roles.",
  run: async (Client, Message) => {
    if (Message.author.bot) return;
    if (!owners.includes(Message.author.id)) return Message.react('❌');
    
    const isEnabled = db.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) return;

    let blockRoles = db.get(`blockRoles_${Message.guild.id}`) || []; // استرجاع الأدوار المخزنة أو مصفوفة فارغة

    if (Message.mentions.roles.size > 0) {
      // إذا تم ذكر أدوار في الرسالة
      Message.mentions.roles.forEach(role => {
        if (!blockRoles.includes(role.id)) {
          blockRoles.push(role.id); // إضافة الرول للمصفوفة إذا لم يكن مضافًا
        }
      });
    } else {
      // إذا تم إعطاء اسم أو ID للرول
      const roleIdOrName = Message.content.split(' ').slice(1).join(' ');
      if (!roleIdOrName) return Message.reply({ content: `**يرجى ارفاق منشن الرول .**` });

      const role = Message.guild.roles.cache.get(roleIdOrName) || 
                   Message.guild.roles.cache.find((r) => r.name === roleIdOrName);
      if (!role) return Message.reply({ content: `**الرول غير موجود.**` });

      if (!blockRoles.includes(role.id)) {
        blockRoles.push(role.id); // إضافة الرول للمصفوفة إذا لم يكن مضافًا
      }
    }

    // حفظ الأدوار المحدثة في قاعدة البيانات
    await db.set(`blockRoles_${Message.guild.id}`, blockRoles);

    Message.react("✅").then(() => {
      Message.reply({ content: `**تم تعيين الأدوار بنجاح.**` });
      console.log(`Block roles set to: ${blockRoles.join(', ')}`);
    });
  },
};
