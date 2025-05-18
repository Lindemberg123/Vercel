const Discord = require("discord.js");
const { PagamentosSaldos, Keys, giftcards, General, StatusCompras } = require("../../databases");
const { QuickDB } = require("quick.db");
const axios = require('axios');
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require('../../Lib/utilities')

module.exports = {
  name: "reembolsar",
  description: '[🛠|💰 Vendas Moderação] Reembolsa de forma automática um pagamento',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "id",
      description: "ID da compra que deseja verificar",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction, message) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }


    let valor = interaction.options.getNumber('id');
    var tt = StatusCompras.get(`${valor}`)

    if (tt == null) return interaction.reply({ content: `${obterEmoji(7)} | Compra não encontrada!`, ephemeral: true })
    if (tt.Status == 'Entregue') {
      if (tt.Metodo == "Saldo") {

        interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
        setTimeout(async () => {
          const channel = await client.channels.fetch(tt.IDChannelLogs);
          const fetchedMessage = await channel.messages.fetch(tt.IDMessageLogs);
          if (fetchedMessage) {
            fetchedMessage.edit({
              content: `\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${tt.IdCompra}\n${obterEmoji(14)} | Valor Reembolsado: R$${Number(tt.valortotal).toFixed(2)}`, components: []
            });
          }

          interaction.editReply({
            content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${tt.IdCompra}\n${obterEmoji(14)} | Valor Reembolsado: R$${Number(tt.valortotal).toFixed(2)}
                                `, ephemeral: true
          });


          PagamentosSaldos.set(`${tt.user}.SaldoAccount`, Number(PagamentosSaldos.get(`${tt.user}.SaldoAccount`)) + Number(tt.valortotal))
          StatusCompras.set(`${valor}.Status`, 'Reembolsado')
        }, 3000);
      } else if (tt.Metodo == "Pix" || tt.Metodo == "Site") {
        interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
        const urlReembolso = `https://api.mercadopago.com/v1/payments/${valor}/refunds`;
        const headers = {
          Authorization: `Bearer ${General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`,
        };
        const body = {
          metadata: {
            reason: 'Motivo do reembolso',
          },
        };
        axios.post(urlReembolso, body, { headers })
          .then(async response => {
            StatusCompras.set(`${valor}.Status`, 'Reembolsado')
            const channel = await client.channels.fetch(tt.IDChannelLogs);
            const fetchedMessage = await channel.messages.fetch(tt.IDMessageLogs);
            if (fetchedMessage) {
              fetchedMessage.edit({
                content: `\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${tt.IdCompra}\n${obterEmoji(14)} | Valor Reembolsado: R$${Number(tt.valortotal).toFixed(2)}`, components: []
              });



              interaction.editReply({
                content: `
${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${tt.IdCompra}\n${obterEmoji(14)} | Valor Reembolsado: R$${Number(tt.valortotal).toFixed(2)}`, ephemeral: true
              });
            }
          })
          .catch(error => {

            interaction.editReply({ content: `Erro ao emitir o reembolso: ${error.response.data.message}`, ephemeral: true });
          });
      }

    }else{
      return interaction.reply({ content: `${obterEmoji(7)} | O Status que está compra está não pode ser rembolsado!`, ephemeral: true })
    }
  }
}