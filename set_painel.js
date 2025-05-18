const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PainelVendas, produtos, General } = require("../../databases");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "set_painel",
  description: "[💰| Vendas Moderação] Sete o Painel",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum produto registrado em seu BOT`, ephemeral: true })

    var tttttt = PainelVendas.get(interaction.options._hoistedOptions[0].value)
    var ttttttttt = tttttt.produtos

    var options = []
    for (let iiii = 0; iiii < ttttttttt.length; iiii++) {
      const element = ttttttttt[iiii];
      var bb = produtos.get(`${element}_${interaction.guild.id}`)

      const option = {
        label: `${bb.settings.name}`,
        description: `💸 | Valor: ${Number(bb.settings.price).toFixed(2)} - 📦 | Estoque: ${Object.keys(bb.settings.estoque).length}`,
        emoji: `${bb.painel == null ? '🛒' : bb.painel.emoji}`,
        value: `${bb.ID}_${interaction.guild.id}`,
      };
      options.push(option);

    }
    const dddddd = General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : General.get(`ConfigGeral.ColorEmbed`)
    const embed = new EmbedBuilder()
      .setTitle(`${tttttt.settings.title}`)
      .setDescription(`${tttttt.settings.desc}`)
      .setColor(PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.color`) == null ? dddddd : PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.color`))

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
          .setPlaceholder(`${PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.placeholder`) == null ? 'Selecione um Produto' : PainelVendas.get(`${interaction.options._hoistedOptions[0].value}.settings.placeholder`)}`)
          .addOptions(options)
      )


    const row222 = new ActionRowBuilder()
    if (General.get(`ConfigGeral.statusduvidas`) == true) {
      row222.addComponents(
        new Discord.ButtonBuilder()
          .setURL(`${General.get(`ConfigGeral.channelredirectduvidas`) == null ? `https://www.youtube.com/` : `${General.get(`ConfigGeral.channelredirectduvidas`)}`}`)
          .setLabel(`${General.get(`ConfigGeral.textoduvidas`) == null ? `Dúvida` : General.get(`ConfigGeral.textoduvidas`)}`)
          .setStyle(5)
          .setEmoji(`${General.get(`ConfigGeral.emojiduvidas`) == null ? `🔗` : General.get(`ConfigGeral.emojiduvidas`)}`)
          .setDisabled(false),
      )
    }


    if (General.get(`ConfigGeral.statusduvidas`) == true) {
      interaction.channel.send({ embeds: [embed], components: [style2row, row222] }).then(async msg => {
        try {
          const channel = await client.channels.fetch(tttttt.ChannelID);
          const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }


        PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.MessageID`, msg.id)
        PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.ChannelID`, msg.channel.id)
      })

    } else {
      interaction.channel.send({ embeds: [embed], components: [style2row] }).then(async msg => {
        try {
          const channel = await client.channels.fetch(tttttt.ChannelID);
          const fetchedMessage = await channel.messages.fetch(tttttt.MessageID);
          await fetchedMessage.delete();
        } catch (error) {
        }


        PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.MessageID`, msg.id)
        PainelVendas.set(`${interaction.options._hoistedOptions[0].value}.ChannelID`, msg.channel.id)
      })
    }


    interaction.reply({ content: `${obterEmoji(8)} | Mensagem Atualizada!`, ephemeral: true })


  }
}