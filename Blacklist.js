const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");


const { General } = require("../databases");

function automsg(interaction, client) {
    const ggg = General.get(`ConfigGeral.AutoMessage`);

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle("Configure abaixo o sistema de Mensagem Automática");

    var desc = ''
    if (ggg !== null) {
        for (let index = 0; index < ggg.length; index++) {
            const element = ggg[index];

            const truncatedDescricao = element[0].descricao.length > 30 ? element[0].descricao.substring(0, 30) + '...' : element[0].descricao;
            desc += `( \`${index + 1}\` ) - ${truncatedDescricao}\n`

        }
    }

    if (desc == '') {
        desc = `🛠 | Nenhuma mensagem definida!`
    }

    embed.setDescription(desc)

    const row2 = new ActionRowBuilder()
        .addComponents(
            // new ButtonBuilder()
            //     .setCustomId("criarmsgauto")
            //     .setLabel('Criar Mensagem Automática')
            //     .setEmoji(`1223710032001110086`)
            //     .setStyle(3)
            //     .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("remmsgautomatica")
                .setLabel('Remover Mensagem Automática')
                .setEmoji(`1225171461036179549`)
                .setStyle(4)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)


    interaction.editReply({ embeds: [embed], components: [row2] })
}


module.exports = {
    automsg
}