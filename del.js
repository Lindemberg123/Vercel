const Discord = require("discord.js");
const { PagamentosSaldos, produtos, DefaultMessages, PainelVendas, General } = require("../../databases");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities")

module.exports = {
  name: "del",
  description: '[🛠|💰 Vendas Moderação] Deleta o produto que você colocou o ID',
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    { name: 'id', description: 'Coloque o id do produto que deseja configurar!', type: 3, required: true, autocomplete: true },
  ],

  run: async (client, interaction, message) => {
     if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
    }

    const id = interaction.options._hoistedOptions[0].value
    var tttttt = PainelVendas.fetchAll()

    for (let iii = 0; iii < tttttt.length; iii++) {
      const element = tttttt[iii];
      var uu = element.data.produtos
      if (uu.includes(id)) {
        PainelVendas.pull(`${tttttt[iii].ID}.produtos`, (element, index, array) => element == id)
        atualizarmensagempainel(interaction.guild.id, element.ID, client)
      }
    }
    const channel = client.channels.cache.get(produtos.get(`${id}_${interaction.guild.id}.ChannelID`));
    if (channel) {
      channel.messages
        .fetch(produtos.get(`${id}_${interaction.guild.id}.MessageID`))
        .then((mensagem) => {
          mensagem.delete();
 
        })
        .catch((error) => {
          
        });
    } else {
   
    }
    interaction.reply({content: `${obterEmoji(8)} | o produto \`${id}\` foi deletado do servidor.`}).then(msg => {
      setTimeout(async () => {
        try {
          await msg.delete()
        } catch (error) {
        }
      }, 3000);
    })
    produtos.delete(`${id}_${interaction.guild.id}`)
  }
}