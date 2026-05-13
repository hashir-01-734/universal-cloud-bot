const {
    Client,
    GatewayIntentBits,
    Collection,
    REST,
    Routes
} = require('discord.js');

const fs = require('fs');
const path = require('path');

/*
BOT TOKEN
*/
const TOKEN = process.env.TOKEN;

/*
APPLICATION ID
*/
const CLIENT_ID = '1503782071322017968';

/*
SERVER ID
*/
const GUILD_ID = '1490416600875139135';

/*
CREATE CLIENT
*/
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/*
COMMAND COLLECTION
*/
client.commands = new Collection();

/*
LOAD COMMAND FILES
*/
const commandsPath = path.join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath);
}

const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

const slashCommands = [];

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    if (!command.name || !command.execute) {
        console.log(`[WARNING] ${file} is missing "name" or "execute".`);
        continue;
    }

    client.commands.set(command.name, command);

    console.log(`[LOADED] Command: ${command.name}`);

    /*
    LOAD SLASH COMMANDS
    */
    if (command.data) {
        slashCommands.push(command.data.toJSON());
    }
}

/*
REGISTER SLASH COMMANDS
*/
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {

    try {

        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: slashCommands }
        );

        console.log('Slash commands registered!');

    } catch (error) {

        console.error(error);

    }

})();

/*
BOT READY EVENT
*/
client.once('ready', () => {

    console.log(`==============================`);
    console.log(`${client.user.tag} is ONLINE`);
    console.log(`Loaded Commands: ${client.commands.size}`);
    console.log(`==============================`);

});

/*
PREFIX COMMAND HANDLER
PREFIX = &
*/
client.on('messageCreate', async (message) => {

    if (message.author.bot) return;

    if (!message.content.startsWith('&')) return;

    const args = message.content.slice(1).trim().split(/ +/);

    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {

        await command.execute(message, args, client);

    } catch (error) {

        console.error(error);

        message.channel.send('❌ Error executing command.');

    }
});

/*
SLASH COMMAND HANDLER
*/
client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        if (command.slashExecute) {

            await command.slashExecute(interaction);

        }

    } catch (error) {

        console.error(error);

        await interaction.reply({
            content: '❌ Error executing slash command.',
            ephemeral: true
        });

    }

});

/*
LOGIN
*/
/*
MODAL HANDLER
*/
client.on('interactionCreate', async (interaction) => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'formsay_modal') {

        const command = client.commands.get('formsay');

        if (command && command.handleModal) {
            await command.handleModal(interaction);
        }
    }

    if (interaction.customId === 'embedformsay_modal') {

        const command = client.commands.get('embedformsay');

        if (command && command.handleModal) {
            await command.handleModal(interaction);
        }
    }
});
client.login(TOKEN);