const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { prefix } = require(`${process.cwd()}/config`); // تحميل prefix من config
const db = require(`pro.db`);

module.exports = {
    name: "come",
    description: "Invite someone to a channel",
    run: async (client, message, args) => {
        if (!message.content.startsWith(prefix + "come")) return;

        const userIds = db.get(`Users_${message.guild.id}`) || [];
        const claimerId = await db.get(`claimed_${message.channel.id}`);
    
        if (!message.member.permissions.has('ADMINISTRATOR') && !owners.includes(message.author.id) && !userIds.includes(message.author.id) && message.author.id !== claimerId) return message.react('❌');
    
        const Color = db.get(`Guild_Color_${message.guild.id}`) || '#5c5e64';

        // التحقق من وجود اللون
        if (!Color) {
            return;
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            const embed = new MessageEmbed()
            .setColor(Color || '#5c5e64')
                .setDescription(` **يرجى كتابة الأمر بشكل صحيح: ${prefix}come [ منشن الشخص] .**`);
            return message.reply({ embeds: [embed] });
        }
        

        // Creating the button
        let inviteButton = new MessageButton()
            .setLabel("التكت")
            .setStyle("LINK")
            .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}`);

        // Adding the button to a row
        let row = new MessageActionRow().addComponents(inviteButton);

        // Sending the message
        user.send({
            content: `<@${user.id}>`,
            embeds: [
                new MessageEmbed()
                    .setDescription(`> **استدعاء**\n> **<@${message.author.id}> من فضلك قم بالتوجه لتكت**`)
                    .setColor("#5c5e64")
                    .setTimestamp()
                    .setThumbnail('https://cdn.discordapp.com/attachments/1335548832225693717/1337180934226706502/Untitled_design_47.png?ex=67b45a0a&is=67b3088a&hm=a88ff99116ac104e752a843bdb302832b319bf5b8b27f429cc3af4338ba8c16e&')
            ],
            components: [row]
        }).then(() => {
            message.reply(`تم الاستدعاء ${user.user.tag}.`);
        }).catch((err) => {
            console.error(`Error sending message to ${user.user.tag}:`, err);
            message.channel.send(`Failed to send a message to ${user.user.tag}.`);
        });
    },
};
