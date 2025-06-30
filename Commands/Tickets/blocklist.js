const { Client, MessageEmbed } = require('discord.js');
const db = require('pro.db');
const { prefix, owners } = require(`${process.cwd()}/config`);

module.exports = {
    name: 'blocklist',
    description: 'يعرض جميع المستخدمين والأدوار المخزنين في قاعدة البيانات.',
    run: async (client, message) => {
        // التأكد من أن المرسل ليس بوت
        if (message.author.bot) return;

        // التحقق من أن المرسل هو أحد المالكين
        if (!owners.includes(message.author.id)) {
            return message.react('❌');
        }

        // التحقق من تمكين الأمر
        const isEnabled = db.get(`command_enabled_${module.exports.name}`);
        if (isEnabled === false) {
            return;
        }

        // استرجاع المستخدمين المخزنين
        const userIds = db.get(`blocked_${message.guild.id}`) || [];

        // استرجاع الأدوار المخزنة
        const roleIds = db.get(`blockRole_${message.guild.id}`) || [];

        // التحقق إذا كانت البيانات فارغة
        if (userIds.length === 0 && roleIds.length === 0) {
            return message.channel.send('لا توجد مستخدمين أو أدوار مخزنين.');
        }

        // بناء قائمة الأدوار والمستخدمين
        let description = '';

        // إضافة الأدوار إلى الوصف
        if (roleIds.length > 0) {
            description += roleIds.map(id =>  `(role): <@&${id}>`).join('\n') + '\n';
        }

        // إضافة المستخدمين إلى الوصف
        if (userIds.length > 0) {
            description += userIds.map(id => `(user): <@${id}>`).join('\n');
        }

        // إنشاء Embed لعرض المستخدمين والأدوار
        const embed = new MessageEmbed()
            .setColor('#5c5e64') // يمكنك تغيير اللون
            .setDescription(description)
            .setThumbnail(client.user.displayAvatarURL()) // إضافة الأفاتار الخاص بالبوت
            .setFooter({ text: 'Destiny Store', iconURL: 'https://cdn.discordapp.com/attachments/1312023087939719219/1313589020567273512/emo.png?ex=6751575b&is=675005db&hm=cff8d67f1f5b781c88781a011d22d840c694c90a00d2d862e68cc200171dfd62&' });

        // إرسال الإطار المضمّن
        message.channel.send({ embeds: [embed] });
    }
};
