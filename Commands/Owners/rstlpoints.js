const db = require("pro.db");
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
    name: "rstlpoints",
    aliases: ["تصفير"],
    run: async (client, message, args) => {
        const userIds = db.get(`Users_${message.guild.id}`) || [];

        if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id) && !userIds.includes(message.author.id)) return message.react('❌');


        // الحصول على جميع الأعضاء في السيرفر
        const guildMembers = message.guild.members.cache;

        // تصفير النقاط لكل عضو في السيرفر
        guildMembers.forEach(async (member) => {
            await db.set(`points_${member.id}`, 0);
        });

        // عرض رسالة تأكيد تصفير النقاط لجميع الأعضاء
        message.reply("تم تصفير نقاط جميع الأعضاء في السيرفر.");
    },
};