const fs = require('fs');
const path = require('path');

const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

/*
CONFIG PATH
*/
const configPath = path.join(__dirname, '..', 'data', 'ticket-config.json');

/*
CREATE EMPTY CONFIG IF NOT EXISTS
*/
if (!fs.existsSync(configPath)) {

    fs.writeFileSync(
        configPath,
        JSON.stringify({}, null, 4)
    );
}

/*
SETUP SESSIONS
*/
const setupSessions = {};

/*
EXPORT EVENT
*/
module.exports = (client) => {

    /*
    BUTTON INTERACTIONS
    */
    client.on('interactionCreate', async (interaction) => {

        if (!interaction.isButton()) return;

        /*
        SET TITLE
        */
        if (interaction.customId === 'ticket_set_title') {

            setupSessions[interaction.user.id] = {
                type: 'title'
            };

            return interaction.reply({

                content: '📝 Please send the new ticket panel title in chat.',

                flags: 64
            });
        }

        /*
        SET DESCRIPTION
        */
        if (interaction.customId === 'ticket_set_description') {

            setupSessions[interaction.user.id] = {
                type: 'description'
            };

            return interaction.reply({

                content: '📝 Please send the new ticket panel description in chat.',

                flags: 64
            });
        }

        /*
        SET COLOR
        */
        if (interaction.customId === 'ticket_set_color') {

            setupSessions[interaction.user.id] = {
                type: 'color'
            };

            return interaction.reply({

                content: '🎨 Please send the embed hex color.\nExample: `#00bfff`',

                flags: 64
            });
        }

        /*
        PUBLISH PANEL
        */
        if (interaction.customId === 'ticket_publish') {

            const config = JSON.parse(
                fs.readFileSync(configPath)
            );

            const guildConfig = config[interaction.guild.id];

            if (!guildConfig) {

                return interaction.reply({

                    content: '❌ Setup configuration not found.',

                    flags: 64
                });
            }

            const embed = new EmbedBuilder()

                .setColor(guildConfig.color || '#00bfff')

                .setTitle(
                    guildConfig.title ||
                    '🎫 Universal Cloud Support'
                )

                .setDescription(
                    guildConfig.description ||
                    'Select a category below to create a support ticket.'
                );

            const menu = new StringSelectMenuBuilder()

                .setCustomId('ticket_menu')

                .setPlaceholder('Select ticket category')

                .addOptions([
                    {
                        label: 'General Support',
                        description: 'General help and questions',
                        value: 'general',
                        emoji: '❓'
                    },
                    {
                        label: 'Billing Support',
                        description: 'Payments and invoices',
                        value: 'billing',
                        emoji: '💳'
                    },
                    {
                        label: 'Minecraft Support',
                        description: 'Minecraft server help',
                        value: 'minecraft',
                        emoji: '🎮'
                    },
                    {
                        label: 'VPS Support',
                        description: 'VPS and Linux support',
                        value: 'vps',
                        emoji: '🖥️'
                    },
                    {
                        label: 'Bug Reports',
                        description: 'Report bugs/issues',
                        value: 'bugs',
                        emoji: '🐞'
                    }
                ]);

            const row = new ActionRowBuilder()

                .addComponents(menu);

            await interaction.channel.send({

                embeds: [embed],

                components: [row]
            });

            return interaction.reply({

                content: '✅ Ticket panel published successfully.',

                flags: 64
            });
        }
    });

    /*
    MESSAGE COLLECTOR
    */
    client.on('messageCreate', async (message) => {

        if (message.author.bot) return;

        const session = setupSessions[message.author.id];

        if (!session) return;

        /*
        LOAD CONFIG
        */
        const config = JSON.parse(
            fs.readFileSync(configPath)
        );

        if (!config[message.guild.id]) {

            config[message.guild.id] = {};
        }

        /*
        TITLE
        */
        if (session.type === 'title') {

            config[message.guild.id].title = message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            await message.reply(
                '✅ Ticket panel title updated.'
            );

            return;
        }

        /*
        DESCRIPTION
        */
        if (session.type === 'description') {

            config[message.guild.id].description = message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            await message.reply(
                '✅ Ticket panel description updated.'
            );

            return;
        }

        /*
        COLOR
        */
        if (session.type === 'color') {

            config[message.guild.id].color = message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            await message.reply(
                '✅ Ticket panel color updated.'
            );

            return;
        }
    });
};