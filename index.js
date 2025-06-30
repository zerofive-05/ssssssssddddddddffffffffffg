const {
    Client,
    intents,
    Collection,
    MessageEmbed,
    MessageAttachment,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
    Permissions
} = require("discord.js");

const client = new Client({ intents: 32767 });


const fs = require("fs");
const Discord = require("discord.js");
const {  owners, Guild } = require(`${process.cwd()}/config`);
const { createCanvas, registerFont } = require("canvas");
const canvas = require('canvas');
const config = require('./config.json');  // تحميل ملف config
let prefix = config.prefix;  // تخزين البريفكس في متغير ديناميكي


client.on('error', error => console.log(error));
client.on('warn', info => console.log(info));
process.on('unhandledRejection', (reason, p) => {
  console.log(reason.stack ? reason.stack : reason)
});
process.on("uncaughtException", (err, origin) => {
  console.log(err.stack ? err.stack : err)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err.stack ? err.stack : err)
});


module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require(`${process.cwd()}/config`);
require("./handler")(client);
client.prefix = prefix;
client.login(config.token);

require("events").EventEmitter.defaultMaxListeners = 9999999;

fs.readdir(`${__dirname}/events/`, (err, folders) => {
    if (err) return console.error(err);

    folders.forEach(folder => {
        if (folder.includes('.')) return;

        fs.readdir(`${__dirname}/events/${folder}`, (err, files) => {
            if (err) return console.error(err);

            files.forEach(file => {
                if (!file.endsWith('.js')) return;

                let eventName = file.split('.')[0];
                let eventPath = `${__dirname}/events/${folder}/${file}`;

                try {
                    let event = require(eventPath);
                    client.on(eventName, event.bind(null, client));
                } catch (error) {
                }
            });
        });
    });
});
client.on("ready", () => {
    const botId = client.user.id;
    config.botId = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=8&scope=bot`
    fs.writeFile(`${process.cwd()}/config.json`, JSON.stringify(config, null, 4), (err) => {
    });
  });
let lastRepliedMessageId = ''; // تعريف المتغير وتعيينه بقيمة افتراضية

client.on("messageCreate", (message) => {
    // التأكد من أن الرسالة ليست من بوت، وأنها في سيرفر، وأن الرسالة لم تتم معالجتها مسبقًا
    if (message.author.bot || !message.guild || lastRepliedMessageId === message.id) return;

    // الحصول على المنشن الخاص بالبوت (يمكن أن يكون <@ID> أو <@!ID>)
    const botMention = new RegExp(`^<@!?${client.user.id}>`);

    // التحقق إذا كانت الرسالة تحتوي على منشن للبوت
    if (botMention.test(message.content)) {
        // حذف المنشن من بداية الرسالة
        const args = message.content.replace(botMention, '').trim().split(/ +/);

        // استخراج الأمر من الرسالة
        const command = args.shift().toLowerCase();

        // العثور على الأمر وتنفيذه
        const cmd = client.commands.get(command);
        if (cmd) {
            lastRepliedMessageId = message.id; // حفظ معرف الرسالة
            cmd.run(client, message, args).finally(() => {
                lastRepliedMessageId = ''; // إعادة تعيين المعرف بعد انتهاء الرد
            });
        }
    }
});
