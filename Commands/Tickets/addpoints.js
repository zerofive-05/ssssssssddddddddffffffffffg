const db = require ("pro.db"); 
const { owners } = require(`${process.cwd()}/config`);

module.exports = {
    name: "add",
    aliases: ["نقاط"],
    run: async (client, message, args) => {
        const userIds = db.get(`Users_${message.guild.id}`) || [];

        // التحقق من أن المستخدم هو أحد المالكين
        if (!owners.includes(message.author.id) && !userIds.includes(message.author.id)) {
            return message.reply("لا يمكنك استخدام هذا الأمر، أنت لست صاحب البوت.");
        }

        const mentionedMember = message.mentions.members.first(); // يأخذ العضو الذي تمت مناشته
        const points = parseInt(args[1]); // النقاط هنا في الوسيطة الثانية (args[1])

        if (!mentionedMember) {
            return message.reply("يرجى منشن العضو الذي تريد إضافة النقاط له.");
        }

        if (isNaN(points)) {
            return message.reply("الرجاء إدخال رقم صحيح للنقاط.");
        }

        // إضافة النقاط للعضو الذي تم منشنه
        db.add(`points_${mentionedMember.id}`, points);

        // جلب إجمالي النقاط بعد الإضافة
        let totalPoints = await db.get(`points_${mentionedMember.id}`);

        // عرض رسالة تأكيد الإضافة مع عرض النقاط الجديدة
        message.reply(`تمت إضافة ${points} نقطة للعضو ${mentionedMember}. النقاط الجديدة: ${totalPoints}.`);
    },
};
