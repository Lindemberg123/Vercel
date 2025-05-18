const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, Keys, giftcards, General, StatusCompras, usuariosinfo } = require("../../databases");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { rank } = require("../../FunctionsAll/Criados");
module.exports = {
  name: "rank",
  description: '[🛠|💰 Vendas Moderação] Veja o rank das pessoas que mais compraram',
  type: Discord.ApplicationCommandType.ChatInput,
  

  run: async (client, interaction, message) => {
    let valor = interaction.options.getUser('user');
    
    var usu = null
    if (valor == null) {
      usu = interaction.user.id
    } else {
      usu = valor.id
    }

    rank(interaction)

  }
}