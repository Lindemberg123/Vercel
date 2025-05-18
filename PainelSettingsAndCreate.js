const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const { produtos, PainelVendas, General } = require("../databases");
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('painelsettings')

function createpainel(interaction, client, painelid, produto) {
    if (PainelVendas.get(painelid) !== null) return interaction.reply({ content: `${obterEmoji(7)} | Já esxiste um painel com esse id, use /config_painel \`${painelid}\`, para configura-lo` })

    const embed = new EmbedBuilder()
        .setTitle(`Não configurado ainda...`)
        .setDescription(`Não configurado ainda...`)
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        if (General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
            embed.setThumbnail(General.get(`ConfigGeral.MiniaturaEmbeds`))
        }
        if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
            embed.setImage(General.get(`ConfigGeral.BannerEmbeds`))
          }

    var tt = produtos.get(`${produto}_${interaction.guild.id}`)
    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('buyprodutoporselect')
                .setPlaceholder('Selecione um Produto.')
                .addOptions([
                    {
                        label: `${tt.settings.name}`,
                        description: `💸 | Valor: ${Number(tt.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(tt.settings.estoque).length}`,
                        emoji: `${obterEmoji(2)}`,
                        value: `${produto}_${interaction.guild.id}`,
                    },
                ])
        )

    interaction.channel.send({ embeds: [embed], components: [style2row] }).then(msg => {
        PainelVendas.set(painelid, {
            ID: painelid, produtos: [produto], ChannelID: msg.channel.id, MessageID: msg.id, settings: {
                title: 'Não configurado ainda...',
                desc: 'Não configurado ainda...'
            }
        })

    })



    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Painel criado com sucesso!, use **/config_painel** \`${painelid}\` Para configura-lo` })
}

function configpainel(interaction, painel, client, user) {

    const embed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Gerenciar Painel`)
        .setDescription(`Escolha oque deseja gerenciar:`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configembedpainel")
                .setLabel('Configurar Embed')
                .setEmoji(`1213804917123452928`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("configprodutospainel")
                .setLabel('Configurar Produtos')
                .setEmoji(`1257856237354356818`)
                .setStyle(3)
                .setDisabled(false),)
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel")
                .setLabel('Atualizar Painel')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("deletarpainel")
                .setLabel('DELETAR')
                .setEmoji(`1225163648918356051`)
                .setStyle(4)
                .setDisabled(false),)
    if (interaction.message == undefined) {
        interaction.reply({ components: [row, row2], embeds: [embed] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();

            uu.set(lastMessage.id, { user: user, painel: painel })
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {

        })
    }


}


async function configembedpainel(interaction, client) {
    var t = await uu.get(interaction.message.id)


    const embed = new EmbedBuilder()
  
        .setTitle(`Tíltulo Atual: ${PainelVendas.get(`${t.painel}.settings.title`)}`)
        .setDescription(`${obterEmoji(19)} **| Descrição Atual:**\n${PainelVendas.get(`${t.painel}.settings.desc`)}\n\n🎨 | Cor da Embed: ${PainelVendas.get(`${t.painel}.settings.color`) == null ? '#000000' : PainelVendas.get(`${t.painel}.settings.color`)}\n📒 | Texto do Place Holder: ${PainelVendas.get(`${t.painel}.settings.placeholder`) == null ? 'Selecione um Produto' : PainelVendas.get(`${t.painel}.settings.placeholder`)}\n📂 | Banner: ${PainelVendas.get(`${t.painel}.settings.banner`) == null ? 'Painel Sem Banner.' : `[Banner](${PainelVendas.get(`${t.painel}.settings.banner`)})`}\n🖼️ | Miniatura: ${PainelVendas.get(`${t.painel}.settings.miniatura`) == null ? 'Painel Sem Miniatura.' : `[Miniatura](${PainelVendas.get(`${t.painel}.settings.miniatura`)})`}`)
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setFooter({ text: `Rodapé Atual: ${PainelVendas.get(`${t.painel}.settings.rodape`) == null ? 'Sem Rodapé' : PainelVendas.get(`${t.painel}.settings.rodape`)}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelembed")
                .setLabel('Título da embed')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpaineldesc")
                .setLabel('Descrição da embed')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpainelrodape")
                .setLabel('Rodapé da embed')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpainelplaceholder")
                .setLabel('Place Holder')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpainelcolor")
                .setLabel('Cor Embed')
                .setEmoji(`🖌`)
                .setStyle(1)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("editpainelBanner")
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("editpainelMiniatura")
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel")
                .setLabel('Atualizar Painel')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(1)
                .setDisabled(false),)

    interaction.message.edit({ embeds: [embed], components: [row, row2] })
}




