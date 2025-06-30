const Data = require("pro.db");

module.exports = async (client) => {
    console.log({
        Name: client.user.tag,
    });

    client.commands.forEach(command => {
        const aliases = Data.get(`aliases_${command.name}`);
        if (aliases) {  
            command.aliases = aliases;
            client.commands.set(command.name, command);
        }
    });
};
