
const { CommandInteraction, MessageEmbed } = require('discord.js');
const db = require('pro.db'); // تأكد من استخدام المكتبة الصحيحة لقاعدة البيانات

module.exports = {
    name: 'adminchannel',
    description: 'Set the admin channel for the bot commands.',
    options: [
        {
            name: 'channelid',
            description: 'The ID of the admin channel.',
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction) => {
        if (!interaction.isCommand()) return;

        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'You need to be an administrator to use this command.', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const channelId = interaction.options.getString('channelid');

        // Check if the provided channel ID is valid
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return interaction.followUp({ content: '**الشات غير موجود.**', ephemeral: true });
        }

        // Save the admin channel ID to database (assuming you have a database setup)
        db.set(`${interaction.guild.id}_adminchannel`, channelId);

        interaction.followUp({ content: '**تم تعيين الشات الآن.**', ephemeral: true });
    },
};
