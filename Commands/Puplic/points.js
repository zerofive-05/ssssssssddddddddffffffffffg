const db = require("pro.db");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "points",
    aliases: ["نقاطي", "نقاط"],
    run: async (client, message, args) => {
        const userIds = db.get(`Users_${message.guild.id}`) || [];
        const claimerId = await db.get(`claimed_${message.channel.id}`);

        if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id) && !userIds.includes(message.author.id) && message.author.id !== claimerId) return message.react('❌');

        const userId = message.author.id; // الحصول على معرف المستخدم من كاتب الرسالة
        const points = db.get(`points_${userId}`) || 0; // الحصول على النقاط من قاعدة البيانات، القيمة الافتراضية هي 0 إذا لم يتم العثور عليها


        // إنشاء رسالة مدمجة لعرض عدد النقاط
        const pointsEmbed = new MessageEmbed()
            .setColor('#5c5e64')
            .setTitle('نقاط العضو')
            .setDescription(`**لديك ${points} نقطة!**`)

        // إرسال الرسالة المدمجة
        message.channel.send({ embeds: [pointsEmbed] });
    },
};
