const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { updateMessageConfig } = require("../../FunctionsAll/BotConfig");
const { AdicionarSaldo } = require("../../FunctionsAll/Saldo");

module.exports = {
  name: "adicionarsaldo",
  description: "[💰|Vendas] Adicionar Saldo Via Pix",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor que deseja adicionar.",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    let qtd = interaction.options.getNumber('valor');

    AdicionarSaldo(client, interaction, interaction.user.id, qtd)

  }
}