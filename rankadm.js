const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('messagepixgerar')
const { rank, rankadm } = require("../../FunctionsAll/Criados");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "rankadm",
  description: '[🛠|💰 Vendas Moderação] Veja o rank das pessoas que mais compraram',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction, message) => {
     if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }


    rankadm(interaction)
  }
}