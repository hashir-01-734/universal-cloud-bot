const fs = require('fs');
const path = require('path');

const {
    EmbedBuilder
} = require('discord.js');

/*
CONFIG PATH
*/
const configPath = path.join(
    __dirname,
    '..',
    'data',
    'welcome-config.json'
);

/*
CREATE CONFIG FILE IF NOT EXISTS
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
        SET CHANNEL
        */
        if (interaction.customId === 'welcome_set_channel') {

            setupSessions[interaction.user.id] = {
                type: 'channel'
            };

            return interaction.reply({

                content:
                    '📢 Please mention the welcome channel.\nExample: #welcome',

                flags: 64
            });
        }

        /*
        SET TITLE
        */
        if (interaction.customId === 'welcome_set_title') {

            setupSessions[interaction.user.id] = {
                type: 'title'
            };

            return interaction.reply({

                content:
                    '📝 Please send the welcome embed title.\nYou can use:\n{user}\n{username}\n{server}\n{membercount}',

                flags: 64
            });
        }

        /*
        SET DESCRIPTION
        */
        if (interaction.customId === 'welcome_set_description') {

            setupSessions[interaction.user.id] = {
                type: 'description'
            };

            return interaction.reply({

                content:
                    '📝 Please send the welcome embed description.\nYou can use:\n{user}\n{username}\n{server}\n{membercount}',

                flags: 64
            });
        }

        /*
        SET COLOR
        */
        if (interaction.customId === 'welcome_set_color') {

            setupSessions[interaction.user.id] = {
                type: 'color'
            };

            return interaction.reply({

                content:
                    '🎨 Please send the embed color.\nExample: #00bfff',

                flags: 64
            });
        }

        /*
        TOGGLE PING
        */
        if (interaction.customId === 'welcome_toggle_ping') {

            const config = JSON.parse(
                fs.readFileSync(configPath)
            );

            if (!config[interaction.guild.id]) {

                config[interaction.guild.id] = {};
            }

            config[interaction.guild.id].ping =
                !config[interaction.guild.id].ping;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            return interaction.reply({

                content:
                    `✅ User ping is now set to: ${config[interaction.guild.id].ping}`,

                flags: 64
            });
        }

        /*
        TEST MESSAGE
        */
        if (interaction.customId === 'welcome_test') {

            const config = JSON.parse(
                fs.readFileSync(configPath)
            );

            const guildConfig =
                config[interaction.guild.id];

            if (!guildConfig) {

                return interaction.reply({

                    content:
                        '❌ Welcome system is not configured.',

                    flags: 64
                });
            }

            if (!guildConfig.channel) {

                return interaction.reply({

                    content:
                        '❌ Welcome channel not configured.',

                    flags: 64
                });
            }

            const channel =
                interaction.guild.channels.cache.get(
                    guildConfig.channel
                );

            if (!channel) {

                return interaction.reply({

                    content:
                        '❌ Welcome channel not found.',

                    flags: 64
                });
            }

            /*
            VARIABLES
            */
            const title = (guildConfig.title || '👋 Welcome {user}')

                .replace(
                    /{user}/g,
                    interaction.user.toString()
                )

                .replace(
                    /{username}/g,
                    interaction.user.username
                )

                .replace(
                    /{server}/g,
                    interaction.guild.name
                )

                .replace(
                    /{membercount}/g,
                    interaction.guild.memberCount
                );

            const description =
                (guildConfig.description ||
                    'Welcome to {server}, {user}!')

                    .replace(
                        /{user}/g,
                        interaction.user.toString()
                    )

                    .replace(
                        /{username}/g,
                        interaction.user.username
                    )

                    .replace(
                        /{server}/g,
                        interaction.guild.name
                    )

                    .replace(
                        /{membercount}/g,
                        interaction.guild.memberCount
                    );

            const embed = new EmbedBuilder()

                .setColor(
                    guildConfig.color || '#00bfff'
                )

                .setTitle(title)

                .setDescription(description);

            await channel.send({

                content:
                    guildConfig.ping
                        ? `${interaction.user}`
                        : '',

                embeds: [embed]
            });

            return interaction.reply({

                content:
                    '✅ Test welcome message sent.',

                flags: 64
            });
        }
    });

    /*
    MESSAGE COLLECTOR
    */
    client.on('messageCreate', async (message) => {

        if (message.author.bot) return;

        const session =
            setupSessions[message.author.id];

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
        SET CHANNEL
        */
        if (session.type === 'channel') {

            const channel = message.mentions.channels.first();

            if (!channel) {

                return message.reply(
                    '❌ Please mention a valid channel.'
                );
            }

            config[message.guild.id].channel =
                channel.id;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            return message.reply(
                '✅ Welcome channel updated.'
            );
        }

        /*
        SET TITLE
        */
        if (session.type === 'title') {

            config[message.guild.id].title =
                message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            return message.reply(
                '✅ Welcome title updated.'
            );
        }

        /*
        SET DESCRIPTION
        */
        if (session.type === 'description') {

            config[message.guild.id].description =
                message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            return message.reply(
                '✅ Welcome description updated.'
            );
        }

        /*
        SET COLOR
        */
        if (session.type === 'color') {

            config[message.guild.id].color =
                message.content;

            fs.writeFileSync(
                configPath,
                JSON.stringify(config, null, 4)
            );

            delete setupSessions[message.author.id];

            return message.reply(
                '✅ Welcome color updated.'
            );
        }
    });

    /*
    MEMBER JOIN EVENT
    */
    client.on('guildMemberAdd', async (member) => {

        const config = JSON.parse(
            fs.readFileSync(configPath)
        );

        const guildConfig =
            config[member.guild.id];

        if (!guildConfig) return;

        if (!guildConfig.channel) return;

        const channel =
            member.guild.channels.cache.get(
                guildConfig.channel
            );

        if (!channel) return;

        /*
        VARIABLES
        */
        const title = (guildConfig.title || '👋 Welcome {user}')

            .replace(
                /{user}/g,
                member.toString()
            )

            .replace(
                /{username}/g,
                member.user.username
            )

            .replace(
                /{server}/g,
                member.guild.name
            )

            .replace(
                /{membercount}/g,
                member.guild.memberCount
            );

        const description =
            (guildConfig.description ||
                'Welcome to {server}, {user}!')

                .replace(
                    /{user}/g,
                    member.toString()
                )

                .replace(
                    /{username}/g,
                    member.user.username
                )

                .replace(
                    /{server}/g,
                    member.guild.name
                )

                .replace(
                    /{membercount}/g,
                    member.guild.memberCount
                );

        const embed = new EmbedBuilder()

            .setColor(
                guildConfig.color || '#00bfff'
            )

            .setTitle(title)

            .setDescription(description);

        await channel.send({

            content:
                guildConfig.ping
                    ? `${member}`
                    : '',

            embeds: [embed]
        });
    });
};