const db = require("pro.db");
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
    name: "rstpoint",
    aliases: ["صفر"],
    run: async (client, message, args) => {
        const userIds = db.get(`Users_${message.guild.id}`) || [];

        if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id) && !userIds.includes(message.author.id)) return message.react('❌');

        const mentionedMember = message.mentions.members.first(); // العضو المذكور

        if (!mentionedMember) {
            return message.reply("يرجى منشن العضو الذي تريد صفر نقاطه.");
        }

        // صفر النقاط للعضو المحدد
        db.set(`points_${mentionedMember.id}`, 0);

        // عرض رسالة تأكيد صفر النقاط للعضو
        message.reply(`تم صفر نقاط العضو ${mentionedMember}.`);
    },
};
