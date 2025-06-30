const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const db = require("pro.db");

module.exports = {
    name: "top",
    aliases: ["توب"],
    run: async (client, message, args) => {
        const userIds = db.get(`Users_${message.guild.id}`) || [];
        const claimerId = await db.get(`claimed_${message.channel.id}`);

        if (!userIds.includes(message.author.id) && message.author.id !== claimerId) return message.react('❌');

        try {
            // مصفوفة لتخزين جميع الأعضاء الذين لديهم نقاط
            let membersWithPoints = [];

            // الحصول على الأعضاء الذين لديهم نقاط
            const guildMembers = await message.guild.members.fetch();

            // الحصول على النقاط لكل عضو وتخزينها في المصفوفة
            for (const [memberID, member] of guildMembers) {
                let userPoints = await db.get(`points_${memberID}`);
                if (userPoints) {
                    membersWithPoints.push({
                        member: member,
                        points: userPoints
                    });
                }
            }

            // إذا لم يكن هناك أعضاء لديهم نقاط
            if (membersWithPoints.length === 0) {
                return message.channel.send("لا يوجد أعضاء لديهم نقاط حاليًا.");
            }

            // ترتيب الأعضاء بحسب النقاط (من الأعلى إلى الأقل)
            membersWithPoints.sort((a, b) => b.points - a.points);

            // عدد الأعضاء لكل صفحة
            const itemsPerPage = 10;
            let page = 1; // الصفحة الحالية

            // حساب عدد الصفحات
            const totalPages = Math.ceil(membersWithPoints.length / itemsPerPage);

            const generateEmbed = (page) => {
                const start = (page - 1) * itemsPerPage;
                const end = page * itemsPerPage;

                const leaderboardList = membersWithPoints.slice(start, end)
                    .map((memberInfo, index) => `${start + index + 1}. ${memberInfo.member} - ${memberInfo.points} نقطة`);

                const embed = new MessageEmbed()
                    .setTitle(`التوب ${page}/${totalPages}`)
                    .setDescription(leaderboardList.join('\n')) // انضمام القائمة إلى سلسلة واحدة للوصف
                    .setColor("#5c5e64");

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('previous_page')
                            .setEmoji(`⬅️`)
                            .setStyle('SECONDARY')
                            .setDisabled(page === 1), // تعطيل الزر إذا كانت هذه هي الصفحة الأولى
                        new MessageButton()
                            .setCustomId('next_page')
                            .setEmoji(`➡️`)
                            .setStyle('SECONDARY')
                            .setDisabled(page === totalPages), // تعطيل الزر إذا كانت هذه هي الصفحة الأخيرة
                    );

                return { embeds: [embed], components: [row] };
            };

            const leaderboardMessage = await message.channel.send(generateEmbed(page));

            // إضافة التفاعلات للتقليب بين الصفحات
            const filter = (interaction) => interaction.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                if (interaction.isButton()) {
                    if (interaction.customId === 'previous_page' && page > 1) {
                        page--;
                    } else if (interaction.customId === 'next_page' && page < totalPages) {
                        page++;
                    }

                    await interaction.update(generateEmbed(page));
                }
            });

            collector.on('end', () => leaderboardMessage.edit({ components: [] }).catch(() => {}));

        } catch (error) {
            console.error(error);
            message.channel.send("حدث خطأ أثناء عرض لوحة المتصدرين.");
        }
    },
};