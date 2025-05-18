const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, General } = require("../../databases");

module.exports = {
  name: "permremove",
  description: "[💰| Vendas Moderação] Remover permissão a um usuário para gerenciar o sistema de vendas",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "usuário que vai receber a ação?",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },

  ],

  run: async (client, interaction, message) => {
    var ttt = General.get(`ConfigGeral.perms`)
    if(!ttt.includes(interaction.user.id)) return interaction.reply({content: `❌ | Você não possui permissão para utilizar esse comando.`,ephemeral: true})


    let user = interaction.options.getUser('user');

    var deploy = require("../../deploy.json")
    if (deploy.owner_id !== (interaction.user.id).toString()) return interaction.reply({ content: `❌ | Você não possui permissão para remover um usuário.`, ephemeral: true })

    var ttt = General.get(`ConfigGeral.perms`)
    if (ttt !== null) {
      if (!ttt.includes(user.id)) return interaction.reply({ content: `❌ | Este usuário não está na lista de permissões de seu BOT.`, ephemeral: true })
    }
    General.pull(`ConfigGeral.perms`, (element, index, array) => element == user.id)
    
    interaction.reply({ content: `✅ | Você removeu o usuário ${user} de utilizar seu BOT.`, ephemeral: true })

  }
}