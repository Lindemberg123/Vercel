const { ActivityType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, WebhookClient } = require('discord.js');
const { carregarCache } = require('../../Handler/EmojiFunctions');
const { General } = require('../../databases');

function updateRichPresence(client) {

    if (General.get(`ConfigGeral.StatusBot.typestatus`) == null) {
        return client.user.setPresence({
            activities: [{ name: `/Appsystems`, type: ActivityType.Streaming, url: `https://www.twitch.tv/discord` }],
            status: `ndn`,
        })
    }

    var type = General.get(`ConfigGeral.StatusBot.typestatus`)
    var atividade = General.get(`ConfigGeral.StatusBot.ativistatus`)
    var text = General.get(`ConfigGeral.StatusBot.textstatus`)
    var url = General.get(`ConfigGeral.StatusBot.urlstatus`)

    var dddddd = []

    if (atividade == "Jogando") {
        dddddd = [{ name: text, type: ActivityType.Playing }]
    } else if (atividade == "Assistindo") {
        dddddd = [{ name: text, type: ActivityType.Watching }]
    } else if (atividade == "Competindo") {
        dddddd = [{ name: text, type: ActivityType.Competing }]
    } else if (atividade == "Transmitindo") {
        dddddd = [{ name: text, type: ActivityType.Streaming, url: url }]
    } else if (atividade == "Ouvindo") {
        dddddd = [{ name: text, type: ActivityType.Listening }]
    }

    if (type == 'Online') {
        type = 'online'
    } else if (type == 'Ausente') {
        type = 'idle'
    } else if (type == 'Invisível') {
        type = 'invisible'
    } else if (type == 'Não Perturbar') {
        type = 'dnd'
    }

    client.user.setPresence({
        activities: dddddd,
        status: type,
    })
}

module.exports = {
    name: 'ready',
    updateRichPresence,
    run: async (client) => {
        console.log(`${client.user.tag} Foi iniciado \n - Atualmente ${client.guilds.cache.size} servidores!\n - Tendo acesso a ${client.channels.cache.size} canais!\n - Contendo ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuarios!`)
        carregarCache();
        updateRichPresence(client);

        if (client.guilds.cache.size > 1) {
            client.guilds.cache.forEach(guild => {
                guild.leave()
                    .then(() => {
                        console.log(`Bot saiu do servidor: ${guild.name}`);
                    })
                    .catch(error => {
                        console.error(`Erro ao sair do servidor: ${guild.name}`, error);
                    });
            });
        }
    }
}
