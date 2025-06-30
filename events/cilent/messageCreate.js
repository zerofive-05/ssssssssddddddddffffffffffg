const client = require("../../index");
const Data = require("pro.db");
const Pro = require("pro.db");

module.exports = async (client, message) => {
    try {
        // التحقق من أن الرسالة ليست من بوت، وأنها في خادم، وأن الرسالة تبدأ بالبريفكس الصحيح
        if (
            !message ||
            message.author.bot ||
            !message.guild ||
            !message.content ||
            !message.content.toLowerCase().startsWith(client.config.prefix)
        ) {
            return;
        }

        // استخراج الأمر والمعاملات
        const [cmd, ...args] = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ +/g);

        // العثور على الأمر المناسب
        const command = client.commands.get(cmd.toLowerCase()) || 
                        client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

        if (!command || typeof command.run !== 'function') return;

        // تنفيذ الأمر
        await command.run(client, message, args);
    } catch (error) {
        console.error('An error occurred while processing the message:', error);
    }
};
