const { MessageActionRow, MessageSelectMenu, MessageButton, Permissions , MessageEmbed , EmbedBuilder, } = require("discord.js");
const proDb = require("pro.db");
const fetch = require('node-fetch');
let { owners } = require(`${process.cwd()}/config`); // استخدام let بدلاً من const
const Pro = require('pro.db');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageAttachment } = require('discord.js');
const configPath = path.join(__dirname, '../../config.json'); // مسار ملف config.json
const folderPath = path.join(__dirname, 'images');
let config = require(configPath);  // تحميل config
let prefix = config.prefix;  // استخدام البريفكس الديناميكي
const db = require(`pro.db`);

module.exports = {
    name: "tipanel",
    aliases: ["settings"],
    description: "Edit avatar commands",
    run: async (client, message, args) => {

        if (!owners.includes(message.author.id)) return message.react('❌');
        const isEnabled = Pro.get(`command_enabled_${module.exports.name}`);
        if (isEnabled === false) {
            return;
        }

        let isTcAcceptOnn = await Pro.get(`tcaccept_${message.guild.id}`);
        let acceptStatuss = isTcAcceptOnn ? '[مفعل]' : '[معطل] ';

        let isTcAcceptOn = await Pro.get(`tcaccept_${message.guild.id}`);
        let acceptStatus = isTcAcceptOn ? '[مفعل] نظام القبول' : '[معطل] نظام القبول';

        let namingStyle = await Pro.get(`tcnaming_${message.guild.id}`) || "user"
        if(namingStyle == "user"){
            namingStatus = '[يوزر] نظام التسمية'
        }else if(namingStyle == "number"){
            namingStatus = '[عداد] نظام التسمية';
        }

        let namingStylee = await Pro.get(`tcnaming_${message.guild.id}`) || "user"
        if(namingStylee == "user"){
            namingStatuss = '[يوزر] '
        }else if(namingStylee == "number"){
            namingStatuss = '[عداد] ';
        }
    let logChannel = await Pro.get(`Channel = [${message.guild.id}]`);
     let logChannelStatus = logChannel ? `<#${logChannel}>` : 'لم يتم التعيين';


     let GUILD_CATEGORY = await Pro.get(`Cat = [${message.guild.id}]`) || 'لم يتم التعيين';  // إذا لم يتم التعيين، تظهر رسالة افتراضية
     let rolesadmin = await Pro.get(`Roles_${message.guild.id}`);

     // التحقق مما إذا كانت الرتب موجودة والتعامل مع أكثر من رول
     let rolesadminnn = rolesadmin && rolesadmin.length > 0 
         ? rolesadmin.map(role => `<@&${role}>`).join('\n')  // منشن كل رول مع وضع \n بين كل منشن
         : 'لم يتم التعيين';

         let memberradmin = await Pro.get(`Users_${message.guild.id}`);

         // التحقق مما إذا كانت الرتب موجودة والتعامل مع أكثر من رول
         let memberadmin = memberradmin && memberradmin.length > 0 
             ? memberradmin.map(member => `<@${member}>`).join('\n')  // منشن كل رول مع وضع \n بين كل منشن
             : 'لم يتم التعيين';
     
             let fieldToEdit; // تعريف المتغير في البداية
const embed = new MessageEmbed()
.setColor('#5c5e64')  // لون اللوحة
.setTitle('Ticket Dashboard')
.setDescription(`Prefix: ${prefix}`)
.addFields(
    { name: 'الرولات الاداريه المسموحه', value: rolesadminnn, inline: true },
    { name: 'مسؤؤلين التذاكر', value: memberadmin, inline: true },
    { name: '\u200B', value: '\u200B', inline: false },  // إضافة مسافة فارغة
    { name: 'نظام التسمية', value: namingStatuss, inline: true },
    { name: 'نظام القبول', value: acceptStatuss, inline: true },
    { name: 'شات اللوق', value: logChannelStatus, inline: true },  // إضافة شات اللوق
    { name: 'كتاجوري التكت', value: GUILD_CATEGORY, inline: true }  // إضافة شات الكتاغوري
)
.setFooter('اختر إحدى الخيارات أدناه لإدارة التذاكر');

// سيلكت منيو (قائمة منسدلة)
const selectMenu = new MessageActionRow()
.addComponents(
    new MessageSelectMenu()
        .setCustomId('vipMenu')
        .setPlaceholder('اختر إحدى الخيارات')
        .addOptions([
            {
                label: 'تحديد أسباب',
                emoji: '<:BlueModernTechnologyGamingLogo47:1281943422114070539>',
                value: 'setoptions',
            },
            {
                label: 'تعديل السبب',
                emoji: '<:BlueModernTechnologyGamingLogoEdit:1285256305552003215>',
                value: 'editoption',
            },
            {
                label: 'تعديل البوتات',
                emoji: '<:BlueModernTechnologyGamingLogoEdit:1285256305552003215>',
                value: 'editbots',
            },
            {
                label: 'ارسال رسالة',
                emoji: '<:BlueModernTechnologyGamingLogo58:1281943535490433076>',
                value: 'tcsend',
            },
            {
                label: 'إعادة تعيين',
                emoji: '<:T84:1281943297539047488>',
                value: 'tcrestart',
            },
            {
                label: 'تحديد شات اللوق',
                emoji: '<:BlueModernTechnologyGamingLogo22:1285256305552003215>',
                value: 'setlog',
            },
            {
                label: 'تحديد الرولات الاداريه',
                emoji: '<:OnOfdpdfd70:1288107836206743666>',
                value: 'settrole',
            },
            {
                label: 'تحديد مسؤؤلين التذاكر',
                emoji: '<:p_3147p2pie11:1288110290847662090>',
                value: 'setuser',
            },
            {
                label: 'تحديد كتاجوري للتذاكر',
                emoji: '<:BlueModernTechnologyGamingLogo22:1285256305552003215>',
                value: 'setcategory',
            },
            {
                label: 'إضافة صورة',
                emoji: '<:BlueModernTechnologyGamingLogo63:1285256082675077191>',
                value: 'tcimage',
            },
            {
                label: namingStatus,
                emoji: '<:BlueModernTechnologyGamingLogo20:1285256570728349808>',
                value: 'tcnaming',
            },
            {
                label: acceptStatus,
                emoji: '<:BlueModernTechnologyGamingLogo20:1285256570728349808>',
                value: 'tcaccept',
            },
            {
                label: 'تحديد شات القبول',
                emoji: '<:BlueModernTechnologyGamingLogo22:1285256305552003215>',
                value: 'tcchannel_accept',
            },
           
        ])
);

// زر لإلغاء التفاعل
const deleteButton = new MessageButton()
.setCustomId('Cancel')
.setLabel('إلغاء')
.setStyle('SECONDARY');

const cancelButtonRow = new MessageActionRow()
.addComponents(deleteButton);

// إرسال اللوحة والسيلكت منيو وزر الإلغاء في رسالة واحدة
await message.reply({ 
embeds: [embed], 
components: [selectMenu, cancelButtonRow] 
});

const filter = (interaction) => interaction.user.id === message.author.id;
const mainCollector = message.channel.createMessageComponentCollector({ filter });

mainCollector.on('collect', async (interaction) => {
if (interaction.customId === 'Cancel') {
    await interaction.update({ content: 'تم إلغاء العملية.', components: [] });
    return;
}
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return;

    if (interaction.customId === 'vipMenu' && interaction.values[0] === 'editbots') {
        // استبدال القائمة المنسدلة بالأزرار

        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('change_name')
                    .setLabel('تغيير اسم البوت')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId('change_avatar')
                    .setLabel('تغيير صورة البوت')
                    .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('change_prefix')
                        .setLabel('تغيير البريفكس')
                        .setStyle('SECONDARY'),  // زر تغيير البريفكس
                        new MessageButton()
                       .setCustomId('add_remove_owner')
                      .setLabel('إضافة/حذف مصرح')
                      .setStyle('SECONDARY'), // زر لإضافة أو حذف المصرح
                      new MessageButton()
                      .setCustomId('Back')
                      .setLabel('رجوع')
                      .setStyle('SECONDARY') // زر لإضافة أو حذف المصرح
                     
                      
           
        );

            
        const ownerMentions = config.owners.map(id => `<@${id}>`).join('\n');
        const newEmbed = new MessageEmbed()
        .setColor('#5c5e64')
        .setTitle('Bot Settings')
        .setDescription(`prefix : ${prefix}`)
        .addFields(
            { name: 'اونرات البوت', value: ownerMentions, inline: true } // إضافة اونرات البوت
            // يمكنك إضافة المزيد من الحقول هنا إذا أردت
        );

        // تعديل الرسالة الأصلية واستبدال القائمة المنسدلة بالأزرار
        await interaction.update({ embeds: [newEmbed], components: [buttonRow] });
    }
});






    // تحقق من أي زر تم الضغط عليه

// التعامل مع الأزرار بعد الضغط على أي زر
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'Back') {
        await interaction.update({
            embeds: [embed], 
            components: [selectMenu, cancelButtonRow] // إعادة عرض السيلكت منيو
        });
    }
   
    // معالجة الأزرار الأخرى
    // ...

   
    if (interaction.customId === 'add_remove_owner') {
        await interaction.reply({ content: 'يرجى منشن الشخص الذي ترغب في إضافته أو حذفه كمصرح.', ephemeral: true });
    
        // إنشاء المقتفي لجمع الردود
        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
    
        collector.on('collect', async m => {
            const mentionedUser = m.mentions.users.first(); // الحصول على الشخص الذي تم منشنه
    
            if (!mentionedUser) {
                await interaction.followUp({ content: 'لم يتم منشن الشخص بشكل صحيح. يرجى المحاولة مرة أخرى.', ephemeral: true });
                collector.stop();
                return;
            }
    
            const userId = mentionedUser.id;
    
            // التحقق إذا كان الشخص موجودًا بالفعل في قائمة owners
            if (config.owners.includes(userId)) {
                // حذف المستخدم من قائمة owners
                config.owners = config.owners.filter(id => id !== userId);
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); // حفظ التغييرات
                await interaction.followUp({ content: `تم حذف <@${userId}> من قائمة المصرحين.`, ephemeral: true });
                m.delete();
            } else {
                // إضافة المستخدم إلى قائمة owners
                config.owners.push(userId);
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2)); // حفظ التغييرات
                await interaction.followUp({ content: `تم إضافة <@${userId}> إلى قائمة المصرحين.`, ephemeral: true });
                m.delete();
               
            }
    
            // بعد الإضافة أو الحذف، قم بتحديث newEmbed الحال
    
            collector.stop();
        });
    }
    

    if (interaction.customId === 'change_name') {
        await interaction.reply({ content: 'يرجى كتابة الاسم الجديد للبوت.' });
    
        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });
    
        collector.on('collect', async m => {
            const newName = m.content;
            try {
                await client.user.setUsername(newName);
                await interaction.followUp({ content: `تم تغيير اسم البوت إلى ${newName}`, ephemeral: true });
                m.delete();
                collector.stop();
            } catch (error) {
                if (error.code === 50035 && error.httpStatus === 400) {
                    await interaction.followUp({ content: 'الاسم غير متاح. يرجى المحاولة باسم مختلف.' , ephemeral: true});
                } else {
                    await interaction.followUp({ content: 'حدث خطأ أثناء تغيير اسم البوت. يرجى المحاولة مرة أخرى لاحقاً.', ephemeral: true });
                    console.error(error);
                }
            }
        });
    }
    if (interaction.customId === 'change_prefix') {
        await interaction.reply({ 
            content: `يرجى كتابه البريفكس الجديد`,
            ephemeral: true  // يجعل الرسالة مرئية فقط للشخص الذي قام بالتفاعل
        });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async m => {
            const newPrefix = m.content;
            
            // تحديث البريفكس في config.json وفي المتغير
            try {
                config.prefix = newPrefix;  // تغيير البريفكس
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));  // حفظ التغييرات في config.json

                // تحديث البريفكس في المتغيرات بدون الحاجة لإعادة تشغيل البوت
                prefix = newPrefix;

                await interaction.followUp({ 
                    content: `تم تغيير البريفكس إلى ${newPrefix} بنجاح، ويمكنك استخدامه الآن.`,
                    ephemeral: true  // هذا الخيار يجعل الرسالة مرئية فقط للشخص الذي قام بالتفاعل
                });
                collector.stop();
                m.delete();
            } catch (error) {
                await interaction.followUp({ 
                    content: `حدث خطا .`,
                    ephemeral: true  // هذا الخيار يجعل الرسالة مرئية فقط للشخص الذي قام بالتفاعل
                });
                m.delete();
                console.error(error);
              
               
            }
        });
    }

    if (interaction.customId === 'change_avatar') {
        await interaction.reply({ content: 'يرجى إرسال رابط الصورة الجديدة للبوت.' });

        const filter = m => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async m => {
            const newAvatar = m.content;
            try {
                await client.user.setAvatar(newAvatar);
                await interaction.followUp({ content: 'تم تغيير صورة البوت بنجاح.', ephemeral: true });
                m.delete();
                collector.stop();
            } catch (error) {
                await interaction.followUp({ content: 'حدث خطأ أثناء تغيير صورة البوت.', ephemeral: true });
                console.error(error);
            }
        });
    }


});




      mainCollector.on("collect", async (interaction) => {
            if (!interaction.values || interaction.values.length === 0) return;

            const choice = interaction.values[0];

            if (choice === "setimaget") {

                await interaction.message.delete();

                if (message.author.bot) return;

                let imageURL;

                if (args[0]) {
                    imageURL = args[0];
                } else if (message.attachments.size > 0) {
                    imageURL = message.attachments.first().url;
                } else {
                    return message.reply("**يرجى أرفاق رابط الصورة او الصورة.** ").then(sentMessage => {
                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

                        collector.on('collect', async (msg) => {
                            if (msg.attachments.size > 0) {
                                imageURL = msg.attachments.first().url;
                                Pro.set(`Image = [${message.guild.id}]`, imageURL);
                                message.react('✅');
                                sentMessage.edit("**تم حفظ الصورة بنجاح. ✅**");

                                collector.stop();
                            } else {
                                msg.reply("**يرجى أرفاق رابط الصورة او الصورة.** ");
                            }
                        });

                        collector.on('end', () => {
                            if (!imageURL) {
                                sentMessage.edit("**أنتهى وقت التعديل** ❌");
                            }
                        });
                    });
                }

                Pro.set(`Image = [${message.guild.id}]`, imageURL);

            } else if (choice === "settrole") {
                await interaction.message.delete();
            
                const filter = m => m.author.id === message.author.id;
                const settroleMsg = await message.reply("**يرجى أرفاق منشن الرول او الايدي.**");
            
                const collector = message.channel.createMessageCollector({ filter, time: 60000 });
            
                collector.on('collect', async (msg) => {
                    collector.stop();
            
                    const roleIDs = []; 
                    const roleMentions = msg.content.split(/\s+/); 
                    console.log(roleMentions);
            
                    for (const roleMention of roleMentions) {
                        let roleID;
            
                        // البحث عن الرول المنشن
                        const mentionedRole = msg.mentions.roles.find(role => role.toString() === roleMention);
                        if (mentionedRole) {
                            roleID = mentionedRole.id;
                        } else {
                            // البحث عن الرول عبر ID
                            roleID = roleMention.replace(/[<@&>]/g, ''); 
            
                            const role = message.guild.roles.cache.get(roleID);
            
                            if (!role) {
                                await message.reply(`**يرجى تحديد رول صحيح!** ❌ (${roleMention})`).then(sentMessage => {
                                    sentMessage.delete({ timeout: 5000 });
                                });
                                continue; 
                            }
                        }
            
                        roleIDs.push(roleID); 
                    }
            
                    if (roleIDs.length === 0) {
                        return settroleMsg.edit("**لم يتم تحديد أي رولات صحيحة.** ❌");
                    }
            
                    try {
                        // جلب الرتب المخزنة حالياً من قاعدة البيانات
                        let storedRoles = await Pro.get(`Roles_${message.guild.id}`);
                        if (!storedRoles) {
                            storedRoles = [];
                        }
            
                        // دمج الرتب الجديدة مع القديمة بدون تكرار
                        const updatedRoles = [...new Set([...storedRoles, ...roleIDs])];
            
                        // حفظ الرتب الجديدة في قاعدة البيانات
                        await Pro.set(`Roles_${message.guild.id}`, updatedRoles);
            
                        
                        settroleMsg.edit("**تم حفظ الرولات بنجاح.** ✅");
                    } catch (error) {
                      
                        settroleMsg.edit("**حدث خطأ أثناء حفظ الرولات.** ❌");
                    }
            
                    msg.delete();
                });
            
                collector.on('end', (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        settroleMsg.edit("**انتهى وقت التعديل** ❌");
                    }
                });
            }
            else if (choice === "setuser") {
                await interaction.message.delete();
            
                const filter = m => m.author.id === message.author.id;
                const setuserMsg = await message.reply("**يرجى أرفاق منشن الشخص او الايدي.**");
            
                const collector = message.channel.createMessageCollector({ filter, time: 60000 });
            
                collector.on('collect', async (msg) => {
                    collector.stop();
            
                    const userIDs = []; 
                    const userMentions = msg.content.split(/\s+/);  // تقسيم الرسالة إلى أجزاء
                    console.log(userMentions);
            
                    for (const userMention of userMentions) {
                        let userID;
            
                        // البحث عن المستخدم المنشن
                        const mentionedUser = msg.mentions.users.find(user => user.toString() === userMention);
                        if (mentionedUser) {
                            userID = mentionedUser.id;
                        } else {
                            // البحث عن المستخدم عبر ID
                            userID = userMention.replace(/[<@!>]/g, '');  // إزالة الرموز الزائدة عن المعرف
            
                            const user = message.guild.members.cache.get(userID);
            
                            if (!user) {
                                await message.reply(`**يرجى تحديد مستخدم صحيح!** ❌ (${userMention})`).then(sentMessage => {
                                    sentMessage.delete({ timeout: 5000 });
                                });
                                continue; 
                            }
                        }
            
                        userIDs.push(userID); 
                    }
            
                    if (userIDs.length === 0) {
                        return setuserMsg.edit("**لم يتم تحديد أي مستخدمين صحيحين.** ❌");
                    }
            
                    try {
                        // جلب المستخدمين المخزنين حالياً من قاعدة البيانات
                        let storedUsers = await Pro.get(`Users_${message.guild.id}`);
                        if (!storedUsers) {
                            storedUsers = [];
                        }
            
                        // دمج المستخدمين الجدد مع المستخدمين المخزنين بدون تكرار
                        const updatedUsers = [...new Set([...storedUsers, ...userIDs])];
            
                        // حفظ المستخدمين المحدثين في قاعدة البيانات
                        await Pro.set(`Users_${message.guild.id}`, updatedUsers);
            
                        console.log(updatedUsers);
                        setuserMsg.edit("**تم حفظ المستخدمين بنجاح.** ✅");
                    } catch (error) {
                        console.error("Error saving users:", error);
                        setuserMsg.edit("**حدث خطأ أثناء حفظ المستخدمين.** ❌");
                    }
            
                    msg.delete();
                });
            
                collector.on('end', (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        setuserMsg.edit("**انتهى وقت التعديل** ❌");
                    }
                });
            }

            if (choice === 'setlog') {
                await interaction.message.delete();

                let selectedChannelID;

                if (args[0]) {

                    const channelID = args[0].replace(/\D/g, ''); 
                    if (message.guild.channels.cache.has(channelID)) {
                        selectedChannelID = channelID;
                    }
                }

                if (!selectedChannelID) {

                    const channelMention = message.mentions.channels.first();
                    if (channelMention) {
                        selectedChannelID = channelMention.id;
                    } else {
                        const requestMessage = await message.reply("**يرجى ارفاق منشن الشات او الايدي .** ");
                        const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 30000 });

                        collector.on('collect', async (message) => {
                            const channel = message.mentions.channels.first();
                            if (channel) {
                                selectedChannelID = channel.id;
                                collector.stop();
                            } else {
                                const channelID = message.content.replace(/\D/g, '');
                                if (message.guild.channels.cache.has(channelID)) {
                                    selectedChannelID = channelID;
                                    collector.stop();
                                } else {
                                    message.reply("**يرجى ارفاق منشن الشات او الايدي .**");
                                }
                            }
                        });

                        collector.on('end', () => {
                            if (!selectedChannelID) {
                                requestMessage.edit("**أنتهى وقت التعديل** ❌");
                            } else {

                                Pro.set(`Channel = [${message.guild.id}]`, selectedChannelID);
                                requestMessage.edit("**تم حفظ القناة بنجاح.** ✅");

                            }
                        });
                    }
                } else {
                    Pro.set(`Channel = [${message.guild.id}]`, selectedChannelID);
                    message.reply("**تم حفظ القناة بنجاح.** ✅");
                }

            } if (choice === 'setcategory') {
                await interaction.message.delete();

                let categoryId;

                if (args[0]) {
                    const categoryID = args[0];
                    const channel = message.guild.channels.cache.get(categoryID);
                    if (channel && channel.type === 'GUILD_CATEGORY') {
                        categoryId = categoryID;
                    }
                }

                if (!categoryId) {
                    const requestMessage = await message.reply("**يرجى ارسال ايدي الكاتجوري.** ");
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 30000 });

                    collector.on('collect', async (msg) => {
                        const categoryID = msg.content;
                        const channel = message.guild.channels.cache.get(categoryID);
                        if (channel && channel.type === 'GUILD_CATEGORY') {
                            categoryId = categoryID;
                            collector.stop();
                        } else {
                            msg.reply("**يرجى ارسال ايدي الكاتجوري.** ");
                        }
                    });

                    collector.on('end', () => {
                        if (!categoryId) {
                            requestMessage.edit("**انتهى الوقت المخصص للتعديل** ❌");
                        } else {
                            Pro.set(`Cat = [${interaction.guild.id}]`, categoryId);
                            requestMessage.edit("**تم حفظ الكاتجوري بنجاح.** ✅");
                        }
                    });
                } else {
                    Pro.set(`Cat = [${interaction.guild.id}]`, categoryId);
                    message.reply("**تم حفظ الكاتجوري بنجاح.** ✅");
                }

            } if (choice === "setoptions") {
                await interaction.message.delete();
                const messageCollector = message.channel.createMessageCollector({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                });

                const options = await message.reply(`**يرجى ارفاق سبب فتح التذكرة.** `);

                messageCollector.on("collect", async (msg) => {
                    let menuOptions = Pro.get(`menuOptions_${message.guild.id}`) || [];

                    if (menuOptions.length >= 12) {
                        await message.reply({ content: `**لقد وصلت إلى الحد الأقصى! **`, ephemeral: true });
                        return messageCollector.stop(); 
                    }

                    const newReason = msg.content.trim();
                    const existingReason = menuOptions.find((option) => option.label === newReason);
                    if (existingReason) {
                        await message.reply("**هذا الخيار موجود من قبل ❌**");
                        return messageCollector.stop(); 
                    }

                    await options.edit(`**يرجى ارفاق وصف التذكرة. (اكتب "none" إذا لم ترغب في إضافة وصف)**`);

                    const descriptionCollector = message.channel.createMessageCollector({
                        filter: (descMsg) => descMsg.author.id === message.author.id,
                        max: 1,
                    });

                    descriptionCollector.on("collect", async (descMsg) => {
                        const description = descMsg.content.trim();

                        const finalDescription = (description.toLowerCase() === "none") ? "" : description;

                        const newValue = `M${menuOptions.length + 1}`;

                        menuOptions.push({
                            label: newReason,
                            value: newValue,
                            description: finalDescription, 
                        });

                        Pro.set(`menuOptions_${message.guild.id}`, menuOptions);
                        await options.edit(`**يرجى ارفاق الايموجي.** `);

                        const emojiCollector = message.channel.createMessageCollector({
                            filter: (emojiMsg) => emojiMsg.author.id === message.author.id,
                            max: 1,
                        });

                        emojiCollector.on("collect", async (emojiMsg) => {
                            const emojiInput = emojiMsg.content.trim();

                            if (!emojiInput.match(/<(a)?:.+:\d+>/)) {
                                await message.reply("**الرجاء ادخال اموجي صحيح! ❌**");
                                return;
                            }

                            const emoji = emojiInput;

                            const updatedOption = menuOptions.find((option) => option.label === newReason);
                            updatedOption.emoji = emoji;

                            Pro.set(`menuOptions_${message.guild.id}`, menuOptions);
                            await options.edit("**تمت الإضافة بنجاح الآن**! ✅");
                        });
                    });
                });

            }
            if (choice === 'editoption') {
                await interaction.message.delete();

                const menuOptions = await Pro.get(`menuOptions_${message.guild.id}`) || [];

                if (menuOptions.length === 0) {
                    return message.reply("**لا توجد خيارات لتعديلها.** ❌");
                }

                const editMenu = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('editOptionMenu')
                        .setPlaceholder('اختر الخيار الذي تريد تعديله')
                        .addOptions(menuOptions.map(option => ({
                            label: option.label,
                            value: option.value
                        })))
                );

                const initialMessage = await message.reply({
                    content: "اختر الخيار الذي تريد تعديله:",
                    components: [editMenu]
                });

                const editFilter = (interaction) => interaction.user.id === message.author.id;
                const editCollector = initialMessage.createMessageComponentCollector({ filter: editFilter,  time: 60000 });

                let selectedOption;

                editCollector.on('collect', async (interaction) => {

                    if (interaction.customId === 'editOptionMenu') {
                        await interaction.deferUpdate();
                        selectedOption = interaction.values[0];

                        const editChoice = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId('editFieldMenu')
                                .setPlaceholder('اختر ما تريد تعديله')
                                .addOptions([
                                    { label: 'تعديل الاسم', value: 'editname' },
                                    { label: 'تعديل الوصف', value: 'editdescription' },
                                    { label: 'تعديل الايموجي', value: 'editemoji' },
                                    { label: 'حذف الخيار', value: 'removeOption' },
                                    { label: 'رجوع', value: 'backToMenu' },
                                ])
                        );

                       let yy = await initialMessage.edit({
                        content: "اختر ما تريد تعديله",
                            components: [editChoice]
                        });

                        const editFieldCollector = yy.createMessageComponentCollector({ filter: editFilter, time: 60000 });

                        editFieldCollector.on('collect', async (fieldInteraction) => {
                            let fieldToEdit = fieldInteraction.values[0];
                            if (fieldToEdit === 'removeOption') {
                                // Find the index of the selected option
                                let optionIndex = menuOptions.findIndex(option => option.value === selectedOption);
                    
                                // Remove the option from the array
                                if (optionIndex !== -1) {
                                    menuOptions.splice(optionIndex, 1); // Remove the selected option
                                    await Pro.set(`menuOptions_${message.guild.id}`, menuOptions); // Update the database
                                    
                                    await initialMessage.edit({
                                        content: `تم حذف الخيار بنجاح! ✅`,
                                        components: [] // Clear the components as the option is deleted
                                    });
                                } else {
                                    await initialMessage.edit({
                                        content: "حدث خطأ أثناء حذف الخيار. ❌",
                                        components: [] // Clear the components
                                    });
                                }
                                return; // Exit to avoid further execution
                            }

                            if (fieldToEdit === 'backToMenu') {
                                await fieldInteraction.deferUpdate();
                                await initialMessage.edit({ content: "**قائمة آوامر تعديل التذاكر**.", components: [selectMenu, Cancel] });
                                editFieldCollector.stop()
                                return
                            }

                            await initialMessage.edit({
                                content: `أدخل ${fieldToEdit === 'editname' ? 'الاسم الجديد' : fieldToEdit === 'editdescription' ? 'الوصف الجديد' : 'الإيموجي الجديد'}:`,
                                components: []
                            });

                            const messageCollector = message.channel.createMessageCollector({
                                filter: (m) => m.author.id === message.author.id,
                                max: 1,
                                time: 60000
                            });

                            messageCollector.on('collect', async (msg) => {
                                let newValue = msg.content;

                                let optionIndex = menuOptions.findIndex(option => option.value === selectedOption);

                                if (fieldToEdit === 'editname') {
                                    menuOptions[optionIndex].label = newValue;
                                } else if (fieldToEdit === 'editdescription') {
                                    menuOptions[optionIndex].description = newValue;
                                } else if (fieldToEdit === 'editemoji') {
                                    menuOptions[optionIndex].emoji = newValue;
                                }

                                await Pro.set(`menuOptions_${message.guild.id}`, menuOptions);

                                await initialMessage.edit(`تم تحديث ${fieldToEdit === 'editname' ? 'الاسم' : fieldToEdit === 'editdescription' ? 'الوصف' : 'الإيموجي'} بنجاح! ✅`);

                                msg.delete();
                            });

                        });
                    }
                });
            }

            if (choice === "tcrestart") {
                await interaction.message.delete();

                const guildId = message.guild.id;

                if (Pro.get(`Channel = [${guildId}]`)) Pro.delete(`Channel = [${guildId}]`);
                if (Pro.get(`Role = [${guildId}]`)) Pro.delete(`Role = [${guildId}]`);
                if (Pro.get(`Image = [${guildId}]`)) Pro.delete(`Image = [${guildId}]`);
                if (Pro.get(`Cat = [${guildId}]`)) Pro.delete(`Cat = [${guildId}]`);
                if (Pro.get(`menuOptions_${guildId}`)) Pro.delete(`menuOptions_${guildId}`);
                const memberKey = `member${message.author.id}`;
                const channelKey = `channel${message.author.id}_${message.channel.id}`;
                if (Pro.get(memberKey)) Pro.delete(memberKey);
                if (Pro.get(channelKey)) Pro.delete(channelKey);

                message.reply("**تم إعادة تعين جميع إعدادت التذكرة بنجاح.** ✅")

            }
            if (choice === 'tcchannel_accept') {
                try {
                    await interaction.message.delete();
                    await interaction.reply('**يرجى منشن الشات أو إدخال الايدي لتحديد شات القبول.**');

                    const filter = response => response.author.id === interaction.user.id;
                    const collected = await interaction.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    });

                    const message = collected.first();
                    let channel = null;

                    if (message.mentions.channels.size > 0) {
                        channel = message.mentions.channels.first();
                    } else {
                        const channelId = message.content.split(' ')[0];
                        if (!channelId) return interaction.followUp('**يرجى ارفاق منشن الشات أو الايدي.**');

                        channel = message.guild.channels.cache.get(channelId) ||
                            message.guild.channels.cache.find(c => c.name === channelId);
                    }

                    if (!channel) return interaction.followUp('**الشات غير موجود.**');

                    message.react('✅');
                    await db.set(`acceptChannel_${interaction.guild.id}`, channel.id);

                    interaction.followUp(`**تم تحديد شات القبول بنجاح: ${channel.name}** ✅`);

                } catch (error) {
                    console.error('Error handling ticlog interaction:', error);
                    interaction.followUp('حدث خطأ أثناء تحديد شات القبول. يرجى المحاولة مرة أخرى.');
                }
            }
            if (choice === 'tcimage') {
                try {
                    // الرد على التفاعل بإشعار أولي
                    await interaction.reply({ content: 'يرجى تحديد نوع الصورة (create, open , accept).', ephemeral: true });
            
                    const filter = response => response.author.id === interaction.user.id;
                    const collected = await interaction.channel.awaitMessages({
                        filter,
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    });
            
                    const args = collected.first().content.split(' ');
                    const imageType = args[0].toLowerCase();
            
                    if (!['create', 'open', 'accept'].includes(imageType)) {
                        return await interaction.followUp({ content: 'نوع الصورة غير صحيح. يرجى تحديد "create, open , accept".', ephemeral: true });
                    }
            
                    await interaction.followUp(`يرجى إرسال صورة لـ${imageType === 'create' ? 'إنشاء التكت' : imageType === 'open' ? 'فتح التكت' : 'طلب القبول'}.`);
            
                    const attachmentFilter = m => m.attachments.size > 0 && m.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter: attachmentFilter, max: 1, time: 30000 });
            
                    collector.on('collect', async (msg) => {
                        const imageAttachment = msg.attachments.first();
                        const imageUrl = imageAttachment.url;
                        const imageName = path.basename(imageUrl.split('?')[0]);
            
                        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        const buffer = Buffer.from(response.data, 'binary');
                        const imagePath = path.join(folderPath, imageName);
            
                        fs.writeFileSync(imagePath, buffer);
            
                        const key = `imagePath_${imageType}_${interaction.guild.id}`;
                        await db.set(key, imagePath);
                        await interaction.followUp({ content: 'تم حفظ الصورة بنجاح.', ephemeral: true });
                        msg.delete();
                    });
            
                    collector.on('end', collected => {
                        if (collected.size === 0) {
                            interaction.followUp({ content: 'لم يتم تقديم صورة في الوقت المحدد. يرجى المحاولة مرة أخرى.', ephemeral: true });
                        }
                    });
            
                } catch (error) {
                    console.error('Error handling interaction:', error);
                    await interaction.followUp({ content: 'حدث خطأ أثناء معالجة التفاعل. يرجى المحاولة مرة أخرى.', ephemeral: true });
                }
            }
            
            let isTcAcceptOn = await Pro.get(`tcaccept_${message.guild.id}`) || false;
         
            if (choice === "tcnaming") {
                await interaction.message.delete();
            
                if (namingStyle == "user") {
                    Pro.set(`tcnaming_${message.guild.id}`, "number");
                    await interaction.followUp("**تم تعيين نظام التسمية إلى العداد** ✅");
                } else {
                    Pro.set(`tcnaming_${message.guild.id}`, "user");
                    await interaction.followUp("**تم تعيين نظام التسمية إلى اليوزر** ✅");
                }
                console.log(await Pro.get(`tcnaming_${message.guild.id}`));
            }
            
            if (choice === "deleteoption") {
                await interaction.message.delete();
                const messageCollector = message.channel.createMessageCollector({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                });
            
                const deletePrompt = await interaction.followUp("**الرجاء ارفاق اسم السبب الذي تريد حذفه.**");
            
                messageCollector.on("collect", async (msg) => {
                    const reasonToDelete = msg.content.trim();
            
                    let menuOptions = Pro.get(`menuOptions_${message.guild.id}`) || [];
            
                    const existingReasonIndex = menuOptions.findIndex((option) => option.label === reasonToDelete);
                    if (existingReasonIndex === -1) {
                        await interaction.followUp("**هذا السبب غير موجود! ❌**");
                        return messageCollector.stop();
                    }
            
                    menuOptions.splice(existingReasonIndex, 1);
            
                    Pro.set(`menuOptions_${message.guild.id}`, menuOptions);
                    await deletePrompt.edit("**تم حذف السبب بنجاح! ✅**");
                });
            
            

              }  if (choice === "tcaccept") {
                await interaction.message.delete();

                if (isTcAcceptOn) {
                    Pro.set(`tcaccept_${message.guild.id}`, false);
                    message.reply("**تم تعطيل نظام القبول** ❌");
                } else {

                    Pro.set(`tcaccept_${message.guild.id}`, true);
                    message.reply("**تم تفعيل نظام القبول** ✅");
                }
            }

            let namingStyle = await Pro.get(`tcnaming_${message.guild.id}`) || "user";

            if (choice === "tcnaming") {
               await interaction.message.delete();

                if (namingStyle == "user") {

                    Pro.set(`tcnaming_${message.guild.id}`, "number");
                    message.reply("**تم تعيين نظام التسمية إلى العداد** ✅");
                } else {

                    Pro.set(`tcnaming_${message.guild.id}`,  "user");
                    message.reply("**تم تعيين نظام التسمية إلى اليوزر** ✅");
                }
                console.log(await Pro.get(`tcnaming_${message.guild.id}`))
            }

            if (choice === "deleteoption") {
                await interaction.message.delete();
                const messageCollector = message.channel.createMessageCollector({
                    filter: (msg) => msg.author.id === message.author.id,
                    max: 1,
                });

                const deletePrompt = await message.reply(`**الرجاء ارفاق اسم السبب الذي تريد حذفه.** `);

                messageCollector.on("collect", async (msg) => {
                    const reasonToDelete = msg.content.trim();

                    let menuOptions = Pro.get(`menuOptions_${message.guild.id}`) || [];

                    const existingReasonIndex = menuOptions.findIndex((option) => option.label === reasonToDelete);
                    if (existingReasonIndex === -1) {
                        await message.reply("**هذا السبب غير موجود! ❌**");
                        return messageCollector.stop(); 
                    }

                    menuOptions.splice(existingReasonIndex, 1);

                    Pro.set(`menuOptions_${message.guild.id}`, menuOptions);
                    await deletePrompt.edit(`**تم حذف السبب بنجاح! ✅**`);
                });
            } if (choice === "tcsend") {
                await interaction.message.delete();

                let selectedContent;

                if (args[0]) {
                    selectedContent = args.join(" ");
                }

                if (!selectedContent) {

                    const requestMessage = await message.reply("**يرجى إرفاق النص المراد إرسالة عند فتح التذكره.** ");
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 30000 });

                    collector.on('collect', async (msg) => {
                        tcsend = msg.content;
                        collector.stop();
                    });

                    collector.on('end', () => {
                        if (!tcsend) {
                            requestMessage.edit("**أنتهى وقت التعديل** ❌");
                        } else {
                            Pro.set(`tcsend_${message.guild.id}`, tcsend);
                            requestMessage.edit("**تم حفظ النص بنجاح.** ✅");
                        }
                    });
                } else {
                    Pro.set(`tcsend_${message.guild.id}`, tcsend);
                    message.reply("**تم حفظ النص بنجاح.** ✅");

                }
            }

        });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'Cancel') {
                mainCollector.stop();
                interaction.message.delete();
            }
        });
    },
};