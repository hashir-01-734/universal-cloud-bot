const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {

    name: 'embedformsay',

    execute: async () => {},

    data: new SlashCommandBuilder()
        .setName('embedformsay')
        .setDescription('Open embed form')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async slashExecute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('embedformsay_modal')
            .setTitle('Create Embed');

        const titleInput = new TextInputBuilder()
            .setCustomId('embed_title')
            .setLabel('Embed Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('embed_description')
            .setLabel('Embed Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const footerInput = new TextInputBuilder()
            .setCustomId('embed_footer')
            .setLabel('Footer')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        const row1 = new ActionRowBuilder()
            .addComponents(titleInput);

        const row2 = new ActionRowBuilder()
            .addComponents(descriptionInput);

        const row3 = new ActionRowBuilder()
            .addComponents(footerInput);

        modal.addComponents(row1, row2, row3);

        await interaction.showModal(modal);
    },

    async handleModal(interaction) {

        const title = interaction.fields.getTextInputValue('embed_title');

        const description = interaction.fields.getTextInputValue('embed_description');

        const footer = interaction.fields.getTextInputValue('embed_footer');

        const embed = new EmbedBuilder()
            .setColor('#00bfff')
            .setTitle(title)
            .setDescription(description);

        if (footer) {
            embed.setFooter({ text: footer });
        }

        await interaction.channel.send({
            embeds: [embed]
        });

        await interaction.reply({
            content: '✅ Embed sent.',
            flags: 64
        });
    }
};