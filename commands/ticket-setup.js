const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {

    name: 'ticket',

    execute: async () => {},

    data: new SlashCommandBuilder()

        .setName('ticket')

        .setDescription('Ticket system commands')

        .addSubcommand(subcommand =>

            subcommand

                .setName('setup')

                .setDescription('Open ticket setup panel')
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async slashExecute(interaction) {

        const subcommand = interaction.options.getSubcommand();

        /*
        /ticket setup
        */
        if (subcommand === 'setup') {

            const embed = new EmbedBuilder()

                .setColor('#00bfff')

                .setTitle('🎫 Ticket Setup Panel')

                .setDescription(
                    [
                        'Use the buttons below to configure your ticket panel.',
                        '',
                        '⚙️ Current Setup Options:',
                        '',
                        '• Embed Title',
                        '• Embed Description',
                        '• Embed Color',
                        '• Support Role',
                        '• Ticket Categories',
                        '• Publish Panel'
                    ].join('\n')
                )

                .setFooter({
                    text: 'Universal Cloud Ticket System'
                });

            /*
            ROW 1
            */
            const row1 = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId('ticket_set_title')

                        .setLabel('Set Title')

                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()

                        .setCustomId('ticket_set_description')

                        .setLabel('Set Description')

                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()

                        .setCustomId('ticket_set_color')

                        .setLabel('Set Color')

                        .setStyle(ButtonStyle.Primary)
                );

            /*
            ROW 2
            */
            const row2 = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId('ticket_set_role')

                        .setLabel('Support Role')

                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()

                        .setCustomId('ticket_set_categories')

                        .setLabel('Ticket Categories')

                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()

                        .setCustomId('ticket_publish')

                        .setLabel('Publish Panel')

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