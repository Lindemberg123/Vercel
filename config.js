const Discord = require("discord.js");
const { StartConfigProduto } = require("../../FunctionsAll/Createproduto");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "config",
  description: "[💰| Vendas Moderação] Configure um produto",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja setar a mensagem!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    if (interaction.options._hoistedOptions[0].value == 'nada') return interaction.reply({ content: `Nenhum produto registrado em seu BOT`, ephemeral: true })
    StartConfigProduto(interaction, interaction.options._hoistedOptions[0].value, client, interaction.user.id)
  }
}