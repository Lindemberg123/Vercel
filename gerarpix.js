const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, MessageCollector, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { PagamentosSaldos, Keys, giftcards, General } = require("../../databases");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('messagepixgerar')
const mercadopago = require("mercadopago");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");


module.exports = {
  name: "gerarpix",
  description: '[💰 | Vendas] Gere uma cobrança.',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "valor",
      description: "Valor para ser Resgatado",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
     if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    let valor = interaction.options.getNumber('valor');

    interaction.reply({ content: `${obterEmoji(10)} | Gerando pagamento...` }).then(async msg => {
      try {
        const messages = await interaction.channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();
    
        var payment_data = {
          transaction_amount: Number(valor),
          description: `Pagamento - ${interaction.user.username}`,
          payment_method_id: 'pix',
          payer: {
            email: `${interaction.user.id}@gmail.com`,
            first_name: `Victor André`,
            last_name: `Ricardo Almeida`,
            identification: {
              type: 'CPF',
              number: '15084299872'
            },
    
            address: {
              zip_code: '86063190',
              street_name: 'Rua Jácomo Piccinin',
              street_number: '971',
              neighborhood: 'Pinheiros',
              city: 'Londrina',
              federal_unit: 'PR'
            }
          }
        }
    
        mercadopago.configurations.setAccessToken(General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
        const data = await mercadopago.payment.create(payment_data);
    
        uu.set(lastMessage.id, { user: interaction.user.id, qrcode: data.body.point_of_interaction.transaction_data.qr_code_base64, pixcopiaecola: data.body.point_of_interaction.transaction_data.qr_code, id: data.body.id, })
        var tt = General.get('ConfigGeral')
    
        let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000
    
        let timestamp = Math.floor(forFormat / 1000)
        const embed = new EmbedBuilder()
          .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
          .setTitle(`${client.user.username} | Sistema de pagamento`)
          .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`\n${obterEmoji(12)} **| Valor:**\nR$${Number(valor).toFixed(2)}\n${obterEmoji(7)} | Pagamento expira em:\n<t:${timestamp}> (<t:${timestamp}:R>)`)
    
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("pixcdawdwadawdwdopiawdwawdwadecola182381371")
              .setLabel('Pix Copia e Cola')
              .setEmoji(`1213543527196131388`)
              .setStyle(1)
              .setDisabled(false),
            new ButtonBuilder()
              .setCustomId("qwadawrcode18281wadawdwadwa2981")
              .setLabel('Qr Code')
              .setEmoji(`1238271183523156029`)
              .setStyle(1)
              .setDisabled(false),
            new ButtonBuilder()
              .setCustomId("cancelgeneratepix")
              .setEmoji(`1041371454211633254`)
              .setStyle(4)
              .setDisabled(false),
          )
    
        msg.edit({ content: ``, embeds: [embed], components: [row] }).then(msggggg => {
          setTimeout(async () => {
            try {
              await msggggg.delete()
            } catch (error) {
              console.error("Error deleting message:", error);
            }
          }, tt.MercadoPagoConfig.TimePagament * 60 * 1000);
        })
      } catch (error) {
        interaction.followUp({content: `Gerar Pix apenas com MERCADO PAGO!`, ephemeral: true})

        // You can send an error message to a specific channel or user here.
      }
    })
  }
}