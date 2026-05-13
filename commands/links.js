const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

module.exports = {

    name: 'links',

    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Show Universal Cloud Hosting links'),

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor('#00bfff')
            .setTitle('🔗 Universal Cloud Hosting Links')
            .setDescription('Quick access to all our official platforms.')
            .setThumbnail('https://cdn.discordapp.com/attachments/1503755597013717183/1504108850486317159/file_000000001f387208b3f3b2f17ce0b05b.png?ex=6a05ca06&is=6a047886&hm=ae074ce860d3a38fd82674952bf02f29b8f805a443438ecddfeff823f7a7aeef&')

            .addFields(
                {
                    name: '🌍 Official Website',
                    value: '[Visit Website](https://universalcloud.in)'
                },
                {
                    name: '🌐 Client Dashboard',
                    value: '[Login / Register](https://panel.universalcloud.in)'
                },
                {
                    name: '💳 Billing System',
                    value: '[View Plans](https://billing.universalcloud.in)'
                },
                {
                    name: '🖥️ Control Panel',
                    value: '[Open Panel](https://cp.universalcloud.in)'
                },
                {
                    name: '📈 Server Status',
                    value: '[Check Status](https://status.universalcloud.in)'
                }
            )

            .setFooter({
                text: 'Fast & Secure'
            });

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setLabel('Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://universalcloud.in'),

                new ButtonBuilder()
                    .setLabel('Dashboard')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://panel.universalcloud.in'),

                new ButtonBuilder()
                    .setLabel('Billing')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://billing.universalcloud.in')
            );

        /*
        PREFIX COMMAND
        */
        if (message.channel) {

            await message.channel.send({
                embeds: [embed],
                components: [row]
            });

            await message.delete().catch(() => {});
        }
    },

    async slashExecute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#00bfff')
            .setTitle('🔗 Universal Cloud Hosting Links')
            .setDescription('Quick access to all our official platforms.')
            .setThumbnail('https://cdn.discordapp.com/attachments/1503755597013717183/1504108850486317159/file_000000001f387208b3f3b2f17ce0b05b.png?ex=6a05ca06&is=6a047886&hm=ae074ce860d3a38fd82674952bf02f29b8f805a443438ecddfeff823f7a7aeef&')

            .addFields(
                {
                    name: '🌍 Official Website',
                    value: '[Visit Website](https://universalcloud.in)'
                },
                {
                    name: '🌐 Client Dashboard',
                    value: '[Login / Register](https://panel.universalcloud.in)'
                },
                {
                    name: '💳 Billing System',
                    value: '[View Plans](https://billing.universalcloud.in)'
                },
                {
                    name: '🖥️ Control Panel',
                    value: '[Open Panel](https://cp.universalcloud.in)'
                },
                {
                    name: '📈 Server Status',
                    value: '[Check Status](https://status.universalcloud.in)'
                }
            )

            .setFooter({
                text: 'Fast & Secure'
            });

        const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setLabel('Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://universalcloud.in'),

                new ButtonBuilder()
                    .setLabel('Dashboard')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://panel.universalcloud.in'),

                new ButtonBuilder()
                    .setLabel('Billing')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://billing.universalcloud.in')
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};