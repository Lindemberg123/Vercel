const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, Keys, giftcards, General } = require("../../databases");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");


module.exports = {
  name: "criargift",
  description: "[💰| Vendas Moderação] Cria uma giftcard no valor escolhido",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "qtd",
      description: "Quantidade de GIfts a serem criados",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    await interaction.deferReply({ ephemeral: true })
    let cargo = interaction.options.getNumber('valor');
    let qtd = interaction.options.getNumber('qtd');

    for (let iii = 0; iii < qtd; iii++) {
      var keya = key(23)

      const embed2 = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`Gift criado!`)
        .setDescription(`Você acabou de gerar um gift no valor de R$${Number(cargo).toFixed(2)}\n\n${obterEmoji(11)} **| Código**\n${keya}`)
        .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
        .setTimestamp()

      giftcards.set(keya, { valor: Number(cargo).toFixed(2), usercreate: interaction.user.id })
      
      try {
        await interaction.user.send({ embeds: [embed2] })
        await interaction.user.send({ content: `${keya}` })
      } catch (error) {
      }
      
    }

    const embed = new EmbedBuilder()
    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
    .setThumbnail(`${client.user.displayAvatarURL()}`)
    .setTitle(`Gift criado com sucesso.`)
    .setDescription(`Olhe a DM para ver o código do gift.`)
    .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
    .setTimestamp()

    await interaction.editReply({ embeds: [embed], ephemeral: true })
  }

}
function key(n) {
  const randomizar = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'
  let text = ''
  for (var i = 0; i < n + 1; i++) text += randomizar.charAt(Math.floor(Math.random() * randomizar.length))
  return text;
}