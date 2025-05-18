const Discord = require("discord.js");
const { MessageEmbed, PermissionFlagsBits, ButtonBuilder, ComponentType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { produtos, DefaultMessages, General } = require("../databases");
const { QuickDB } = require("quick.db");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permissionsmessage2')

const editEmbed = {
    content: `⚠️ | Use o Comando Novamente!`,
    components: [],
    embeds: []
};

const editMessage = async (message) => {
    try {
        await message.edit(editEmbed)
    } catch (error) {

    }

};

const createCollector = (message) => {
    const collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000
    });

    collector.on('collect', () => {
        collector.stop();
    });

    collector.on('end', (collected) => {
        if (collected.size === 0) {

            editMessage(message);

        }
    });
};

async function StartConfigProduto(interaction, produto, client, user) {
    var u = produtos.get(`${produto}_${interaction.guild.id}.settings.price`)
    var s = await produtos.get(`${produto}_${interaction.guild.id}.settings.estoque`)

    const gfgf = await produtos.get(`${produto}_${interaction.guild.id}`)
    if(gfgf == null) return interaction.reply({content: `❌ | Este produto não está configurado para este servidor!`, ephemeral: true})

    var ggg = produtos.get(`${produto}_${interaction.guild.id}.settings.CargosBuy`)

    if (ggg == null) {
        ggg = `\`Todos Cargos!\``
    } else {
        let roleMentions = '';

        for (const roleId of ggg) {
            roleMentions += `\n- <@&${roleId}>`;
        }
        ggg = roleMentions;
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | **Descrição:**\n\n${produtos.get(`${produto}_${interaction.guild.id}.settings.desc`)}\n\n${obterEmoji(7)} | Id: ${produtos.get(`${produto}_${interaction.guild.id}.ID`)}\n🏷️ | Nome: ${produtos.get(`${produto}_${interaction.guild.id}.settings.name`)}\n${obterEmoji(14)} | Preço: R$ ${Number(u).toFixed(2)}\n${obterEmoji(12)} | Estoque quantidade: ${s == null ? 0 : Object.keys(s).length}\n\n${obterEmoji(13)} | Cargos que podem comprar: ${ggg}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("alterarnomeproduto")
                .setLabel('NOME')
                .setEmoji(`1213804917123452928`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("alterarpriceproduto")
                .setLabel('PREÇO')
                .setEmoji(`1224797970885771325`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("alterardescproduto")
                .setLabel('DESCRIÇÃO')
                .setEmoji(`1257118195417092116`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("alterarestoqueproduto")
                .setLabel('ESTOQUE')
                .setEmoji(`1238273914992328734`)
                .setStyle(3)
                .setDisabled(false))

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("configavancadaproduto")
                .setLabel('Configurações Avançadas')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("deletarproduto")
                .setLabel('DELETAR')
                .setEmoji(`1225163648918356051`)
                .setStyle(4)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("infoproduto")
                .setEmoji(`1168718364491927573`)
                .setStyle(1)
                .setDisabled(false))

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("CargosBuyer")
                .setLabel('Cargos autorizados comprar')
                .setEmoji(`1176326985052590132`)
                .setStyle(3)
                .setDisabled(false),)



    if (interaction.message == undefined) {
        await interaction.reply({ embeds: [embed], components: [row, row2, row3] }).then(async u => {
            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            uu.set(lastMessage.id, { user: user, produto: produto })
            createCollector(u);
        })
    } else {
        interaction.message.edit({ embeds: [embed], components: [row, row2, row3] }).then(u => {
            createCollector(u);
        })
    }
}

function alterarnomeproduto(interaction, produto, user, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`🏷️ | **Nome Atual:** ${produtos.get(`${produto}_${interaction.guild.id}.settings.name`)}\n\nEnvie o novo nome abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**`)

    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            produtos.set(`${produto}_${interaction.guild.id}.settings.name`, message.content)
            msg.reply({ content: `${obterEmoji(8)} | O nome foi atualizado com sucesso para \`${message.content}\`.` }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await interaction.message.edit({
                    content: `⚠️ | Use o Comando Novamente!`,
                    components: [],
                    embeds: []
                })
            } catch (error) {

            }

        });
    })
}

function alterarpriceproduto(interaction, produto, user, client) {
    var u = produtos.get(`${produto}_${interaction.guild.id}.settings.price`)
    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(14)} | **Preço Atual:** ${Number(u).toFixed(2)}\n\nEnvie o novo preço abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**
