const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {

    name: 'welcome',

    execute: async () => {},

    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Welcome system configuration')

        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Open welcome setup panel')
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async slashExecute(interaction) {

        const subcommand =
            interaction.options.getSubcommand();

        /*
        /welcome setup
        */
        if (subcommand === 'setup') {

            const embed = new EmbedBuilder()

                .setColor('#00bfff')

                .setTitle('👋 Welcome System Setup')

                .setDescription(
                    [
                        'Configure your welcome system below.',
                        '',
                        '⚙️ Available Options:',
                        '',
                        '• Set Welcome Channel',
                        '• Set Embed Title',
                        '• Set Embed Description',
                        '• Set Embed Color',
                        '• Toggle User Ping',
                        '• Test Welcome Message'
                    ].join('\n')
                )

                .setFooter({
                    text: 'Universal Cloud Welcome System'
                });

            /*
            ROW 1
            */
            const row1 = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()
                        .setCustomId('welcome_set_channel')
                        .setLabel('Set Channel')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('welcome_set_title')
                        .setLabel('Set Title')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('welcome_set_description')
                        .setLabel('Set Description')
                        .setStyle(ButtonStyle.Primary)
                );

            /*
            ROW 2
            */
            const row2 = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()
                        .setCustomId('welcome_set_color')
                        .setLabel('Set Color')
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId('welcome_toggle_ping')
                        .setLabel('Toggle Ping')
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId('welcome_test')
                        .setLabel('Test Message')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.reply({

                embeds: [embed],

                components: [row1, row2],

                flags: 64
            });
        }
    }
};