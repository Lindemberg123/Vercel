const Discord = require("discord.js");
const { CriadosStart } = require("../../FunctionsAll/Criados");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "criados",
  description: "[🛠| Vendas Moderação] Veja todos os ptodutos, cupons, keys, etc. cadastrados no bot.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    CriadosStart(interaction,client)
  }
}