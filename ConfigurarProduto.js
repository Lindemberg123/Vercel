const Discord = require("discord.js");
const { produtos } = require("../../databases");
const { StartConfigProduto } = require("../../FunctionsAll/Createproduto");
const utilities = require("../../Lib/utilities");

module.exports = {
  name: "Configurar Produto",
  type: Discord.ApplicationCommandType.Message,

  run: async (client, interaction) => {

    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const message = await interaction.channel.messages.fetch(interaction.targetId);
    const ffff = message.components[0]?.components[0]?.data?.custom_id
    if (ffff == undefined) return interaction.reply({ ephemeral: true, content: `❌ | Você interagiu em uma mensagem na qual não é um PRODUTO para ser alteravel!` })

    const gggg = produtos.get(ffff)
    if (gggg == null) return interaction.reply({ ephemeral: true, content: `❌ | Você interagiu em uma mensagem na qual não é um PRODUTO para ser alteravel!` })
    const ggg = ffff?.replace(`_${interaction.guild.id}`, '')

    StartConfigProduto(interaction, ggg, client, interaction.user.id)
  }
}