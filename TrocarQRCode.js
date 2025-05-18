const Discord = require("discord.js");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const utilities = require("../../Lib/utilities");

module.exports = {
    name: "trocarqrcode",
    description: "[🛠|💎 Vendas PREMIUM] Trocar QRCode",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'novafoto',
            description: 'Qual foto ficará no seu QRCode?',
            type: Discord.ApplicationCommandOptionType.Attachment,
            required: true
        },
    ],

    run: async (client, interaction, message) => {
        await interaction.reply({ content: `${obterEmoji(10)} Aguarde...`, ephemeral: true })

        if (!utilities.getUserHasPermission(interaction.user.id)){
            return interaction.reply({ content: `❌ | Você não possui permissão para usar esse comando.`, ephemeral: true })
        }

        const minhaString = arq.name
        if (minhaString.includes(".png")) {
            try {
                const axios = require('axios');
                const path = require('path');
                const fs = require('fs').promises;
                const nomeDoDiretorio = 'Lib';
                const caminhoDoDiretorio = path.resolve(__dirname, '..', '..', nomeDoDiretorio);

                const response = await axios.get(arq.attachment, { responseType: 'arraybuffer' });

                const caminhoNoComputador = path.join(caminhoDoDiretorio, 'logo.png');
                await fs.writeFile(caminhoNoComputador, Buffer.from(response.data));

                interaction.editReply({ content: `✅ | QRCode trocado com sucesso!`, ephemeral: true })
            } catch (error) {
                interaction.editReply({ content: `❌ | Erro ao trocar o QRCode.`, ephemeral: true })
            }
        } else {
            interaction.editReply({ content: `❌ | O arquivo precisa ser .png`, ephemeral: true })
        }


    }
}