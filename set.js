const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, ButtonBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, produtos, DefaultMessages, General } = require("../../databases");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "set",
  description: "[💰| Vendas Moderação] Cadastra um novo produto no bot",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja configurar!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const id = interaction.options._hoistedOptions[0].value
    var s = produtos.get(`${id}_${interaction.guild.id}.settings.estoque`)
    if (s == null) return interaction.reply({ content: `❌ | O produto selecionado não está configurado para este servidor.`, ephemeral: true })
    const embeddesc = DefaultMessages.get(`ConfigGeral`)
    var dd = produtos.get(`${id}_${interaction.guild.id}`)

    var modifiedEmbeddesc = embeddesc.embeddesc
      .replace('#{desc}', produtos.get(`${id}_${interaction.guild.id}.settings.desc`))
      .replace('#{nome}', produtos.get(`${id}_${interaction.guild.id}.settings.name`))
      .replace('#{preco}', Number(produtos.get(`${id}_${interaction.guild.id}.settings.price`)).toFixed(2))
      .replace('#{estoque}', Object.keys(s).length);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
      .replace('#{nome}', produtos.get(`${id}_${interaction.guild.id}.settings.name`))
      .replace('#{preco}', Number(produtos.get(`${id}_${interaction.guild.id}.settings.price`)).toFixed(2))
      .replace('#{estoque}', Object.keys(s).length)

    const dddddd = General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : General.get(`ConfigGeral.ColorEmbed`)


    const embed = new EmbedBuilder()
      .setTitle(modifiedEmbeddesc2)
      .setDescription(modifiedEmbeddesc)
      .setColor(`${dd.embedconfig.color == null ? dddddd : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== undefined) {
   
      embed.setImage(dd.embedconfig.banner)
    } else {

      if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embed.setImage(General.get(`ConfigGeral.BannerEmbeds`))
      }
    }


    if (dd.embedconfig.miniatura !== undefined) {
      embed.setThumbnail(dd.embedconfig.miniatura)
    } else {
      if (General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
        embed.setThumbnail(General.get(`ConfigGeral.MiniaturaEmbeds`))
      }
    }

    if (DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
      embed.setFooter({ text: DefaultMessages.get(`ConfigGeral.embedrodape`) })
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


    if (General.get(`ConfigGeral.statusduvidas`) == true) {
      row.addComponents(
        new ButtonBuilder()
          .setURL(`${General.get(`ConfigGeral.channelredirectduvidas`) == null ? `https://www.youtube.com/` : `${General.get(`ConfigGeral.channelredirectduvidas`)}`}`)
          .setLabel(`${General.get(`ConfigGeral.textoduvidas`) == null ? `Dúvida` : General.get(`ConfigGeral.textoduvidas`)}`)
          .setStyle(5)
          .setEmoji(`${General.get(`ConfigGeral.emojiduvidas`) == null ? `🔗` : General.get(`ConfigGeral.emojiduvidas`)}`)
          .setDisabled(false),
      )
    }


    interaction.channel.send({ embeds: [embed], components: [row] }).then(async msg => {
      var g = produtos.get(`${id}_${interaction.guild.id}`)
      try {
        const channel = await client.channels.fetch(g.ChannelID);
        const fetchedMessage = await channel.messages.fetch(g.MessageID);
        await fetchedMessage.delete();
      } catch (error) {
      }


      produtos.set(`${id}_${interaction.guild.id}.MessageID`, msg.id)
      produtos.set(`${id}_${interaction.guild.id}.ChannelID`, msg.channel.id)
    })



    interaction.reply({ content: `${obterEmoji(8)} | Mensagem Atualizada!`, ephemeral: true })


  }
}