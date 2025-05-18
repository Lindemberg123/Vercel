const Discord = require("discord.js");
const { PagamentosSaldos, produtos, DefaultMessages, PainelVendas, Keys, General } = require("../../databases");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "delkey",
  description: '[🛠|💰 Vendas Moderação] Deletar uma key',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "key",
      description: "Coloque a key aqui!",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
     if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    let key = interaction.options.getString('key');
    
    var uu = Keys.get(key)
    if(uu == null) return interaction.reply({content: `${obterEmoji(8)} | o produto \`${key}\` foi deletado do servidor.`, ephemeral: true})

    interaction.reply({content: `${obterEmoji(8)} | o produto \`${key}\` foi deletado do servidor.`, ephemeral: true})
    Keys.delete(key)
  }
}