const { WebhookClient, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { StatusCompras, General } = require("../../databases");

const axios = require('axios');
const { obterEmoji } = require("../../Handler/EmojiFunctions");

module.exports = {
    name: 'ready',

    run: async (client) => {
        function enviarMensagem(mensagem, canalId) {
            const row222 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('asSs')
                    .setLabel('Mensagem do Automatica')
                    .setStyle(2)
                    .setDisabled(true)
            );

            if (mensagem.titulo === '' && mensagem.bannerembed === '') {
                try {
                    const channela = client.channels.cache.get(canalId);
                    channela.send({ content: `${mensagem.descricao}`, components: [row222] })
                } catch (error) {

                }
            } else {

                const embed = new EmbedBuilder()
                embed.setColor(General.get(`ConfigGeral.ColorEmbed`) === '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`);

                if (mensagem.titulo !== '') {
                    embed.setTitle(mensagem.titulo);
                }

                if (mensagem.descricao !== '') {
                    embed.setDescription(mensagem.descricao);
                }

                if (mensagem.bannerembed !== '') {
                    embed.setImage(mensagem.bannerembed);
                }

                try {
                    const channela = client.channels.cache.get(canalId);
                    channela.send({ embeds: [embed], components: [row222] })

                } catch (error) {


                }
            }
        }

        function agendarMensagens(autoMessages) {
            const ggg = General.get(`ConfigGeral.AutoMessage`)
            if (ggg !== null) {
                ggg.forEach(([mensagem]) => {
                    const { titulo, descricao, bannerembed, time, idchanell } = mensagem;
                    const intervalo = parseInt(time, 10) * 1000;

                    enviarMensagem(mensagem, idchanell);

                    setInterval(() => {
                        enviarMensagem(mensagem, idchanell);
                    }, intervalo);
                });
            }
        }

        agendarMensagens();
    }
}