`)

    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            if (isNaN(message.content)) {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu um valor INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            produtos.set(`${produto}_${interaction.guild.id}.settings.price`, message.content)
            msg.reply({ content: `${obterEmoji(8)} | O preço foi atualizado com sucesso para \`${Number(message.content).toFixed(2)}\`.`, ephemeral: true }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await interaction.message.edit({
                    content: `⚠️ | Use o Comando Novamente!`,
                    components: [],
                    embeds: []
                })
            } catch (error) {

            }

        });
    })
}

function alterardescproduto(interaction, produto, user, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | **Descrição atual:** \`\`\`${produtos.get(`${produto}_${interaction.guild.id}.settings.desc`)}\`\`\`\nEnvie a nova descrição abaixo:\n\nCaso queira cancelar escreva abaixo **cancelar**
`)

    interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {

        const filter = message => message.author.id === interaction.user.id
        const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
        collector.on('collect', async (message) => {
            message.delete()
            collector.stop()

            if (message.content == `cancelar`) {
                StartConfigProduto(interaction, produto, client, user)
                return
            }

            if (message.content == '') {
                msg.reply({ content: `${obterEmoji(22)} | Você inseriu uma descrição INVÁLIDO para seu PRODUTO.`, ephemeral: true }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                StartConfigProduto(interaction, produto, client, user)
                return
            }
            produtos.set(`${produto}_${interaction.guild.id}.settings.desc`, message.content)
            msg.reply({ content: `${obterEmoji(8)} | A descrição foi atualizado com sucesso.`, ephemeral: true }).then(msg => {
                setTimeout(() => {
                    msg.delete()
                }, 5000);
            })
            StartConfigProduto(interaction, produto, client, user)
        })
        collector.on('end', async (message) => {
            message.delete()
            collector.stop()
            if (message.size >= 1) return
            try {
                await interaction.message.edit({
                    content: `⚠️ | Use o Comando Novamente!`,
                    components: [],
                    embeds: []
                })
            } catch (error) {

            }

        });
    })
}




async function alterarestoqueproduto(interaction, produto, user, client) {
    const u = produtos.get(`${produto}_${interaction.guild.id}.settings.estoque`)
    var result = '';
    for (const key in u) {
        result += `${obterEmoji(12)}**| ` + key + '** - ' + u[key] + '\n';
    }
    if (result == '') result = 'Sem estoque, adicione'

    var fot = 'Esse é seu estoque completo!'
    if (result.length >= 2048) {
        result = result.substring(0, 2000); // Obter os primeiros 2000 caracteres
        fot = "Existem + produtos no estoque, faça um backup para ver seu estoque completo!";
    }

    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Gerenciar Produto`)
        .setDescription(`${obterEmoji(19)} | Este é seu estoque:\n\n${result}`)
        .setFooter({ text: `${fot}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })



    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("addstock")
                .setLabel('ADICIONAR')
                .setEmoji(`1223710032001110086`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("remstock")
                .setLabel('REMOVER')
                .setEmoji(`1225171461036179549`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("backupstock")
                .setLabel('BACKUP')
                .setEmoji(`💾`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("clearstock")
                .setLabel('LIMPAR')
                .setEmoji(`1225163648918356051`)
                .setStyle(4)
                .setDisabled(false))
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
                
            new ButtonBuilder()
                .setCustomId("vltconfigstart")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(1)
                .setDisabled(false),
        )


    interaction.message.edit({ embeds: [embed], components: [row, row2] }).then(u => {
        createCollector(u);
    })

}

