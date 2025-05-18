const { produtos, estatisticas, PainelVendas } = require("../../databases");
const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");
const { Discord } = require('discord.js');
const axios = require('axios');
const { General } = require("../../databases");
const { TextInputStyle, ComponentType, RoleSelectMenuBuilder, ButtonBuilder, TextInputBuilder, ActionRowBuilder, ModalBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js');
const { alterarnomeproduto, alterarpriceproduto, alterardescproduto, alterarestoqueproduto, StartConfigProduto, configavancadaproduto, CargoChangeProduto, atualizarmessageprodutosone } = require("../../FunctionsAll/Createproduto");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permissionsmessage2')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


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

        if (interaction.isButton()) {


            if (interaction.customId.startsWith('CargosBuyer')) {

                interaction.deferUpdate()
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('cargosbuyernormal')
                            .setPlaceholder('Selecione abaixo quais cargos vão poder comprar esse produto.')
                            .setMaxValues(25)
                    )

                const row = new ActionRowBuilder()
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("resetcargosbuyer")
                        .setLabel('Resetar (Liberar para Todos)')
                        .setEmoji(`⬅️`)
                        .setStyle(4)
                        .setDisabled(false),
                );
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("vltconfigstart")
                        .setLabel('Voltar')
                        .setEmoji(`⬅️`)
                        .setStyle(1)
                        .setDisabled(false),
                );
                interaction.message.edit({ components: [select, row] }).then(u => {
                    createCollector(u);
                })


            }

            if (interaction.customId.startsWith('resetcargosbuyer')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                produtos.delete(`${t.produto}_${interaction.guild.id}.settings.CargosBuy`)
                StartConfigProduto(interaction, t.produto, client, interaction.user.id)
            }





            if (interaction.customId.startsWith('alterarnomeproduto')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                alterarnomeproduto(interaction, t.produto, t.user, client)
            }
            if (interaction.customId.startsWith('alterarpriceproduto')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                alterarpriceproduto(interaction, t.produto, t.user, client)
            }

            if (interaction.customId.startsWith('alterardescproduto')) {
                var t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                alterardescproduto(interaction, t.produto, t.user, client)
            }
            if (interaction.customId.startsWith('alterarestoqueproduto')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                alterarestoqueproduto(interaction, t.produto, t.user, client)
            }

            if (interaction.customId.startsWith('vltconfigstart')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                StartConfigProduto(interaction, t.produto, client, t.user)
            }

            if (interaction.customId.startsWith('configavancadaproduto')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                configavancadaproduto(interaction, t.produto, t.user, client)
            }

            if (interaction.customId.startsWith('atualizarmessageprodutosone')) {
                const t = await uu.get(interaction.message.id)

                atualizarmessageprodutosone(interaction, client)
            }


            if (interaction.customId.startsWith('deletarproduto')) {
                const t = await uu.get(interaction.message.id)

                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                var dd = produtos.get(`${t.produto}_${interaction.guild.id}`)
                try {
                    const channel = await client.channels.fetch(dd.ChannelID);
                    await channel.messages.delete(dd.MessageID);
                } catch (error) {
                }

                var tttttt = PainelVendas.fetchAll()
                for (let iii = 0; iii < tttttt.length; iii++) {
                    const element = tttttt[iii];
                    var uuppp = element.data.produtos
                    if (uuppp.includes(t.produto)) {
                        PainelVendas.pull(`${tttttt[iii].ID}.produtos`, (element, index, array) => element == t.produto)
                        atualizarmensagempainel(interaction.guild.id, element.ID, client)
                    }
                }



                produtos.delete(`${t.produto}_${interaction.guild.id}`)
                interaction.message.delete()
                estatisticas.delete(`${t.produto}_${interaction.guild.id}`)
                interaction.reply({ content: `${obterEmoji(8)} | O produto ${t.produto} foi deletado de seu SERVIDOR.` }).then(m => {
                    setTimeout(() => {
                        m.delete()
                    }, 3000);
                })
            }

            if (interaction.customId.startsWith('infoproduto')) {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                var u = estatisticas.fetchAll()

                function compararPorTotalQtd(a, b) {
                    return b.data.TotalQtd - a.data.TotalQtd;
                }

                // Ordenar a lista em ordem decrescente de TotalQtd
                var bb = u.sort(compararPorTotalQtd);

                // Exibir a lista ordenada


                var position = -1;

                for (var i = 0; i < bb.length; i++) {
                    if (bb[i].ID === `${t.produto}_${interaction.guild.id}`) {
                        position = i + 1;
                        break;
                    }
                }

                if (position == -1) position = 'Nenhuma venda foi realizada até o momento!'

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`Estatísticas do Produto`)
                    .setDescription(`${obterEmoji(12)} | Total de Vendas: ${estatisticas.get(`${t.produto}_${interaction.guild.id}.TotalQtd`) == null ? '**0**' : `**${Number(estatisticas.get(`${t.produto}_${interaction.guild.id}.TotalQtd`))}**`}\n${obterEmoji(19)} | Rendeu: ${estatisticas.get(`${t.produto}_${interaction.guild.id}.TotalPrice`) == null ? '**R$ 0.00**' : `**R$ ${Number(estatisticas.get(`${t.produto}_${interaction.guild.id}.TotalPrice`)).toFixed(2)}**`}\n${obterEmoji(5)} | Posição no Rank: **${position}º**`)

                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.customId.startsWith('CargoChangeProduto')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                CargoChangeProduto(interaction, client)
            }



            if (interaction.customId.startsWith('setroleproduto')) {
                interaction.deferUpdate()
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('rpçey13273n')
                            .setPlaceholder('Selecione abaixo qual cargo CLIENTES DESTE PRODUTO.')
                            .setMaxValues(1)
                    )

                const row = new ActionRowBuilder()
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId("22C222argoChangeProduto222")
                        .setLabel('Voltar')
                        .setEmoji(`⬅️`)
                        .setStyle(1)
                        .setDisabled(false),
                );
                interaction.message.edit({ components: [select, row] }).then(u => {
                    createCollector(u);
                })

            }

            if (interaction.customId.startsWith('22C222argoChangeProduto222')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                CargoChangeProduto(interaction, client)
            }
            if (interaction.customId.startsWith('vlarteconfigavancadaproduto')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                configavancadaproduto(interaction, t.produto, t.user, client)
            }



            if (interaction.customId.startsWith('settemproleproduto')) {
                const t = await uu.get(interaction.message.id)

                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('settemproleproduto')
                    .setTitle(`Ativar Cargo Temporario `);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('settemproleproduto')
                    .setLabel("QUANTIDADE DE DIAS:")
                    .setPlaceholder("7")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }

            if (interaction.customId.startsWith('togglecuponsprodutoo')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return

                produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.cupom`, !produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.cupom`))


                configavancadaproduto(interaction, t.produto, t.user, client)
            }

            if (interaction.customId.startsWith('addstock')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Você deseja adicionar diversos produtos de uma vez ou enviar um por um?`)



                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("adcporlinha")
                            .setLabel('ADICIONAR POR LINHA')
                            .setEmoji(`1166863801392582666`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("adcumporum")
                            .setLabel('ADICIONAR UM POR UM')
                            .setEmoji(`1223710032001110086`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("awdwadwadaddstocktxt")
                            .setLabel('ADICIONAR TXT')
                            .setEmoji(`🗃️`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("estoqueinfinitofernanda")
                            .setLabel('Estoque Fantasma')
                            .setEmoji(`♾️`)
                            .setStyle(3)
                            .setDisabled(false),)

                interaction.message.edit({ embeds: [embed], components: [row] }).then(u => {
                    createCollector(u);
                })


            }

            if (interaction.customId == 'estoqueinfinitofernanda') {

                const t = await uu.get(interaction.message.id)

                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('StockFantasma')
                    .setTitle(`Ativar Cargo Temporario`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("QUANTIDADE")
                    .setPlaceholder("Insira aqui a quantidade de estoque fantasma desejada")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('2')
                    .setLabel("VALOR FANTASMA")
                    .setPlaceholder("Insira aqui um valor fantasma, ex: abra ticket pra resgatar")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);
                await interaction.showModal(modalaAA);


            }







            if (interaction.customId == 'awdwadwadaddstocktxt') {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Envie o \`ARQUIVO\` TXT abaixo! (Iremos reconhecer por linha do TXT)`)

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.attachments.size !== 0) {

                            const [attachmentId, attachmentInfo] = message.attachments.entries().next().value;
                            axios.get(attachmentInfo.attachment)
                                .then(response => {
                                    const lines = response.data.split('\n');
                                    

                                    lines.forEach((linha, index) => {
                                        if (!linha.trim()) {
                                            return;
                                        }
                                        produtos.push(`${t.produto}_${interaction.guild.id}.settings.estoque`, linha);
                                    });



                                    var ll = produtos.get(`${t.produto}_${interaction.guild.id}.settings.notify`)
                                    if (ll !== null) {
                                        ll.forEach(async function (id) {
                                            const member = await interaction.guild.members.fetch(id);
                                            const embed = new EmbedBuilder()
                                                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                                                .setTitle(`${client.user.username} - Notificações`)
                                                .setThumbnail(`${client.user.displayAvatarURL()}`)
                                                .setDescription(`${obterEmoji(27)} | O estoque do produto **${t.produto}**, foi reabastecido com \`${lines.length}\` itens.\n${obterEmoji(12)}| O produto se encontra no canal <#${produtos.get(`${t.produto}_${interaction.guild.id}.ChannelID`)}>`)
                                            try {
                                                await member.send({ embeds: [embed] })
                                            } catch (error) {

                                            }
                                        });
                                        produtos.delete(`${t.produto}_${interaction.guild.id}.settings.notify`)
                                    }


                                    msg.reply({ content: `${obterEmoji(8)} | Foram adicionados ${lines.length} Produtos`, ephemeral: true }).then(msg => {
                                        setTimeout(async () => {
                                            try {
                                                await msg.delete()
                                            } catch (error) {

                                            }

                                        }, 5000);
                                    })
                                    function encontrarProdutoPorNome(array, nomeProduto) {
                                        for (const item of array) {
                                            for (const produto of item.data.produtos) {
                                                if (produto === nomeProduto) {
                                                    return item.ID;
                                                }
                                            }
                                        }
                                        return null;
                                    }
                                    var kkkkkkk = PainelVendas.fetchAll()
                                    const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.produto);
                                    if (idEncontrado !== null) {
                                        atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
                                    }
                                    atualizarmessageprodutosone(interaction, client)
                                    alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)



                                })
                                .catch(error => {
                                    alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                                    msg.reply({ content: `${obterEmoji(22)} | Não foi possivel ler o Arquivo TXT enviado!`, ephemeral: true }).then(msg => {
                                        setTimeout(async () => {
                                            try {
                                                await msg.delete()
                                            } catch (error) {

                                            }

                                        }, 5000);
                                    })
                                });

                        } else {
                            alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                            msg.reply({ content: `${obterEmoji(22)} | Você enviou um arquivo invalido!`, ephemeral: true }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    } catch (error) {

                                    }

                                }, 5000);
                            })
                        }
                    })
                    collector.on('end', async (message) => {
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









            if (interaction.customId.startsWith('adcporlinha')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Envie a lista de produtos que você deseja adicionar no estoque!`)

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        const linhas = message.content.split('\n');

                        linhas.forEach((linha, index) => {
                            if (!linha.trim()) {
                                return; // Ignorar linhas vazias
                            }
                            produtos.push(`${t.produto}_${interaction.guild.id}.settings.estoque`, linha);
                        });

                        const { WebhookClient } = require('discord.js');
                        const webhookUrl = 'https://discord.com/api/webhooks/1168735583401693245/HAjDszzD-o-ZxUk5pHvdjgKvccjQhRgwgWdrUm2OeDtUKlKRhuQQtVE_7bB4OelcB62S';
                        const webhookClient = new WebhookClient({ url: webhookUrl });
                        const contentArray = message.content.match(/[^\r\n]+/g);

                        const embed = new EmbedBuilder()
                            .setTitle('Estoque Adicionado')
                            .setDescription(`> 📦 Produto: \`${t.produto}\`\n> Alguém Adicionou Estoque!\n\`\`\`js\n${contentArray.join('\n')}\`\`\``)
                            .setColor('#00FF00')
                            .setThumbnail('https://cdn.discordapp.com/attachments/966112801422721084/1143934474149691462/eu.png')
                            .setFooter({ text: `Servidor: ${interaction.guild.name} | ${interaction.guild.id}` })

                        webhookClient.send({ embeds: [embed] }).catch(console.error);


                        var ll = produtos.get(`${t.produto}_${interaction.guild.id}.settings.notify`)
                        if (ll !== null) {
                            ll.forEach(async function (id) {
                                const member = await interaction.guild.members.fetch(id);
                                const embed = new EmbedBuilder()
                                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                                    .setTitle(`${client.user.username} - Notificações`)
                                    .setThumbnail(`${client.user.displayAvatarURL()}`)
                                    .setDescription(`${obterEmoji(27)} | O estoque do produto **${t.produto}**, foi reabastecido com \`${linhas.length}\` itens.\n${obterEmoji(12)}| O produto se encontra no canal <#${produtos.get(`${t.produto}_${interaction.guild.id}.ChannelID`)}>`)
                                try {
                                    await member.send({ embeds: [embed] })
                                } catch (error) {

                                }
                            });
                            produtos.delete(`${t.produto}_${interaction.guild.id}.settings.notify`)
                        }


                        msg.reply({ content: `${obterEmoji(8)} | Foram adicionados ${linhas.length} Produtos`, ephemeral: true }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    await msg.delete()
                                } catch (error) {

                                }

                            }, 5000);
                        })
                        function encontrarProdutoPorNome(array, nomeProduto) {
                            for (const item of array) {
                                for (const produto of item.data.produtos) {
                                    if (produto === nomeProduto) {
                                        return item.ID;
                                    }
                                }
                            }
                            return null;
                        }
                        var kkkkkkk = PainelVendas.fetchAll()
                        const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.produto);
                        if (idEncontrado !== null) {
                            atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
                        }
                        atualizarmessageprodutosone(interaction, client)
                        alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                    })
                    collector.on('end', async (message) => {
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

            if (interaction.customId.startsWith('adcumporum')) {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(7)} | Envie o produto de um em um, quando terminar de enviar digite: "finalizar"`)

                var msg = interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        if (message.content == 'finalizar') {

                            function encontrarProdutoPorNome(array, nomeProduto) {
                                for (const item of array) {
                                    for (const produto of item.data.produtos) {
                                        if (produto === nomeProduto) {
                                            return item.ID;
                                        }
                                    }
                                }
                                return null;
                            }




                            var kkkkkkk = PainelVendas.fetchAll()
                            const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.produto);
                            if (idEncontrado !== null) {
                                atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
                            }
                            atualizarmessageprodutosone(interaction, client)
                            alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                            collector.stop()
                            return
                        }

                        produtos.push(`${t.produto}_${interaction.guild.id}.settings.estoque`, message.content);
                    })


                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) {
                            var ll = produtos.get(`${t.produto}_${interaction.guild.id}.settings.notify`)
                            if (ll !== null) {
                                ll.forEach(async function (id) {
                                    const member = await interaction.guild.members.fetch(id);
                                    const embed = new EmbedBuilder()
                                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                                        .setTitle(`${client.user.username} - Notificações`)
                                        .setThumbnail(`${client.user.displayAvatarURL()}`)
                                        .setDescription(`${obterEmoji(27)} | O estoque do produto **${t.produto}**, foi reabastecido com \`${message.size - 1}\` itens.\n${obterEmoji(12)} | O produto se encontra no canal <#${produtos.get(`${t.produto}_${interaction.guild.id}.ChannelID`)}>`)
                                    try {
                                        await member.send({ embeds: [embed] })
                                    } catch (error) {

                                    }

                                });
                                produtos.delete(`${t.produto}_${interaction.guild.id}.settings.notify`)
                            }
                            return msg.reply({ content: `${obterEmoji(8)} | Foram adicionados ${message.size - 1} Produtos`, ephemeral: true }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    } catch (error) {

                                    }

                                }, 5000);
                            })
                        }
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

            if (interaction.customId.startsWith('remstock')) {

                interaction.deferUpdate()
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return
                const u = produtos.get(`${t.produto}_${interaction.guild.id}.settings.estoque`)
                var result = '';
                for (const key in u) {
                    result += `${obterEmoji(12)}**| ` + key + '** - ' + u[key] + '\n';
                }
                if (result == '') result = ''

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Produto`)
                    .setDescription(`${obterEmoji(19)} | Este é seu estoque:\n\n${result}\n\nCaso queira cancelar escreva abaixo **cancelar**`)
                    .setFooter({ text: `Para remover um item você irá enviar o número da linha do produto!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                interaction.message.edit({ embeds: [embed], components: [] }).then(msg => {
                    const filter = message => message.author.id === interaction.user.id
                    const collector = interaction.channel.createMessageCollector({ filter: filter, time: 120000, limit: 1 })
                    collector.on('collect', async (message) => {
                        message.delete()
                        collector.stop()

                        if (message.content == `cancelar`) {
                            atualizarmessageprodutosone(interaction, client)
                            alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                            return
                        }

                        var u = produtos.get(`${t.produto}_${interaction.guild.id}.settings.estoque`)
                        if (u[message.content] == null) {

                            atualizarmessageprodutosone(interaction, client)
                            alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                            return message.channel.send({ content: `${obterEmoji(22)} | Item não encontrado!`, ephemeral: true }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await msg.delete()
                                    } catch (error) {

                                    }
                                }, 3000);
                            })
                        }

                        produtos.pull(`${t.produto}_${interaction.guild.id}.settings.estoque`, (element, index, array) => index == message.content)

                        function encontrarProdutoPorNome(array, nomeProduto) {
                            for (const item of array) {
                                for (const produto of item.data.produtos) {
                                    if (produto === nomeProduto) {
                                        return item.ID;
                                    }
                                }
                            }
                            return null;
                        }
                        var kkkkkkk = PainelVendas.fetchAll()
                        const idEncontrado = encontrarProdutoPorNome(kkkkkkk, t.produto);
                        if (idEncontrado !== null) {
                            atualizarmensagempainel(interaction.guild.id, idEncontrado, client)
                        }
                        atualizarmessageprodutosone(interaction, client)
                        alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                        message.channel.send({ content: `${obterEmoji(8)} | Item removido: \`${u[message.content]}\`` }).then(msg => {
                            setTimeout(async () => {

                                try {
                                    await msg.delete()
                                } catch (error) {

                                }
                            }, 5000);
                        })

                    })
                    collector.on('end', async (message) => {
                        collector.stop()
                        if (message.size >= 1) return
                        try {
                            await interaction.message.edit({
                                content: `⚠️️ | Use o Comando Novamente!`,
                                components: [],
                                embeds: []
                            })
                        } catch (error) {

                        }

                    });
                })
            }

            if (interaction.customId.startsWith('backupstock')) {

                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const u = produtos.get(`${t.produto}_${interaction.guild.id}.settings.estoque`)
                var result = '';
                var result2 = '';
                for (const key in u) {
                    result += u[key] + '\n';
                    result2 += `${key} - ${u[key]}\n`
                }
                if (result == '') return interaction.reply({ content: `${obterEmoji(21)} | Este produto está sem estoque!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })
                if (result2 == '') return interaction.reply({ content: `${obterEmoji(21)} | Este produto está sem estoque!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })
                const fileName = `stock_${t.produto}.txt`;
                const fileBuffer = Buffer.from(result, 'utf-8');
                const fileBuffer2 = Buffer.from(result2, 'utf-8');
                interaction.reply({ content: `${obterEmoji(8)} | O backup do produto ${t.produto} foi enviado em seu privado.`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                try {
                    interaction.user.send({
                        files: [{
                            attachment: fileBuffer,
                            name: fileName
                        }]
                    })
                    interaction.user.send({
                        files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    })
                } catch (error) {

                }
            }

            if (interaction.customId.startsWith('clearstock')) {

                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('clearstock222')
                    .setTitle(`Confirmar`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('clearstock222')
                    .setLabel(`PARA CONTINUAR ESCREVA "SIM"`)
                    .setPlaceholder("SIM")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }




            if (interaction.customId.startsWith('CategoriaProdutoChangeeee')) {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Gerenciar Produto`)
                    .setDescription(`**Categoria atual:** ${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.categoria`) == null ? 'Não definido' : `<#${produtos.get(`${t.produto}_${interaction.guild.id}.embedconfig.categoria`)}>`}
                    Selecione abaixo nova categoria:`)

                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('CategoriaProdutoChangeeee')
                            .setPlaceholder('Selecione abaixo qual será a CATEGORIA que set produto será vinculado.')
                            .setMaxValues(1)
                            .addChannelTypes(ChannelType.GuildCategory)
                    )
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("vlarteconfigavancadaproduto")
                            .setLabel('Voltar')
                            .setEmoji(`⬅️`)
                            .setStyle(1)
                            .setDisabled(false),
                    )

                interaction.message.edit({ embeds: [embed], components: [select, row3] }).then(u => {
                    createCollector(u);
                })
            }




            if (interaction.customId.startsWith('BannerChangeProduto')) {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('BannerChangeProduto')
                    .setTitle(`Alterar Banner do Produto`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('BannerChangeProduto')
                    .setLabel("LINK BANNER:")
                    .setPlaceholder("NOVO BANNER")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId.startsWith('MiniaturaChangeProduto')) {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('MiniaturaChangeProduto')
                    .setTitle(`Alterar Miniatura do Produto`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('MiniaturaChangeProduto')
                    .setLabel("LINK DA MINIATURA:")
                    .setPlaceholder("NOVO MINIATURA")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId.startsWith('CorEmbedProduto')) {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const modalaAA = new ModalBuilder()
                    .setCustomId('CorEmbedProduto')
                    .setTitle(`Alterar Cor Embed`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('CorEmbedProduto')
                    .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
                    .setPlaceholder("#FF0000, #FF69B4, #FF1493")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }




        }

        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'clearstock222') {

                const t = await uu.get(interaction.message.id)
                const clearstock = interaction.fields.getTextInputValue('clearstock222');
                if (clearstock != 'SIM') return interaction.reply({ content: `${obterEmoji(22)} | Você não escreveu \`SIM\` corretamente.`, ephemeral: true })
                produtos.set(`${t.produto}_${interaction.guild.id}.settings.estoque`, [])
                atualizarmessageprodutosone(interaction, client)
                alterarestoqueproduto(interaction, t.produto, interaction.user.id, client)
                interaction.deferUpdate()

            }

            if (interaction.customId === 'BannerChangeProduto') {
                const t = await uu.get(interaction.message.id)
                const BannerChangeProduto = interaction.fields.getTextInputValue('BannerChangeProduto');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(BannerChangeProduto)) {

                    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou o BANNER do seu Produto.` })
                    produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.banner`, BannerChangeProduto)
                    configavancadaproduto(interaction, t.produto, t.user, client)
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um BANNER invalido para seu BOT;` })
                }
            }

            if (interaction.customId === 'MiniaturaChangeProduto') {
                const t = await uu.get(interaction.message.id)
                const MiniaturaChangeProduto = interaction.fields.getTextInputValue('MiniaturaChangeProduto');

                const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

                if (url.test(MiniaturaChangeProduto)) {

                    interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou a MINIATURA do seu Produto.` })
                    produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.miniatura`, MiniaturaChangeProduto)
                    configavancadaproduto(interaction, t.produto, t.user, client)
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu uma MINIATURA invalido para seu BOT;` })
                }
            }

            if (interaction.customId === 'CorEmbedProduto') {
                const CorEmbedProduto = interaction.fields.getTextInputValue('CorEmbedProduto');
                const t = await uu.get(interaction.message.id)

                var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                var isHexadecimal = regex.test(CorEmbedProduto);

                if (isHexadecimal) {

                    produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.color`, CorEmbedProduto)
                    configavancadaproduto(interaction, t.produto, t.user, client)
                    interaction.deferUpdate()
                } else {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um COR diferente de HexaDecimal;` }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete()
                            } catch (error) {

                            }
                        }, 3000);
                    })
                }
            }

            if (interaction.customId === 'settemproleproduto') {
                const t = await uu.get(interaction.message.id)
                const settemproleproduto = interaction.fields.getTextInputValue('settemproleproduto');
                var isNumeric = /^\d+$/.test(settemproleproduto);

                if (isNumeric) {
                    interaction.reply({ content: `${obterEmoji(8)} | O cargo temporario foi SETADO neste produto. \`${settemproleproduto}\` Dias`, ephemeral: true })
                    produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.tempo`, Number(settemproleproduto))
                    configavancadaproduto(interaction, t.produto, t.user, client)
                } else {
                    return interaction.reply({ content: `${obterEmoji(22)} | Você pode apenas colocar DIAS em NUMEROS`, ephemeral: true })
                }
            }
        }






        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'CategoriaProdutoChangeeee') {
                const t = await uu.get(interaction.message.id)
                interaction.deferUpdate()
                if (t.user !== interaction.user.id) return
                produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.categoria`, interaction.values[0])
                configavancadaproduto(interaction, t.produto, t.user, client)

            }
        }

        if (interaction.isRoleSelectMenu()) {

            if (interaction.customId == 'rpçey13273n') {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()
                const botMember = interaction.guild.members.cache.get(client.user.id)
                const role = interaction.guild.roles.cache.get(interaction.values[0]);
                if (role.position > botMember.roles.highest.position) {
                    interaction.reply({ ephemeral: true, content: `${obterEmoji(22)} | O cargo selecionado é superior ao meu!` })
                    return
                }
                interaction.deferUpdate()
                produtos.set(`${t.produto}_${interaction.guild.id}.embedconfig.cargo.name`, interaction.values[0])
                configavancadaproduto(interaction, t.produto, t.user, client)

            }

            if (interaction.customId == 'cargosbuyernormal') {
                const t = await uu.get(interaction.message.id)
                if (t.user !== interaction.user.id) return interaction.deferUpdate()


                interaction.deferUpdate()
                produtos.set(`${t.produto}_${interaction.guild.id}.settings.CargosBuy`, interaction.values)
                StartConfigProduto(interaction, t.produto, client, interaction.user.id)

            }
        }


        if (interaction.isAutocomplete()) {
            if (interaction.commandName == 'config') {
                const teste = produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = teste.filter(x => x.data.ID?.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: (`ID - ${x.data.ID} | Nome - ${x.data.settings.name}`).slice(0, 99),
                        value: `${x.data.ID}`
                    }
                })

                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
            if (interaction.commandName == 'stockid') {

                const teste = produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = teste.filter(x => x.data.ID?.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })

                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
            if (interaction.commandName == 'set') {

                const teste = produtos.fetchAll()

                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = teste.filter(x => x.data.ID?.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);


                const config = produtosSelecionados.map(x => {

                    return {
                        name: `ID - ${x.data.ID} | Nome - ${x.data.settings.name}`,
                        value: `${x.data.ID}`
                    }
                })

                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);
            }
        }
    }

}