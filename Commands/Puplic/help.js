const Discord = require("discord.js");
const db = require(`pro.db`);
const { MessageEmbed } = require("discord.js");
const { prefix, owners } = require(`${process.cwd()}/config`);

module.exports = {
    name: 'help', // هنا اسم الامر
    run: async (client, message, args) => {
        
        if (!owners.includes(message.author.id)) return message.react('❌');
        
        const isEnabled = db.get(`command_enabled_${module.exports.name}`);
        if (isEnabled === false) {
            return; 
        }

        const Color = db.get(`Guild_Color_${message.guild.id}`) || '#5c5e64';

        const replyEmbed = new MessageEmbed()
            .setColor(Color)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**أوامر التذكرة:**
                **${prefix}settings**: جميع اوامر التحكم بالتكت
                **${prefix}setticket**:  رسالة التكت
                **${prefix}tcbrole**: اضافة رول بلوك
                **${prefix}blocklist**: روئيه قائمه البلاك ليست
                **${prefix}block**: اعطاء عضو بلوك
                **${prefix}rename**: تعيين إسم جديد لتذكرة
                **${prefix}close**: إغلاق التذكرة
                **${prefix}points**: رؤية نقاط الادارة
                **${prefix}top**: رؤية توب نقاط 
                **${prefix}add**:اضافة نقاط او ازاله من الاداري
                **${prefix}rstpoint**: تصفير نقاط عضو معين
                **${prefix}rstlpoints**: تصفير جميع النقاط 
            `)
            .setFooter({ text: 'Nave Store', iconURL: 'https://cdn.discordapp.com/attachments/1335548832225693717/1337180934226706502/Untitled_design_47.png?ex=67b45a0a&is=67b3088a&hm=a88ff99116ac104e752a843bdb302832b319bf5b8b27f429cc3af4338ba8c16e&' })
            .setThumbnail('https://cdn.discordapp.com/attachments/1335548832225693717/1337180934226706502/Untitled_design_47.png?ex=67b45a0a&is=67b3088a&hm=a88ff99116ac104e752a843bdb302832b319bf5b8b27f429cc3af4338ba8c16e&');

        message.reply({ embeds: [replyEmbed] }).catch(console.error);
    }
}
