const { Client, Collection, MessageAttachment, WebhookClient, Intents, MessageButton, MessageSelectMenu, MessageActionRow, MessageModal, Role, Modal, TextInputComponent, MessageEmbed } = require("discord.js");
const { owners, prefix } = require(`${process.cwd()}/config`);
const db = require(`pro.db`);

module.exports = {
  name: "setticket",
  description: "A simple ping command.",
  run: async (client, message) => {

    if (!owners.includes(message.author.id)) return message.react('❌');
    const isEnabled = db.get(`command_enabled_${module.exports.name}`);
    if (isEnabled === false) {
      return;
    }

    const Color = db.get(`Guild_Color = ${message.guild?.id}`) || `#5c5e64`;
    if (!Color) return;

    const Image = await db.get(`imagePath_create_${message.guild.id}`);

    const Channel = db.get(`Channel = [${message.guild.id}]`);
    const Cat = db.get(`Cat = [${message.guild.id}]`);

    if (!Cat || !Role || !Channel || !Image) {
      let missingItems = [];
      if (!Cat) missingItems.push(`\`#1\` ${prefix}settings : تعيين الكاتاقوري`);
      if (!Channel) missingItems.push(`\`#2\` ${prefix}settings : تعين شات لوج التذكرة`);
      if (!Image) missingItems.push(`\`#3\` ${prefix}settings : تعيين صورة التذكرة`);

      const missingEmbed = new MessageEmbed()
        .setColor(Color || '#5c5e64')
        .setDescription(`**يرجى تنصيب باقي الأوامر:**\n${missingItems.join('\n')}.`);


      return message.reply({ embeds: [missingEmbed] });
    }
    if (message.author.bot) return;
    if (!owners.includes(message.author.id)) return message.react('❌');
    if (!message.guild) return;

    const menuOptions = db.get(`menuOptions_${message.guild.id}`) || [
      { label: 'افتح تذكرتك من هُنا.', value: 'M1' },
    ];
    const Emb = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(`M0`)
        .setOptions(menuOptions)
        .setPlaceholder("يرجى اختيار نوع التذكرة")
    );

    const args = message.content.split(' ').slice(1);

    // تحقق من وجود نص بعد الأمر
    if (args.length > 0) {
      const userMessage = args.join(" ");

      const embed = new MessageEmbed()
        .setDescription(userMessage)
        .setColor(Color || '#5c5e64')
        .setImage(Image);

      message.channel.send({ embeds: [embed], components: [Emb] }).then(async () => {
        await message.delete();

      });
    } else {
      const attachment = new MessageAttachment(Image);
      // إرسال الصورة كما هي
      message.channel.send({ files: [attachment], components: [Emb] });
      await message.delete();

    }
  },
};