async function configprodutospainel(interaction, client) {
    var t = await uu.get(interaction.message.id)


    var tt = PainelVendas.get(`${t.painel}.produtos`)

    const options = [];
    var messageeee = ''
    for (let iiii = 0; iiii < tt.length; iiii++) {
        const element = tt[iiii];
        var bb = produtos.get(`${element}_${interaction.guild.id}`)

        messageeee += `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji} | __**${iiii}°**__ - ${obterEmoji(12)} | **ID:** ${bb.ID}\n`


        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji}`,
            value: `${bb.ID}_${interaction.guild.id}`,
        };

        options.push(option);

    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1041371454211633254`,
            value: `nada`,
        };

        options.push(options2);
        messageeee += `Sem Produtos, adicione!`

    }


    const embed = new EmbedBuilder()
        .setTitle(`Estes são os produtos cadastrados no Painel:`)
        .setDescription(messageeee)
        .setFooter({ text: `Caso queira trocar o emoji de algum produto, selecione ele no select menu abaixo:`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addprodutopainel")
                .setLabel('Adicionar Produto')
                .setEmoji(`1223710032001110086`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("removeprodutopainel")
                .setLabel('Remover Produto')
                .setEmoji(`1225171461036179549`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changesequenciaprodutos")
                .setLabel('Alterar Sequencia')
                .setEmoji(`1204110774705061939`)
                .setStyle(1)
                .setDisabled(false),)


    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('changeemojipainelproduto')
                .setPlaceholder('Selecione um Produto para alterar o Emoji')
                .addOptions(options)
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmensagempainel")
                .setLabel('Atualizar Painel')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("uay89efg7t9a7wa87dawgbydaid76")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(1)
                .setDisabled(false),)

    interaction.message.edit({ embeds: [embed], components: [row, style2row, row2] })
}



async function atualizarmensagempainel(guildid, painel, client, user) {

    var tttttt = PainelVendas.get(painel)

    var ttttttttt = tttttt.produtos

    var options = []
    for (let iiii = 0; iiii < ttttttttt.length; iiii++) {
        const element = ttttttttt[iiii];
        var bb = produtos.get(`${element}_${guildid}`)

        const option = {
            label: `${bb.settings.name}`,
            description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
            emoji: `${bb.painel == null ? `${obterEmoji(2)}` : bb.painel.emoji}`,
            value: `${bb.ID}_${guildid}`,
        };
        options.push(option);

    }

    const dddddd = General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : General.get(`ConfigGeral.ColorEmbed`)


    const embed = new EmbedBuilder()
        .setTitle(`${tttttt.settings.title}`)
        .setDescription(`${tttttt.settings.desc}`)
        .setColor(PainelVendas.get(`${painel}.settings.color`) == null ? dddddd: PainelVendas.get(`${painel}.settings.color`))

    if (tttttt.settings.banner !== null) {
        embed.setImage(tttttt.settings.banner)
    }
    if (tttttt.settings.miniatura !== null) {
        embed.setThumbnail(tttttt.settings.miniatura)
    }
    if (tttttt.settings.rodape !== null && tttttt.settings.rodape !== undefined) {
        embed.setFooter({ text: `${tttttt.settings.rodape}` })
    }

    if (options == 0) {
        const options2 = {
            label: `Nenhum Produto Cadastrado nesse Painel!`,
            emoji: `1041371454211633254`,
            value: `nada`,
        };

        options.push(options2);

    }

    const style2row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('buyprodutoporselect')
                .setPlaceholder(`${PainelVendas.get(`${painel}.settings.placeholder`) == null ? 'Selecione um Produto' : PainelVendas.get(`${painel}.settings.placeholder`)}`)
                .addOptions(options)
        )

    try {
        const channel = await client.channels.fetch(tttttt.ChannelID)
        const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);

        await fetchedMessage.edit({ embeds: [embed], components: [style2row] });
    } catch (error) {
       
    }

}




module.exports = {
    createpainel,
    configpainel,

    configembedpainel,
    configprodutospainel,
    atualizarmensagempainel
};