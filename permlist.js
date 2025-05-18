const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, MessageActionRow, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, General } = require("../../databases");

module.exports = {
  name: "permlist",
  description: "[💰| Vendas Moderação] Verificar os usuários que podem utilizar seu BOT",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
    
    var deploy = require("../../deploy.json")
    if (deploy.owner_id !== (interaction.user.id).toString()) return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })

    const perms = General.get(`ConfigGeral.perms`)
    let msg = 'Usuarios com permissão: \n'

    perms.map((user_id) => {
      const userInfo = interaction.guild.members.cache.get(user_id);
      msg += `🔧 | ${userInfo?.user?.username ? `${userInfo?.user?.username}` : `Usuario não encontrado`} - ${user_id}\n\n`
    })
    
    interaction.reply({ embeds: [
      new EmbedBuilder()
      .setTitle(`Membro(s) com permissão - ${perms.length}`)
        .setDescription(msg?.toString() || "Ocorreu um erro")
        .setColor('Green')
    ], ephemeral: true })

  }
}