const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');
const { General, Cupom } = require('../databases');

const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permissionsmessage333')

const editEmbed = {
    content: `⚠️ | Use o Comando Novamente!`,
    components: [],
    embeds: []
};

const editMessage = async (message) => {
    try {
        await message.edit(editEmbed)
    } catch (error) {

    }

};

const createCollector = (message) => {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
    });

    collector.on('collect', () => {
        collector.stop();
    });

    collector.on('end', (collected) => {
        if (collected.size === 0) {

            editMessage(message);

        }
    });
};

function StartConfigCupom(interaction, client, user, cupom) {

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Cupom`)
        .setDescription(`Cupom sendo gerenciado:\n\n${obterEmoji(7)} **| Nome:** \`${cupom}\`\n${obterEmoji(19)} **| Porcentagem de Desconto:** \`${Number(Cupom.get(`${cupom}.porcentagem`)).toFixed(0)}%\`\n${obterEmoji(14)} **| Valor Mínimo:** \`R$${Number(Cupom.get(`${cupom}.valorminimo`)).toFixed(2)}\`\n${obterEmoji(12)} **| Quantidade:** \`${Number(Cupom.get(`${cupom}.quantidade`)).toFixed(0)}\`\n${obterEmoji(20)} **| Só pode ser usado na categoria de produtos:** ${Cupom.get(`${cupom}.categoria`) == null ? `\`Este cupom pode ser utilizado em qualquer produto!\`` : `<#${Cupom.get(`${cupom}.categoria`)}>`}\n${obterEmoji(20)} **| Só pode ser usado pelo cargo:** ${Cupom.get(`${cupom}.cargo`) == null ? `\`Este cupom pode ser utilizado por qualquer usuário!\`` : `<@&${Cupom.get(`${cupom}.cargo`)}>`}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("changeporcentagemcupom")
                .setLabel('Porcentagem de desconto')
                .setEmoji(`1224797970885771325`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changevalorminimocupom")
                .setLabel('Valor Mínimo')
                .setEmoji(`1257856237354356818`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changequantidadecupom")
                .setLabel('Quantidade')
                .setEmoji(`1257118195417092116`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changecategoriacupom")
                .setLabel('Categoria')
                .setEmoji(`1225170753553563750`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changecargocupom")
                .setLabel('Cargo')
                .setEmoji(`1176326985052590132`)
                .setStyle(3)
                .setDisabled(false),)
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("deletecupomaaa")
                .setLabel('DELETAR')
                .setEmoji(`1225163648918356051`)
                .setStyle(4)
                .setDisabled(false),)



    if (interaction.message == undefined) {
        interaction.reply({ embeds: [embed], components: [row, row2] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, {user: interaction.user.id, cupom: cupom})
            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {
            createCollector(u);
        })
    }
}


module.exports = {
    StartConfigCupom
};