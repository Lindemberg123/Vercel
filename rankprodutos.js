const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, General, estatisticas } = require("../../databases");
const { rankprosdutos } = require("../../FunctionsAll/Criados");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "rankprodutos",
  description: "[🛠|Moderação] vejam os produtos que mais geraram lucros.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
     if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    rankprosdutos(interaction)
  }
}