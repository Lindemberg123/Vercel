const Discord = require("discord.js");
const { General } = require("../../databases");

module.exports = {
  name: "permadd",
  description: "[💰| Vendas Moderação] Adicionar permissão a um usuário para gerenciar o sistema de vendas",
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
    let user = interaction.options.getUser('user');

    var deploy = require("../../deploy.json")
    if (deploy.owner_id !== (interaction.user.id).toString()) return interaction.reply({ content: `❌ | Você não possui permissão para adicionar um usuário na lista de permissões.`, ephemeral: true })

    var ttt = General.get(`ConfigGeral.perms`)
    if (ttt !== null) {
      if (ttt.includes(user.id)) return interaction.reply({ content: `❌ | Este usuário já possui permissão no seu BOT.`, ephemeral: true })
    }
    General.push(`ConfigGeral.perms`, user.id)
    interaction.reply({ content: `✅ | Você setou o usuário ${user} para utilizar seu BOT.`, ephemeral: true })
  }
}