const Discord = require("discord.js");
const { PagamentosSaldos, Keys, giftcards, General, StatusCompras } = require("../../databases");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('messagepixgerar')
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "status",
  description: '[🛠|💰 Vendas Moderação] Veja o status de um pagamento',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "ID da compra que deseja verificar",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    let valor = interaction.options.getString('id');

    var tt = StatusCompras.get(valor)
    if (tt == null) return interaction.reply({ content: `${obterEmoji(7)} | Compra não encontrada!` })

    interaction.reply({
      content: `${obterEmoji(24)} | Status: ${tt.Status}\n${obterEmoji(25)} | Valor: R$${Number(tt.valortotal).toFixed(2)}`, ephemeral: true
    })
  }
}