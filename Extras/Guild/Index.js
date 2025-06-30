const { Client, intents, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu, WebhookClient, MessageModal, Role, Modal, TextInputComponent, Permissions } = require("discord.js");
const { createCanvas, registerFont, canvas, loadImage } = require("canvas");
const Discord = require("discord.js");
var { inviteTracker } = require("discord-inviter");
let client = require('../..');
const fs = require("fs");
const ms = require(`ms`);
const { prefix, owners, Guild, token } = require(`${process.cwd()}/config`);
const config = require(`${process.cwd()}/config`);
const Data = require("pro.db");
const db = require(`pro.db`);
module.exports = client;
client.config = require(`${process.cwd()}/config`);
//const tracker = new inviteTracker(client);
const { createTranscript } = require("discord-html-transcripts");
const { Canvas, loadFont } = require('canvas-constructor/cairo');
const humanizeDuration = require('humanize-duration');
const emojione = require('emojione');

const B = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId(`Close`)
        .setStyle(`SECONDARY`)
        .setEmoji(`1281958043524796457`),
    new MessageButton()
        .setCustomId(`Adding`)
        .setStyle(`SECONDARY`)
        .setEmoji(`1281957871709323315`),
);

client.on('interactionCreate', async function (Message) {
    const Color = db.get(`Guild_Color = ${Message.guild.id}`) || '#000000';
    if (!Color) return;
    if (Message.isSelectMenu()) {
        const blockRoleId = db.get(`blockRole_${Message.guild.id}`);
        const blockRole = Message.guild.roles.cache.get(blockRoleId);
        if (db.get(`blocked_${Message.user.id}`) || (blockRole && Message.member.roles.cache.has(blockRole.id))) {
            return Message.reply({ content: '**أنت محظور من فتح أي تذكرة.**', ephemeral: true });
        }
        if (Message.customId === 'M0') {
            const Image = await db.get(`imagePath_open_${Message.guild.id}`);
            const Cat = await db.get(`Cat = [${Message.guild.id}]`);
            const roles = await db.get(`Roles_${Message.guild.id}`) || [];
            const ReasonOptions = await db.get(`menuOptions_${Message.guild.id}`) || [];
            const Parent = Message.guild.channels.cache.find(C => C.id === Cat);
            const userIds = await db.get(`Users_${Message.guild.id}`) || [];
            const selectedOption = ReasonOptions.find(option => option.value === Message.values[0]);
            const reason = selectedOption ? selectedOption.label : 'No Reason Provided';
            const acceptChannel = await db.get(`acceptChannel_${Message.guild.id}`) || 0;
            const acceptEnable = await db.get(`tcaccept_${Message.guild.id}`) || 0;
            const getAcceptChannel = client.channels.cache.find(c => c.id == acceptChannel);


            if (acceptEnable && acceptChannel) {
                if (db.get(`member${Message.user.id}`) === true)
                    return Message.reply({ content: '**عندك تذكرة مفتوح بالفعل!**', ephemeral: true });
                const acceptImage = await db.get(`imagePath_accept_${Message.guild.id}`);
                const attachment = new MessageAttachment(acceptImage);
                const exampleEmbed = new MessageEmbed()
                    .setColor('#2a2c31')
                    .setAuthor({ name: `${Message.user.username}`, iconURL: Message.user.displayAvatarURL() })
                    .addField('طلب من', `<@${Message.user.id}>`, true)
                    .addField('نوع التذكرة', reason, true)
                    .addField('الإستلام', 'لم يستلم بعد', true)
                    .setTimestamp()
                const AcceptRow = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId(`Accept`)
                        .setStyle(`SUCCESS`)
                        .setLabel('قبول'),
                );
                await getAcceptChannel.send({ content: '@everyone', embeds: [exampleEmbed], components: [AcceptRow], files: [attachment] });
                await Message.reply({ content: `**تم إنشاء الطلب الرجاء الإنتظار ..**`, ephemeral: true });
            } else {
                if (db.get(`member${Message.user.id}`) === true)
                    return Message.reply({ content: '**عندك تذكرة مفتوح بالفعل!**', ephemeral: true });
                let ticketNaming;
                let getNaming = db.get(`tcnaming_${Message.guild.id}`) || "user"
                let ticketCount = await db.get(`ticketCount_${Message.guild.id}`) || 0;
                if (getNaming == "user") {
                    ticketNaming = `ticket-${Message.user.username}`
                } else if (getNaming == "number") {
                    ticketNaming = `ticket-${ticketCount}`
                }
                await Message.guild.channels.create(ticketNaming, {
                    type: 'GUILD_TEXT',
                    parent: Parent.id,
                    permissionOverwrites: [
                        {
                            id: Message.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                        },
                        {
                            id: Message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL'],
                        },
                        ...roles.map(role => ({
                            id: role,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                        })),
                        ...userIds.map(userId => ({
                            id: userId,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                        })),
                    ],
                }).then(async Cahnnels => {
                    let ticketCount = await db.get(`ticketCount_${Message.guild.id}`) || 0;
                    console.log(`Old ticketCount: ${ticketCount}`);
                    ticketCount += 1;
                    await db.set(`ticketCount_${Message.guild.id}`, ticketCount);
                    console.log(`New ticketCount: ${ticketCount}`);

                    db.set(`channel${Cahnnels.id}`, Message.user.id);
                    db.set(`member${Message.user.id}`, true);
                    await Message.reply({ content: `**تم إنشاء التذكرة ${Cahnnels}**`, ephemeral: true });
                    const content = `@everyone\n${Message.user.id}\nنوع التذكرة : ${reason}`;

                    const attachment = new MessageAttachment(Image);
                    Cahnnels.send({ files: [attachment] }).then(async () => {
                        await Cahnnels.send({ content: `${content}`, components: [B] }).then(async () => {
                            setTimeout(() => {
                                const tcsend = db.get(`tcsend_${Message.guild.id}`);
                                if (tcsend) {
                                    Cahnnels.send(tcsend);

                                }
                            }, 3000);
                        });
                    });
                });
            }
        } else if (['M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13'].includes(Message.values[0])) {
            const Image = await db.get(`imagePath_open_${Message.guild.id}`);
            const roles = await db.get(`Roles_${Message.guild.id}`);
            const Cat = db.get(`Cat = [${Message.guild.id}]`);
            const Parent = Message.guild.channels.cache.find(C => C.id === Cat);
            const userIds = await db.get(`Users_${Message.guild.id}`) || [];

            if (db.get(`member${Message.user.id}`) === true)
                return Message.reply({ content: '**لديك تذكرة مفتوح بالفعل!**', ephemeral: true });
            let ticketNaming;
            let getNaming = db.get(`tcnaming_${Message.guild.id}`) || "user"
            let ticketCount = await db.get(`ticketCount_${Message.guild.id}`) || 0;
            if (getNaming == "user") {
                ticketNaming = `ticket-${Message.user.username}`
            } else if (getNaming == "number") {
                ticketNaming = `ticket-${ticketCount}`
            }
            await Message.guild.channels.create(ticketNaming, {
                type: 'GUILD_TEXT',
                parent: Parent.id,
                permissionOverwrites: [
                    {
                        id: Message.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    },
                    {
                        id: Message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    ...roles.map(role => ({
                        id: role,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    })),
                    ...userIds.map(userId => ({
                        id: userId,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    })),
                ],
            }).then(async Cahnnels => {
                let ticketCount = await db.get(`ticketCount_${Message.guild.id}`) || 0;
                console.log(`Old ticketCount: ${ticketCount}`);
                ticketCount += 1;
                await db.set(`ticketCount_${Message.guild.id}`, ticketCount);
                console.log(`New ticketCount: ${ticketCount}`);

                db.set(`channel${Cahnnels.id}`, Message.user.id);
                db.set(`member${Message.user.id}`, true);
                await Message.reply({ content: `**تم إنشاء التذكرة ${Cahnnels}**`, ephemeral: true });
                const attachment = new MessageAttachment(Image);
                Cahnnels.send({ files: [attachment] }).then(async () => {
                    await Cahnnels.send({ content: `${content}`, components: [B] }).then(async () => {
                    });
                });
            });
        }
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId === "Accept") {
            const userIds = await db.get(`Users_${interaction.guild.id}`) || [];
            const roles = await db.get(`Roles_${interaction.guild.id}`);
            const Role = roles || [];
            const hasRole = Role.length > 0
                ? interaction.member.roles.cache.some(r => Role.includes(r.id))
                : true; // تخطي التحقق من الأدوار إذا لم تكن هناك أدوار محددة
            const isOwner = config.owners.includes(interaction.user.id);
            const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');


            if (!hasRole && !isAdmin && !isOwner) {
                return await interaction.reply({ content: `**لا تستطيع تنفيذ هذا الإجراء..** 🚫`, ephemeral: true });
            }
            const message = interaction.message;
            const embed = message.embeds[0];

            if (!embed || !embed.fields) {
                console.log('Embed or fields not found');
                return;
            }

            const requestedByField = embed.fields.find(field => field.name === 'طلب من');
            const statusField = embed.fields.find(field => field.name === 'الإستلام');
            const reasonField = embed.fields.find(field => field.name === 'نوع التذكرة');

            const extractedID = requestedByField ? requestedByField.value.match(/<@(\d+)>/)[1] : null;
            const extractedAdmin = interaction.user.id;


            let extractedRe = reasonField ? reasonField.value : null;


            requestedByField.value = `<@${extractedID}>`;
            statusField.value = `<@${extractedAdmin}>`;
            db.set(`claimed_${interaction.channel.id}`, interaction.user.id);
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('Accept')
                        .setLabel('تم قبول التذكرة')
                        .setStyle('SUCCESS')
                        .setDisabled(true)
                );

            await interaction.update({
                embeds: [embed],
                components: [row],
                files: interaction.message.attachments.map(attachment => new MessageAttachment(attachment.url))
            });


            const Image = await db.get(`imagePath_open_${interaction.guild.id}`);
            const Cat = await db.get(`Cat = [${interaction.guild.id}]`);

            const Parent = interaction.guild.channels.cache.find(C => C.id === Cat);

            const reason = extractedRe
            let extractedUser = await interaction.guild.members.fetch(extractedID);
            let ticketNaming;
            let getNaming = db.get(`tcnaming_${interaction.guild.id}`) || "user"
            console.log(getNaming)
            let ticketCount = await db.get(`ticketCount_${interaction.guild.id}`) || 0;
            if (getNaming == "user") {
                ticketNaming = `ticket-${extractedUser.user.username}`
            } else if (getNaming == "number") {
                ticketNaming = `ticket-${ticketCount}`
            }
            await interaction.guild.channels.create(ticketNaming, {
                type: 'GUILD_TEXT',
                parent: Parent.id,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: extractedID,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    },
                    ...userIds.map(userId => ({
                        id: userId,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                    })),
                ],
            }).then(async Cahnnels => {
                let ticketCount = await db.get(`ticketCount_${interaction.guild.id}`) || 0;
                console.log(`Old ticketCount: ${ticketCount}`);
                ticketCount += 1;
                await db.set(`ticketCount_${interaction.guild.id}`, ticketCount);
                console.log(`New ticketCount: ${ticketCount}`);

                db.set(`channel${Cahnnels.id}`, interaction.user.id);
                db.set(`member${interaction.user.id}`, true);
                await interaction.reply({ content: `**تم إنشاء التذكرة ${Cahnnels}**`, ephemeral: true });
                const content = `@everyone\n${interaction.user}\nنوع التذكرة : ${reason}`;
                const attachment = new MessageAttachment(Image);
                await Cahnnels.send({ files: [attachment] }).then(async () => {
                    await Cahnnels.send({ content: `${content}`, components: [B] }).then(async () => {
                        setTimeout(() => {
                            const tcsend = db.get(`tcsend_${interaction.guild.id}`);
                            Cahnnels.send(`هنا لمساعدتك ,<@${extractedAdmin}> `);
                            if (tcsend) {
                                Cahnnels.send(tcsend);

                            }
                        }, 3000);
                    });
                });
            });
        }
        if (interaction.customId === "Close") {
            const openerId = await db.get(`channel${interaction.channel.id}`);
            const claimerId = await db.get(`claimed_${interaction.channel.id}`);
            const userIds = await db.get(`Users_${interaction.guild.id}`) || [];

            // تحقق من الأذونات
            if (!interaction.member.permissions.has('ADMINISTRATOR') &&
                !config.owners.includes(interaction.user.id) &&
                !userIds.includes(interaction.user.id) &&
                interaction.user.id !== claimerId) {

                return await interaction.reply({ content: `**لا تستطيع تنفيذ هذا الإجراء ..** 🚫`, ephemeral: true });
            }



            const ActionRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`AddPoint`)
                    .setStyle(`SUCCESS`)
                    .setLabel('إضافة نقطة'),
                new MessageButton()
                    .setCustomId(`ConfirmDelete`)
                    .setStyle(`DANGER`)
                    .setLabel('حذف التذكرة'),
                new MessageButton()
                    .setCustomId(`Reopen`)
                    .setStyle(`SECONDARY`)
                    .setLabel('فتح التذكرة')
            );

            if (openerId) {
                await interaction.channel.permissionOverwrites.edit(openerId, {
                    VIEW_CHANNEL: false,
                });
            }

            if (claimerId) {
                await interaction.channel.permissionOverwrites.edit(claimerId, {
                    VIEW_CHANNEL: false,
                });
            }
            await interaction.reply({ content: `**اختر الإجراء المطلوب:**`, components: [ActionRow] });

        } else if (interaction.customId === "ConfirmDelete") {
            const userIds = db.get(`Users_${interaction.guild.id}`) || [];


            if (!interaction.member.permissions.has('ADMINISTRATOR') && !config.owners.includes(interaction.user.id) && !userIds.includes(interaction.user.id)) {
                return await interaction.reply({ content: `** لا تستطيع تنفيذ هذا الإجراء  ..** 🚫`, ephemeral: true });
            }

            const Channel = client.channels.cache.find(C => C.id == `${db.get(`Channel = [${interaction.guild.id}]`)}`);
            if (!Channel) return;

            const transcript = await createTranscript(interaction.channel, {
                returnType: 'buffer',
                minify: true,
                saveImages: true,
                useCDN: true,
                poweredBy: false,
                fileName: `${interaction.channel.name}.html`,
            });

            const Color = db.get(`Guild_Color = ${interaction.guild.id}`) || '#000000';
            if (!Color) return;

            const embed = new MessageEmbed()
                .setColor(Color || '#000000')
                .setAuthor(`${interaction.user.tag}`, interaction.user.avatarURL({ dynamic: true, size: 1024, format: 'png' }))
                .setDescription(`**إغلاق تذكرة**\n**
          تذكرة : <@${db.get(`channel${interaction.channel.id}`)}>
          بواسطة : ${interaction.user}
          اسم التذكرة : ${interaction.channel.name}**`)
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL())
                .setTimestamp();

            await interaction.reply({ content: `**🎫 سيتم حذف التذكرة خلال ثواني**`, ephemeral: true });
            await Channel.send({ files: [transcript], embeds: [embed] });

            // إخفاء القناة عن المستخدم الذي فتح التذكرة والذي استلمها
            const openerId = db.get(`channel${interaction.channel.id}`);
            const claimerId = db.get(`claimed_${interaction.channel.id}`);
            await interaction.channel.permissionOverwrites.edit(openerId, { VIEW_CHANNEL: false });
            if (claimerId) {
                await interaction.channel.permissionOverwrites.edit(claimerId, { VIEW_CHANNEL: false });
            }

            setTimeout(async () => {
                if (db.get(`channel${interaction.channel.id}`)) {
                    let Member = client.users.cache.find((x) => x.id == db.get(`channel${interaction.channel.id}`));
                    db.delete(`member${Member.id}`);
                    db.delete(`channel${interaction.channel.id}`);
                }
                await interaction.channel.delete();
            }, 5000);
        } else if (interaction.customId === "Adding") {
            const claimerId = await db.get(`claimed_${interaction.channel.id}`);
            const userIds = db.get(`Users_${interaction.guild.id}`) || [];
            // تحقق من الأذونات اللازمة
            if (interaction.user.id !== claimerId && !interaction.member.permissions.has('ADMINISTRATOR') && !config.owners.includes(interaction.user.id) && !userIds.includes(interaction.user.id)) {
                return await interaction.reply({ content: `** لا تستطيع تنفيذ هذا الإجراء  ..** 🚫`, ephemeral: true });
            }
            const Services = new Modal().setCustomId(`add`).setTitle(`اضافه شخص`);
            const Service_1 = new TextInputComponent().setCustomId('Ad').setLabel(`ضف ايدي الشخص`).setStyle(`SHORT`).setPlaceholder(' ').setRequired(true);
            const Service1 = new MessageActionRow().addComponents(Service_1);
            Services.addComponents(Service1);
            interaction.showModal(Services);
        } else if (interaction.customId === "AddPoint") {
            const userIds = db.get(`Users_${interaction.guild.id}`) || [];


            if (!interaction.member.permissions.has('ADMINISTRATOR') && !config.owners.includes(interaction.user.id) && !userIds.includes(interaction.user.id)) {
                return await interaction.reply({ content: `** لا تستطيع تنفيذ هذا الإجراء  ..** 🚫`, ephemeral: true });
            }

            const claimerId = await db.get(`claimed_${interaction.channel.id}`);
            if (claimerId) {
                const points = await db.get(`points_${claimerId}`) || 0;
                db.set(`points_${claimerId}`, points + 1);
                await interaction.reply({ content: `**تمت إضافة نقطة. النقاط الحالية: ${points + 1}**`, ephemeral: true });
            }
        } else if (interaction.customId === "Reopen") {

            const openerId = await db.get(`channel${interaction.channel.id}`);
            const claimerId = await db.get(`claimed_${interaction.channel.id}`);
            const userIds = await db.get(`Users_${interaction.guild.id}`) || [];

            if (!interaction.member.permissions.has('ADMINISTRATOR') && !config.owners.includes(interaction.user.id) && !userIds.includes(interaction.user.id) && interaction.user.id !== claimerId) {
                return await interaction.reply({ content: `** لا تستطيع تنفيذ هذا الإجراء  ..** 🚫`, ephemeral: true });
            }


            // كود إعادة فتح التذكرة هنا
            const channel = interaction.channel;
            const permissions = [
                {
                    id: claimerId,
                    allow: ['VIEW_CHANNEL', 'ATTACH_FILES'],
                },
                {
                    id: openerId,
                    allow: ['VIEW_CHANNEL', 'ATTACH_FILES'],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                ...userIds.map(userId => ({
                    id: userId,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                })),
            ];
            await channel.permissionOverwrites.set(permissions);
            await interaction.reply({ content: `**تمت إعادة فتح التذكرة**`, ephemeral: true });
        } else if (interaction.customId === "Claim") {
            const userIds = await db.get(`Users_${interaction.guild.id}`) || [];
            const castumar = await db.get(`channel${interaction.channel.id}`);
            const roles = await db.get(`Roles_${interaction.guild.id}`);
            const Role = roles || [];
            const hasRole = Role.length > 0
                ? interaction.member.roles.cache.some(r => Role.includes(r.id))
                : true; // تخطي التحقق من الأدوار إذا لم تكن هناك أدوار محددة
            const isOwner = config.owners.includes(interaction.user.id);
            const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');

            // التحقق من وجود دور مناسب أو صلاحيات إدارية أو كون المستخدم مالك
            if (!hasRole && !isAdmin && !isOwner) {
                return await interaction.reply({ content: `**لا تستطيع تنفيذ هذا الإجراء..** 🚫`, ephemeral: true });
            }

            // تعيين القناة على أنها تم استلامها
            db.set(`claimed_${interaction.channel.id}`, interaction.user.id);

            // إعداد زر "Claim" غير نشط
            const disabledClaimButton = new MessageButton()
                .setCustomId('Claim')
                .setStyle('SECONDARY')
                .setLabel(interaction.user.displayName || interaction.user.username)
                .setDisabled(true);

            // إعداد ActionRow الجديد مع الزر غير النشط
            const actionRow = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('Close')
                    .setStyle('SECONDARY')
                    .setEmoji('1262158989236637707'),
                new MessageButton()
                    .setCustomId('Adding')
                    .setStyle('SECONDARY')
                    .setEmoji('1262158887725957211'),
                disabledClaimButton
            );

            // إعداد Embed جديد
            const embed = new MessageEmbed()
                .setColor("#5c5e64")
                .addFields(
                    {
                        name: "قام بفتح التكت",
                        value: `👤 <@${castumar}>`,
                    },
                    {
                        name: "قام بالاستلام",
                        value: `👨‍✈️ ${interaction.user} `,
                    }
                )
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL())
                .setThumbnail(`https://g.top4top.io/p_3148c7sre1.png`);
            console.log("dd")
            const permissions = [
                ...userIds.map(userId => ({
                    id: userId,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                })),
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: castumar,
                    allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
                }
            ];

            // إضافة الأدوار المخصصة إذا كان هناك أدوار تتطلب الأذونات
            if (roles && roles.length > 0) {
                permissions.push(...roles.map(roleId => ({
                    id: roleId,
                    deny: ['VIEW_CHANNEL'],
                })));
            }

            await interaction.channel.permissionOverwrites.set(permissions);

            // تحديث الرسالة لإزالة إشعار @everyone
            const originalMessage = await interaction.channel.messages.fetch(interaction.message.id);
            const originalContent = originalMessage.content.replace(/@everyone/g, '');

            const Channel = client.channels.cache.find(C => C.id == `${db.get(`Channel = [${interaction.guild.id}]`)}`);

            if (Channel) {
                await Channel.send({ embeds: [embed] });
            }

            await interaction.reply({ content: `**تم استلام التذكرة بواسطة ${interaction.user}**`, ephemeral: true });
            await interaction.channel.send({ content: `**تم استلام التذكرة بواسطة ${interaction.user}**` })
            // تحديث الرسالة لإضافة الـ Embed الجديد وتحديث ActionRow
            await interaction.message.edit({ content: originalContent, components: [actionRow] });
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "add") {
            const Service1 = interaction.fields.getTextInputValue('Ad');
            const Member = await interaction.guild.members.cache.get(Service1);
            const channel = interaction.channel;

            await channel.permissionOverwrites.edit(Member, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
            await interaction.reply({ content: `**تم إضافة الشخص لتذكرة : ${Member}**`, ephemeral: true }).catch(() => { });
        }
    }
});

client.on('channelDelete', async channel => {
    if (channel.type === 'GUILD_TEXT' && db.has(`channel${channel.id}`)) {
        const memberId = db.get(`channel${channel.id}`);
        const member = await channel.guild.members.fetch(memberId);

        db.delete(`channel${channel.id}`);
        db.delete(`member${member.id}`);
    }
});