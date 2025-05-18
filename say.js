const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const utilities = require("../../Lib/utilities");  
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
  name: "say",
  description: '[🛠 | Moderação] Envie uma mensagem em um canal específico.',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: 'canal',
      description: 'Mencione um canal.',
      type: ApplicationCommandOptionType.Channel,
      required: true
    },
    {
      name: 'mensagem',
      description: 'Envie algo para ser enviado.',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],

  run: async (client, interaction) => {
    if (!utilities.getUserHasPermission(interaction.user.id)){
      return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true });
    }

    const channel = interaction.options.getChannel('canal');
    const msg = interaction.options.getString('mensagem');

    try {
      await channel.send({ content: `${msg}` });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${obterEmoji(8)} | Mensagem enviada com sucesso no canal ${channel}.`)
            .setColor('Green')
        ], 
        ephemeral: true
      });
    } catch (error) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Olá ${interaction.user}, houve um erro ao tentar enviar a mensagem no canal ${channel}.`)
            .setColor('Red')
        ], 
        ephemeral: true
      });
    }
  }
}
