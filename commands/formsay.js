const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {

    name: 'formsay',

    execute: async () => {},

    data: new SlashCommandBuilder()
        .setName('formsay')
        .setDescription('Open message form')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async slashExecute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('formsay_modal')
            .setTitle('Send Message');

        const messageInput = new TextInputBuilder()
            .setCustomId('message_input')
            .setLabel('Message')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row = new ActionRowBuilder()
            .addComponents(messageInput);

        modal.addComponents(row);

        await interaction.showModal(modal);
    },

    async handleModal(interaction) {

        const text = interaction.fields.getTextInputValue('message_input');

        await interaction.channel.send(text);

        await interaction.reply({
            content: '✅ Message sent.',
            flags: 64
        });
    }
};