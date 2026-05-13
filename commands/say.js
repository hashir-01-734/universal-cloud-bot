const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {

    name: 'say',

    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something')
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('Message to send')
                .setRequired(true)
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(message, args) {

        const text = args.join(' ');

        if (!text) return;

        await message.channel.send(text);

        await message.delete().catch(() => {});
    },

    async slashExecute(interaction) {

        const text = interaction.options.getString('message');

        await interaction.reply({
            content: '✅ Message sent.',
            ephemeral: true
        });

        await interaction.channel.send(text);
    }
};