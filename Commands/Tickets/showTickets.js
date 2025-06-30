const { MessageEmbed } = require('discord.js');
const db = require('pro.db');
const config = require(`${process.cwd()}/config`);

module.exports = {
    name: "showtickets",
    description: "Show all open tickets",
    run: async (client, message) => {
        // Check if the user has the necessary permissions
        if (!message.member.permissions.has('ADMINISTRATOR') && !config.owners.includes(message.author.id)) {
            return message.reply("**ليس لديك الأذونات اللازمة لعرض التذاكر.** 🚫");
        }

        const ticketCount = await db.get(`ticketCount_${message.guild.id}`) || 0;

        // إنشاء Embed لعرض عدد التذاكر
        const embed = new MessageEmbed()
            .setColor('#5c5e64') // يمكنك تغيير اللون
            .setTitle('عددالتكتات ')
            .setDescription(`**عدد التكتات في السيرفر: ${ticketCount}**`)
            .setThumbnail(`https://cdn.discordapp.com/attachments/1339303976369258609/1342172413810446357/Untitled_design_47.png?ex=67b8aaf7&is=67b75977&hm=bee302fc3874d26d55d698df5f05ba7c60c8c7437e265dc88218e4268e473d0e&`)
            .setFooter({ text: 'Sight Store', iconURL: 'https://cdn.discordapp.com/attachments/1339303976369258609/1342172413810446357/Untitled_design_47.png?ex=67b8aaf7&is=67b75977&hm=bee302fc3874d26d55d698df5f05ba7c60c8c7437e265dc88218e4268e473d0e&' });

        // إرسال الإطار المضمّن
        message.channel.send({ embeds: [embed] });
    }
};
