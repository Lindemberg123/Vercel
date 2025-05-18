const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, Keys, giftcards, General, StatusCompras, usuariosinfo } = require("../../databases");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
module.exports = {
  name: "perfil",
  description: '[🧀 | 💰 Vendas Ultilidades] Veja o seu pergil ou o perfil de algum usuário',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Selecione o usuário abaixo:",
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  run: async (client, interaction, message) => {
    let valor = interaction.options.getUser('user');
   
    var usu = null
    if (valor == null) {
      usu = interaction.user.id
    } else {
      usu = valor.id
    }

    const member = await interaction.guild.members.fetch(usu);


    
    if(usuariosinfo.get(`${usu}.qtdprodutos`) == null){
      usuariosinfo.set(`${usu}.qtdprodutos`, 0)
    }
    if(usuariosinfo.get(`${usu}.gastos`) == null){
      usuariosinfo.set(`${usu}.gastos`, 0)
    }

    var hh = usuariosinfo.fetchAll()
    hh.sort((a, b) => b.data.gastos - a.data.gastos);
    const posicao = hh.findIndex(obj => obj.ID === usu);

    const embed = new EmbedBuilder()
      .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
      .setThumbnail(`${client.user.displayAvatarURL()}`)
      .setTitle(`Perfil do Usuário | ${member.user.username}`)
      .setDescription(`${obterEmoji(2)} | Produtos Comprados: \`${usuariosinfo.get(`${usu}.qtdprodutos`)}\`\n${obterEmoji(3)} | Já gasto: \`\`R$${usuariosinfo.get(`${usu}.gastos`) == null ? '0.00' : `${Number(usuariosinfo.get(`${usu}.gastos`)).toFixed(2)}`}\`\`\n${obterEmoji(4)} | Saldo: \`R$${PagamentosSaldos.get(`${usu}.SaldoAccount`) == null ? '0.00' : `${Number(PagamentosSaldos.get(`${usu}.SaldoAccount`)).toFixed(2)}`}\`\n${obterEmoji(5)} | Rank: ${member.user.username} está na __${posicao+1}°__ posição do rank!`)

    interaction.reply({ embeds: [embed] })
  }
}