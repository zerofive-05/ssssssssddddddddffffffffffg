 const db = require("pro.db");
 const { owners } = require(`${process.cwd()}/config`);

 module.exports = {
    name: "repoints",
   aliases: ["ازاله", "ازالة"],
   run: async (client, message, args) => {
       // التحقق من صلاحيات المستخدم
       if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id)) {
          return message.react('❌');
       }

       // أخذ العضو الذي تم منشنه والنقاط التي سيتم حذفها
        const mentionedMember = message.mentions.members.first();
        const pointsToRemove = parseInt(args[1]);

// التحقق من وجود العضو والرقم صحيح
        if (!mentionedMember) {
            return message.reply("يرجى منشن العضو الذي تريد حذف النقاط منه.");
        }

        if (isNaN(pointsToRemove) || pointsToRemove <= 0) {
           return message.reply("الرجاء إدخال رقم صحيح و إيجابي لعدد النقاط التي تريد حذفها.");
       }

       // جلب النقاط الحالية للعضو

       let currentPoints = await db.get(`points_${mentionedMember.id}`) || 0;

       // التأكد من أن النقاط الحالية كافية لإزالة النقاط
      if (currentPoints < pointsToRemove) {
           return message.reply("العضو لا يمتلك النقاط الكافية للحذف.");
       }

       // حذف النقاط من العضو
       db.set(`points_${mentionedMember.id}`, currentPoints - pointsToRemove);

       // جلب النقاط بعد الحذف
       let updatedPoints = await db.get(`points_${mentionedMember.id}`);

      // عرض رسالة تأكيد الحذف مع عرض النقاط المحدثة
       message.reply(`تم حذف ${pointsToRemove} نقطة من العضو ${mentionedMember}. النقاط الجديدة: ${updatedPoints}.`);
   },
};
