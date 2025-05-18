const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, General } = require("../../databases");
const utilities = require('../../Lib/utilities.js');

module.exports = {
  name: "painelsugestao",
  description: "[🛠|Moderação] Envie a mensagem do painel de sugestão.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const embed = new Discord.EmbedBuilder()
      .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
      .setTitle(`${client.user.username} | Feedback usuários`)
      .setDescription(`👋 | Caso precise enviar uma sugestão / avaliação, selecione uma das opções abaixo:`)

    const style2row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('sugestaoprodutos')
          .setPlaceholder(`Selecione uma das opções`)
          .addOptions([
            {
              label: `Sugerir`,
              description: `Enviar uma sugestão`,
              emoji: `💡`,
              value: `SugerirEnviar`,
            },
            {
              label: `Avaliar`,
              description: `Enviar uma avaliação`,
              emoji: `⭐`,
              value: `AvaliarEnviar`,
            }
          ])
      )

    interaction.channel.send({ embeds: [embed], components: [style2row] })
    interaction.reply({ ephemeral: true, content: `✅ | Enviado a mensagem de sugestao / avaliar` })
  }
}