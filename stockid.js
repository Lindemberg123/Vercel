const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, Keys, giftcards, General, StatusCompras, produtos } = require("../../databases");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "stockid",
  description: '[🛠|💰 Vendas Moderação] Veja o stock de um determinado produto',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction, message) => {

    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum produto registrado em seu BOT`, ephemeral: true })
    const u = produtos.get(`${interaction.options._hoistedOptions[0].value}_${interaction.guild.id}.settings.estoque`)
    var result2 = '';
    for (const key in u) {
      result2 += `${key} - ${u[key]}\n`
    }


    if (result2 == '') return interaction.reply({ content: `${obterEmoji(21)} | Este produto está sem estoque!`, ephemeral: true }).then(msg => {
      setTimeout(async () => {
        try {
          await msg.delete()
        } catch (error) {
        }
      }, 3000);
    })

    const fileName = `stock_${interaction.options._hoistedOptions[0].value}.txt`;
    const fileBuffer2 = Buffer.from(result2, 'utf-8');
    const embed = new EmbedBuilder()
      .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
      .setTitle(`Mostrando Estoque de: ${interaction.options._hoistedOptions[0].value}`)
      .setDescription(`\`Estoque no arquivo txt.\``)
      .setFooter({ text: `${interaction.guild.name} - Todos os direitos reservados.`, iconURL: `${client.user.displayAvatarURL()}` })
    interaction.reply({
      embeds: [embed], ephemeral: true, files: [{
        attachment: fileBuffer2,
        name: fileName
      }]
    })

  }
}