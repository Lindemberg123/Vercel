const Discord = require("discord.js");
const { General, StatusCompras } = require("../../databases");

module.exports = {
  name: "sync_clients",
  description: "[🛠|💰 Vendas Moderação] Vincule seus cargos de Clientes",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'cargo_cliente',
      description: 'Escolha o NOVO cargo de cliente',
      type: Discord.ApplicationCommandOptionType.Role,
      required: true
    }
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const id = interaction.options.getRole('cargo_cliente')
    const ff = StatusCompras.fetchAll();
    const entregues = ff.filter(element => element.data.Status === 'Entregue');

    interaction.reply({ content: `⚡ | Estamos vinculando seus CLIENTE a NOVA tag mencionada por você ( \`${entregues.length} Compras Totais!\` )`, ephemeral: true })

    for (const element of entregues) {
      try {
        const gfgf = await interaction.guild.members.fetch(element.data.user)
        await gfgf.roles.add(id.id)
      } catch (error) {
      }
    }
  }
}