function configavancadaproduto(interaction, produto, user, client) {
    const embed = new Discord.EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Outras Configurações`)
        .setDescription(`🛒 | Categoria: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.categoria`) == null ? 'Não definido' : `<#${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.categoria`)}>`}\n📂 | Banner: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.banner`) == null ? 'Não definido' : `[Banner](${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.banner`)})`}\n🖼️ | Miniatura: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.miniatura`) == null ? 'Não definido' : `[Miniatura](${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.miniatura`)})`}\n${obterEmoji(13)} | Cargo: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.cargo.name`) == null ? 'Não definido' : `<@&${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.cargo.name`)}>`}\n🖌️ | Cor Embed: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.color`) == null ? '#2b2d31' : `${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.color`)}`}\n🕳 | Cupom: ${produtos.get(`${produto}_${interaction.guild.id}.embedconfig.cupom`) == true ? 'Pode utilizar cupom nesse produto!' : `Não pode utilizar nenhum cupom nesse produto!`}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("BannerChangeProduto")
                .setLabel('Banner')
                .setEmoji(`🖼️`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("MiniaturaChangeProduto")
                .setLabel('Miniatura')
                .setEmoji(`🖼️`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("CargoChangeProduto")
                .setLabel('Cargo')
                .setEmoji(`1176326985052590132`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("CorEmbedProduto")
                .setLabel('Cor Embed')
                .setEmoji(`🖌️`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("CategoriaProdutoChangeeee")
                .setLabel('Definir Categoria')
                .setEmoji(`1257856237354356818`)
                .setStyle(1)
                .setDisabled(false))
    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("togglecuponsprodutoo")
                .setLabel('Ativar/Desativar Cupons')
                .setEmoji(`1190299502377173025`)
                .setStyle(1)
                .setDisabled(false))
    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("atualizarmessageprodutosone")
                .setLabel('Atualizar Mensagem')
                .setEmoji(`1057128786501566564`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("vltconfigstart")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(1)
                .setDisabled(false),
        )
    interaction.message.edit({ embeds: [embed], components: [row, row2, row3] }).then(u => {
        createCollector(u);
    })
}



async function CargoChangeProduto(interaction, client) {
    const t = await uu.get(interaction.message.id)

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Outras Configurações`)
        .setDescription(`${obterEmoji(13)} | Cargo:  ${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.name`) == null ? 'Não configurado...' : `<@&${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.name`)}>`}\n🕒 | Cargo Temporário: ${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.tempo`) == null ? 'Não configurado...' : `${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.tempo`)}`}`)
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("setroleproduto")
                .setLabel('Setar Cargo')
                .setEmoji(`1176326985052590132`)
                .setStyle(1)
                .setDisabled(false))
    if (produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.name`) == null) {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto")
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1225170562209550437')
                .setStyle(1)
                .setDisabled(true)
        );
    } else {
        row.addComponents(
            new ButtonBuilder()
                .setCustomId("settemproleproduto")
                .setLabel('Cargo Temporário On/Off')
                .setEmoji('1225170562209550437')
                .setStyle(1)
                .setDisabled(false)
        );
    }
    row.addComponents(
        new ButtonBuilder()
            .setCustomId("vlarteconfigavancadaproduto")
            .setLabel('Voltar')
            .setEmoji(`⬅️`)
            .setStyle(1)
            .setDisabled(false),
    );
    interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
        createCollector(u);
    })
}








async function atualizarmessageprodutosone(interaction, client) {
    const t = await uu.get(interaction.message.id)
    if (t.user !== interaction.user.id) return interaction.deferUpdate()
    var s = produtos.get(`${t.produto}_${interaction.guild.id}.settings.estoque`)
    var dd = produtos.get(`${t.produto}_${interaction.guild.id}`)

    const embeddesc = DefaultMessages.get(`ConfigGeral`)


    var modifiedEmbeddesc = embeddesc.embeddesc
        .replace('#{desc}', produtos.get(`${t.produto}_${interaction.guild.id}.settings.desc`))
        .replace('#{nome}', produtos.get(`${t.produto}_${interaction.guild.id}.settings.name`))
        .replace('#{preco}', Number(produtos.get(`${t.produto}_${interaction.guild.id}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
        .replace('#{nome}', produtos.get(`${t.produto}_${interaction.guild.id}.settings.name`))
        .replace('#{preco}', Number(produtos.get(`${t.produto}_${interaction.guild.id}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length)

    const dddddd = General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? `#000000` : General.get(`ConfigGeral.ColorEmbed`)

    const embed = new Discord.EmbedBuilder()
        .setTitle(modifiedEmbeddesc2)
        .setDescription(modifiedEmbeddesc)
        .setColor(`${dd.embedconfig.color == null ? dddddd : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== undefined) {

        embed.setImage(dd.embedconfig.banner)
    } else {

        if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
            embed.setImage(General.get(`ConfigGeral.BannerEmbeds`))
        }
    }


    if (dd.embedconfig.miniatura !== undefined) {
        embed.setThumbnail(dd.embedconfig.miniatura)
    } else {
        if (General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
            embed.setThumbnail(General.get(`ConfigGeral.MiniaturaEmbeds`))
        }
    }

    if (DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
        embed.setFooter({ text: DefaultMessages.get(`ConfigGeral.embedrodape`) })
    }


    if (DefaultMessages.get(`ConfigGeral.embedrodape`) !== null) {
        embed.setFooter({ text: DefaultMessages.get(`ConfigGeral.embedrodape`) })
    }



    try {
        const channel = await client.channels.fetch(dd.ChannelID);
        const fetchedMessage = await channel.messages.fetch(dd.MessageID);






        await fetchedMessage.edit({ embeds: [embed] });
        await interaction.reply({ content: `${obterEmoji(8)} | Mensagem do produto: \`${t.produto}\``, ephemeral: true })
    } catch (error) {

    }
}

module.exports = {
    StartConfigProduto,
    alterarnomeproduto,
    alterarpriceproduto,
    alterardescproduto,
    alterarestoqueproduto,
    configavancadaproduto,

    CargoChangeProduto,
    atualizarmessageprodutosone
};