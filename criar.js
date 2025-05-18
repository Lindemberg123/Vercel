const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, produtos, DefaultMessages, General } = require("../../databases");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "criar",
  description: "[💰| Vendas Moderação] Cadastra um novo produto no bot",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'id',
      description: 'Coloque o ID do novo produto aqui!',
      type: Discord.ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const id = interaction.options.getString('id')
    function temMaisDe20Letras(texto) {
      const letras = texto.replace(/[^a-zA-Z]/g, ''); // Remove caracteres que não são letras
      return letras.length
    }

    const resultado = temMaisDe20Letras(id);

    if (resultado > 20) return interaction.reply({ content: `❌ | Você não pode criar PRODUTO acima de 20 palavras!`, ephemeral: true })
    if (id.length < 1) return interaction.reply({ content: `❌ | Você não pode criar PRODUTO menos de 1 palavras!`, ephemeral: true })

    var t = produtos.get(`${id}_${interaction.guild.id}`)
    if (t != null) return interaction.reply({ content: `${obterEmoji(22)} | Já existe um produto com esse NOME neste servidor.`, ephemeral: true })

    const embeddesc = DefaultMessages.get(`ConfigGeral`)

    var desc = 'Não configurado ainda...'
    var nome = 'Não configurado ainda...';
    var preco = 10;
    var estoque = 0;

    var modifiedEmbeddesc = embeddesc.embeddesc
      .replace('#{desc}', desc)
      .replace('#{nome}', nome)
      .replace('#{preco}', preco)
      .replace('#{estoque}', estoque);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
      .replace('#{nome}', nome)
    const embed = new Discord.EmbedBuilder()
      .setTitle(modifiedEmbeddesc2)
      .setDescription(modifiedEmbeddesc)
      .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
    if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
      embed.setImage(General.get(`ConfigGeral.BannerEmbeds`))
    }
    if (General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
      embed.setThumbnail(General.get(`ConfigGeral.MiniaturaEmbeds`))
    }


    var color = null
    if (embeddesc.colorbutton == 'Vermelho') {
      color = 4
    } else if (embeddesc.colorbutton == 'Azul') {
      color = 1
    } else if (embeddesc.colorbutton == 'Verde') {
      color = 3
    } else if (embeddesc.colorbutton == 'Cinza') {
      color = 2
    } else {
      color = 3
    }

    const row = new ActionRowBuilder()
    if (embeddesc.emojibutton == null) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`${id}_${interaction.guild.id}`)
          .setLabel(`${DefaultMessages.get(`ConfigGeral.textbutton`) == null ? 'Comprar' : DefaultMessages.get(`ConfigGeral.textbutton`)}`)
          .setStyle(color)
          .setEmoji('1257856237354356818')
          .setDisabled(false),
      )
    } else {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`${id}_${interaction.guild.id}`)
          .setLabel(`${DefaultMessages.get(`ConfigGeral.textbutton`) == null ? 'Comprar' : DefaultMessages.get(`ConfigGeral.textbutton`)}`)
          .setStyle(color)
          .setEmoji(DefaultMessages.get(`ConfigGeral.emojibutton`))
          .setDisabled(false),
      )
    }

    if (General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`) !== null) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`irateduvida`)
          .setLabel(`${DefaultMessages.get(`ConfigGeral.textbutton`) == null ? 'Comprar' : DefaultMessages.get(`ConfigGeral.textbutton`)}`)
          .setStyle('2')
          .setEmoji(DefaultMessages.get(`ConfigGeral.emojibutton`))
          .setDisabled(false),
      )
    }

    interaction.channel.send({ embeds: [embed], components: [row] }).then(msg => {

      produtos.set(`${id}_${interaction.guild.id}`, {
        ID: id,
        MessageID: msg.id,
        ChannelID: msg.channel.id,
        embedconfig: {
          cupom: true
        },
        settings: {
          price: 10,
          name: `Não configurado ainda...`,
          desc: `Não configurado ainda...`,
          estoque: []
        }
      })
    })
    interaction.reply({ content: `${obterEmoji(8)} | Produto criado com sucesso!, use /config \`${id}\` Para configura-lo`, ephemeral: true })


  }
}

function limitarPalavras(texto, limite) {
  const palavras = texto.split(' ');
  const resultado = palavras.slice(0, limite).join(' ');
  return resultado;
}