const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ComponentType, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, UserSelectMenuBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const { General, StatusCompras, PagamentosSaldos, drops, estatisticasgeral, Cupom, giftcards, Keys, PainelVendas, usuariosinfo, estatisticas, sugerir, blacklist, produtos } = require("../../databases");
const { avaliacao } = require("../../FunctionsAll/ChackoutPagamentoNovo");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uud = db.table('avaliarrrrr')
const axios = require('axios');
const { UpdateCashBack, ConfigCashBack, configchannels, ButtonDuvidasPainel, SaldoInvitePainel, BlackListPainel, configmoderacao } = require("../../FunctionsAll/BotConfig");
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const { AdicionarSaldo } = require("../../FunctionsAll/Saldo");
const { atualizarmensagempainel } = require("../../FunctionsAll/PainelSettingsAndCreate");
const { atualizarmessageprodutosone, alterarestoqueproduto } = require("../../FunctionsAll/Createproduto");
var uu = db.table('permissionsmessage')
module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'modal2212121212121') {
                const qtd = interaction.fields.getTextInputValue('desccc');

                if (!isNaN(qtd)) {
                    AdicionarSaldo(interaction, interaction.user.id, qtd)
                } else {
                    interaction.reply({ ephemeral: true, content: `❌ | Você adicionou um *VALOR* inválido para ser gerado um pagamento!` })
                }

            }


            if (interaction.customId === 'confirm-reembolso') {

                const qtd = interaction.fields.getTextInputValue('yesorno');

                if (qtd !== 'SIM') return interaction.reply({ content: `Resposta incorreta, reembolso cancelado.`, ephemeral: true })

                var status = StatusCompras.fetchAll()
                for (let i = 0; i < status.length; i++) {
                    const id = status[i].data.IDMessageLogs
                    const IdCompra2 = status[i].data.IdCompra
                    const IdCompra = status[i].data.IdPreference
                    const Metodo = status[i].data.Metodo
                    const valortotal = status[i].data.valortotal
                    const user = status[i].data.user
                    const editsql = status[i].ID



                    if (id == interaction.message.id) {

                        if (Metodo == 'Site') {
                            await realizarReembolso(IdCompra, interaction, id, editsql, IdCompra2, valortotal)
                            estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            const fetchedMessage = await interaction.channel.messages.fetch(id);
                            if (fetchedMessage) {
                                fetchedMessage.edit({ content: `\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}`, components: [] });
                            }
                        } else if (Metodo == 'Saldo') {
                            interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
                            estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            setTimeout(async () => {

                                const fetchedMessage = await interaction.channel.messages.fetch(id);
                                if (fetchedMessage) {
                                    fetchedMessage.edit({
                                        content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}`, components: []
                                    });
                                }

                                interaction.editReply({
                                    content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}
                                        `, ephemeral: true
                                });


                                StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
                                if (PagamentosSaldos.get(`${user}.SaldoAccount`) == null) {
                                    PagamentosSaldos.set(`${user}.SaldoAccount`, Number(valortotal))
                                } else {
                                    PagamentosSaldos.set(`${user}.SaldoAccount`, Number(PagamentosSaldos.get(`${user}.SaldoAccount`)) + Number(valortotal))
                                }


                            }, 3000);
                        } else if (Metodo == 'Pix') {
                            estatisticasgeral.set(`${editsql}.Status`, `Reembolsado`)
                            interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
                            const urlReembolso = `https://api.mercadopago.com/v1/payments/${IdCompra2}/refunds`;
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
                                    const fetchedMessage = await interaction.channel.messages.fetch(id);
                                    if (fetchedMessage) {
                                        fetchedMessage.edit({
                                            content: `👮‍♀️ Reembolso Feito Por: ${interaction.user}\n${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}
                                        `, components: []
                                        });



                                        interaction.editReply({
                                            content: `${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}
                                        `, ephemeral: true
                                        });
                                        StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
                                    }
                                })
                                .catch(error => {
                                    console.error('Erro ao emitir o reembolso:', error.response.data);
                                });
                        }
                    }
                }

            }





            if (interaction.customId === 'avaliacaogerallll') {
                const estrelas = interaction.fields.getTextInputValue('1');
                const desc = interaction.fields.getTextInputValue('2');

                if (estrelas == 1 || estrelas == 2 || estrelas == 3 || estrelas == 4 || estrelas == 5) {


                    function transformarEmEstrelas(numero) {
                        return '\u2B50'.repeat(numero);
                    }

                    const channela = interaction.guild.channels.cache.get(General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`));

                    const embed = new EmbedBuilder()
                        .setTitle(`❤️ | Nova Avaliação`)
                        .setColor("Random")
                        .addFields(
                            { name: `👥 | Avaliação Enviada Por:`, value: `\`${interaction.user.username} - ${interaction.user.id}\`` },
                            { name: `🥰 | Nota:`, value: `${transformarEmEstrelas(estrelas)} (${estrelas}/5)` },
                            { name: `⭐ | Avaliação:`, value: `${desc}` },
                            { name: `⏰ | Data/Horário:`, value: `<t:${Math.ceil(Date.now() / 1000)}> (<t:${Math.ceil(Date.now() / 1000)}:R>)` }
                        )

                    try {
                        await channela.send({ embeds: [embed] })
                        await interaction.reply({ content: `✅ | Avaliação enviada`, ephemeral: true })

                    } catch (error) {
                        interaction.reply({ content: `❌ | Canal de avaliação invalido!`, ephemeral: true })
                        return
                    }


                } else {
                    return interaction.reply({ content: `❌ | Avaliação incorreta.`, ephemeral: true });
                }
            }











            if (interaction.customId === 'sugestaoprodutos') {

                const title = interaction.fields.getTextInputValue('1');
                const desc = interaction.fields.getTextInputValue('2');
                const image = interaction.fields.getTextInputValue('3');

                if (image !== '') {
                    const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                    if (!url.test(image)) return interaction.reply({ content: `❌ | Você inseriu uma imagem incorreta.`, ephemeral: true })
                }



                const channela = interaction.guild.channels.cache.get(General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`));



                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username} - ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTitle(title)
                    .setColor("Random")
                    .setDescription(`\`\`\`${desc}\`\`\``)

                if (image !== '') {
                    embed.setImage(image)
                }

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("sugerir+1")
                            .setLabel('・ 1 - (50%)')
                            .setEmoji(`1041371452001226852`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("sugerir-1")
                            .setLabel('・ 1 - (50%)')
                            .setEmoji(`1041371454211633254`)
                            .setStyle(4)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("moderacaosugerir")
                            .setEmoji(`1200629740420202686`)
                            .setStyle(2)
                            .setDisabled(false),
                    )


                try {
                    await channela.send({ embeds: [embed], content: `${interaction.user}`, components: [row] }).then(async msg => {
                        const thread = await msg.startThread({
                            name: `Debater Sugestão - ${title}`,
                        });

                        if (image !== '') {
                            sugerir.set(msg.id, { aprova: [], reprova: [], title: title, desc: desc, image: image })
                        } else {
                            sugerir.set(msg.id, { aprova: [], reprova: [], title: title, desc: desc, image: null })
                        }
                    })
                    interaction.reply({ content: `✅ | Obrigado por sugerir`, ephemeral: true })
                } catch (error) {
                    interaction.reply({ content: `❌ | Canal de sugestão invalido!`, ephemeral: true })
                    return
                }


            }
        }

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'canalderedirecionamernto') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                var TTTT = interaction.guild.channels.cache.get(interaction.values[0]);

                General.set(`ConfigGeral.channelredirectduvidas`, TTTT.url)

                ButtonDuvidasPainel(interaction, client)
            }
        }


        if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === 'newnamebutton') {
                await interaction.deferUpdate();

                const name = interaction.fields.getTextInputValue('1');
                General.set(`ConfigGeral.textoduvidas`, name)
                ButtonDuvidasPainel(interaction, client)    
            }

            if (interaction.customId === 'newEmojiButton') {
                await interaction.deferUpdate();

                const newEmoji = interaction.fields.getTextInputValue('1');

                const emojiRegex = require('emoji-regex');
                function verificarEmoji(mensagem) {
                    const emojiRegexPattern = emojiRegex();
                    const regex = /<:[^\s]+:\d+>|a/;
                    return emojiRegexPattern.test(mensagem) || regex.test(mensagem);
                }

                if (verificarEmoji(newEmoji) !== true) {
                    await interaction.followUp({ content: `❌ | Você adicionou um EMOJI inválido!`, ephemeral: true })
                    ButtonDuvidasPainel(interaction, client)
                    return
                }

                General.set(`ConfigGeral.emojiduvidas`, newEmoji)
                ButtonDuvidasPainel(interaction, client)
            }

            if (interaction.customId === 'RemoverNaBlacklist') {
                const name = interaction.fields.getTextInputValue('1');
                await interaction.deferUpdate();

                if (!isNaN(name - 1)) {
                    const ashdhasdhsahd = blacklist.get(`BlackList.users`)
                    if (ashdhasdhsahd.length < name - 1) {
                        interaction.followUp({ content: `❌ | Você adicionou um ID incorreto para ser removido!`, ephemeral: true })
                        BlackListPainel(interaction, client)
                        return
                    }

                    blacklist.pull(`BlackList.users`, (element, index, array) => index == name - 1)
                    BlackListPainel(interaction, client)
                } else {
                    interaction.followUp({ content: `❌ | Você adicionou um ID incorreto para ser removido!`, ephemeral: true })
                    BlackListPainel(interaction, client)
                }
            }
        }


        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'roleexpecificoconvite') {
                await interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                General.set(`ConfigGeral.Convites.Cargo`, interaction.values[0])

                SaldoInvitePainel(interaction, client)
            }
        }



        if (interaction.isUserSelectMenu()) {
            if (interaction.customId == 'usersadd') {
                await interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const ddddddddda = interaction.values
                const pp = blacklist.get(`BlackList.users`)

                for (let index = 0; index < ddddddddda.length; index++) {
                    const element = ddddddddda[index];

                    if (pp.includes(element) !== true) {
                        blacklist.push(`BlackList.users`, element)
                    }
                }

                BlackListPainel(interaction, client)
            }
        }

        if (interaction.isButton()) {

            if (interaction.customId == 'todayyyy' || interaction.customId == '7daysss' || interaction.customId == '30dayss' || interaction.customId == 'totalrendimento') {
                var uu22 = db.table('permissionsmessage2')
                
                const ff = await uu22.get(interaction.message.interaction.id)
                if (ff.user !== interaction.user.id) return await interaction.deferUpdate()

                var rendimento = 0
                var pedidos = 0
                var produtos22 = 0

                if (interaction.customId == 'todayyyy') {
                    rendimento = Number(ff.Hoje.Rendimento)
                    pedidos = Number(ff.Hoje.Pedidos)
                    produtos22 = Number(ff.Hoje.produtos22)
                } else if (interaction.customId == '7daysss') {
                    rendimento = Number(ff.SeteDays.Rendimento)
                    pedidos = Number(ff.SeteDays.Pedidos)
                    produtos22 = Number(ff.SeteDays.produtos22)
                } else if (interaction.customId == '30dayss') {
                    rendimento = Number(ff.TrintaDays.Rendimento)
                    pedidos = Number(ff.TrintaDays.Pedidos)
                    produtos22 = Number(ff.TrintaDays.produtos22)
                } else if (interaction.customId == 'totalrendimento') {
                    rendimento = Number(ff.Total.Rendimento)
                    pedidos = Number(ff.Total.Pedidos)
                    produtos22 = Number(ff.Total.produtos22)
                }

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`**Resumo das vendas de hoje**`)
                    .addFields(
                        { name: `**Rendimento**`, value: `\`${rendimento.toFixed(2)}\``, inline: true },
                        { name: `**Pedidos aprovados**`, value: `\`${pedidos}\``, inline: true },
                        { name: `**Produtos entregues**`, value: `\`${produtos22}\``, inline: true },
                    )
                    .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                interaction.update({ embeds: [embed], content: `` })



            }











            if (interaction.customId == 'configmoderacao') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                configmoderacao(interaction, client)

            }



            if (interaction.customId == 'RemoverNaBlacklist') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('RemoverNaBlacklist')
                    .setTitle(`💡 | Remoção BlackList`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("ID da Black-list")
                    .setPlaceholder("Exemplo: 1")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }





            if (interaction.customId == 'ResetarConvites') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                await interaction.deferUpdate()
                await interaction.followUp({ content: `✅ | Você resetou TODAS configurações de invites`, ephemeral: true })
                
                General.delete('ConfigGeral.Convites')
                SaldoInvitePainel(interaction, client)
            }


            if (interaction.customId == 'SaldoporInvite') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                interaction.editReply({ embeds: [], components: [], content: `💡 | Quanto receberá por invites?` })

                    .then(msg => {
                        const collectorFilter = response => {
                            return response.author.id === interaction.user.id;
                        };
                        interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
                            .then(collected => {
                                const receivedMessage = collected.first();
                                receivedMessage.delete()

                                if (!isNaN(receivedMessage.content)) {

                                    General.set('ConfigGeral.Convites.QuantoVaiGanharPorInvites', receivedMessage.content)
                                    SaldoInvitePainel(interaction, client)
                                } else {
                                    interaction.channel.send({ content: `❌ | Você adicionou um VALOR inválido` }).then(ddd => {
                                        setTimeout(async () => {
                                            try {
                                                await ddd.delete()
                                            } catch (error) {

                                            }
                                        }, 3000);
                                    })
                                    SaldoInvitePainel(interaction, client)
                                }


                            })
                    })


            }
            if (interaction.customId == 'QuantosInvitesParaGanharSaldo') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                interaction.editReply({ embeds: [], components: [], content: `💡 | A cada quantos invites ele vai receber o valor que foi colocado no outro button?` })

                    .then(msg => {
                        const collectorFilter = response => {
                            return response.author.id === interaction.user.id;
                        };
                        interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 300000, errors: ['time'] })
                            .then(collected => {
                                const receivedMessage = collected.first();
                                receivedMessage.delete()

                                if (!isNaN(receivedMessage.content)) {

                                    General.set('ConfigGeral.Convites.qtdinvitesresgatarsaldo', receivedMessage.content)
                                    SaldoInvitePainel(interaction, client)
                                } else {
                                    interaction.channel.send({ content: `❌ | Você adicionou um VALOR inválido` }).then(ddd => {
                                        setTimeout(async () => {
                                            try {
                                                await ddd.delete()
                                            } catch (error) {

                                            }
                                        }, 3000);
                                    })
                                    SaldoInvitePainel(interaction, client)
                                }


                            })
                    })


            }
            if (interaction.customId == 'AdicionarNaBlacklist') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                const select = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId('usersadd')
                            .setPlaceholder('Selecione qual membro deseja adicionar na Black-List.')
                            .setMaxValues(25)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdawdawdwadwd34343")
                            .setLabel('Voltar')
                            .setEmoji(`⬅️`)
                            .setStyle(2)
                            .setDisabled(false),
                    )

                interaction.editReply({ components: [select, row2] })

            }

            if (interaction.customId == 'awdawdawdwadwd34343') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                BlackListPainel(interaction, client)

            }

            if (interaction.customId == 'BlackListPainel') {
                await await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                BlackListPainel(interaction, client)
            }

            if (interaction.customId == 'StatusConvites') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                var d = General.get('ConfigGeral.Convites.Status')
                if (d == null) {
                    General.set('ConfigGeral.Convites.Status', true)
                } else {
                    General.set('ConfigGeral.Convites.Status', !General.get('ConfigGeral.Convites.Status'))
                }

                SaldoInvitePainel(interaction, client)
            }

            if (interaction.customId == 'awdkhawbdhaddwadwaouydwd') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                SaldoInvitePainel(interaction, client)
            }

            if (interaction.customId == 'CargoExpecificoConvite') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('roleexpecificoconvite')
                            .setPlaceholder('Selecione abaixo qual será o CARGO que terá Permissão.')
                            .setMaxValues(1)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdkhawbdhaddwadwaouydwd")
                            .setLabel('Voltar')
                            .setEmoji(`⬅️`)
                            .setStyle(2)
                            .setDisabled(false),
                    )

                interaction.editReply({ components: [select, row2] })
            }




            if (interaction.customId == 'SaldoInvitePainel') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                SaldoInvitePainel(interaction, client)
            }




            if (interaction.customId == 'changetextoduvidas') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('newnamebutton')
                    .setTitle(`💡 | Novo Titulo`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("Novo Nome do Button")
                    .setPlaceholder("Dê um título para o button.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }


            if (interaction.customId == 'changeemojiduvidas') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('newEmojiButton')
                    .setTitle(`⭐ | Novo Emoji`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('1')
                    .setLabel("Novo Emoji")
                    .setPlaceholder("Envie o novo emoji do botão")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'changechannelredirecionamento') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const select = new ActionRowBuilder()
                    .addComponents(
                        new ChannelSelectMenuBuilder()
                            .setCustomId('canalderedirecionamernto')
                            .setPlaceholder('Selecione abaixo qual será o CANAL de Redirecionamento.')
                            .setMaxValues(1)
                            .addChannelTypes(ChannelType.GuildText)
                    )

                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("awdkhawbdhwaouydwd")
                            .setLabel('Voltar')
                            .setEmoji(`⬅️`)
                            .setStyle(2)
                            .setDisabled(false),
                    )

                interaction.editReply({ components: [select, row2] })
            }


            if (interaction.customId == 'ButtonDuvidasPainel') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                ButtonDuvidasPainel(interaction, client)
            }

            if (interaction.customId == 'awdkhawbdhwaouydwd') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                ButtonDuvidasPainel(interaction, client)
            }



            if (interaction.customId == 'StatusDuvidas') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                var d = General.get(`ConfigGeral.statusduvidas`)
                if (d == null) {
                    General.set(`ConfigGeral.statusduvidas`, false)
                } else {
                    General.set(`ConfigGeral.statusduvidas`, !General.get(`ConfigGeral.statusduvidas`))
                }

                ButtonDuvidasPainel(interaction, client)

            }



            if (interaction.customId == 'desativarlogcarrinhos') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return
                var d = General.get(`ConfigGeral.statuslogcompras`)
                if (d == null) {
                    General.set(`ConfigGeral.statuslogcompras`, false)
                } else {
                    General.set(`ConfigGeral.statuslogcompras`, !General.get(`ConfigGeral.statuslogcompras`))
                }

                configchannels(interaction, interaction.user.id, client)

            }






            if (interaction.customId == 'addsaldo') {
                let modal = new ModalBuilder()
                    .setCustomId('modal2212121212121')
                    .setTitle('✏️ | Quantidade de Saldo');

                let desc = new TextInputBuilder()
                    .setCustomId('desccc')
                    .setLabel("Quanto de saldo você deseja adicionar?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const desc2 = new ActionRowBuilder().addComponents(desc);

                modal.addComponents(desc2);

                await interaction.showModal(modal);
            }



            if (interaction.customId.startsWith('moderacaosugerir')) {

                var u = sugerir.get(interaction.message.id)
                var userconfirm = ''
                var userreprova = ''
                for (let index = 0; index < u.aprova.length; index++) {
                    const element = u.aprova[index];
                    userconfirm += `<@${element}> - \`${element}\`\n`
                }
                for (let index = 0; index < u.reprova.length; index++) {
                    const element = u.reprova[index];
                    userreprova += `<@${element}> - \`${element}\`\n`
                }

                const embed = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Detalhes Sugestão`)
                    .setColor("Random")
                    .setDescription(`Usuários que aprovam (**${sugerir.get(`${interaction.message.id}.aprova`).length}**):\n\n${userconfirm == '' ? `Nenhum usuário votou` : userconfirm}\nUsuários que reprovam (**${sugerir.get(`${interaction.message.id}.reprova`).length}**):\n\n${userreprova == '' ? `Nenhum usuário votou` : userreprova}`)


                interaction.reply({ embeds: [embed], ephemeral: true })
            }

            if (interaction.customId.startsWith('sugerir-1')) {
                var u = sugerir.get(interaction.message.id)

                if (u.reprova.includes(interaction.user.id)) {
                    if (u.aprova.includes(interaction.user.id)) {
                        sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    }
                    sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    interaction.reply({ content: `✅ | Voto Retirado!`, ephemeral: true })

                    const Valor1 = sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1200629740420202686`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.editReply({ components: [row] })





                } else {
                    if (u.aprova.includes(interaction.user.id)) {
                        sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    }
                    sugerir.push(`${interaction.message.id}.reprova`, interaction.user.id)
                    interaction.reply({ content: `✅ | Obrigado por sugerir!`, ephemeral: true })

                    const Valor1 = sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1200629740420202686`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.editReply({ components: [row] })
                }
            }

            if (interaction.customId.startsWith('sugerir+1')) {
                var u = sugerir.get(interaction.message.id)

                if (u.aprova.includes(interaction.user.id)) {
                    if (u.reprova.includes(interaction.user.id)) {
                        sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    }


                    sugerir.pull(`${interaction.message.id}.aprova`, (element, index, array) => element == interaction.user.id)
                    interaction.reply({ content: `✅ | Voto Retirado!`, ephemeral: true })

                    const Valor1 = sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = sugerir.get(`${interaction.message.id}.reprova`).length + 1



                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1200629740420202686`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.editReply({ components: [row] })





                } else {
                    if (u.reprova.includes(interaction.user.id)) {
                        sugerir.pull(`${interaction.message.id}.reprova`, (element, index, array) => element == interaction.user.id)
                    }
                    sugerir.push(`${interaction.message.id}.aprova`, interaction.user.id)
                    interaction.reply({ content: `✅ | Obrigado por votar!`, ephemeral: true })

                    const Valor1 = sugerir.get(`${interaction.message.id}.aprova`).length + 1
                    const Valor2 = sugerir.get(`${interaction.message.id}.reprova`).length + 1

                    const soma = Valor1 + Valor2;
                    const porcentagem1 = (Valor1 / soma) * 100;
                    const porcentagem2 = (Valor2 / soma) * 100;


                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("sugerir+1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.aprova`).length + 1} - (${Number(porcentagem1).toFixed(0)}%)`)
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("sugerir-1")
                                .setLabel(`・ ${sugerir.get(`${interaction.message.id}.reprova`).length + 1} - (${Number(porcentagem2).toFixed(0)}%)`)
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("moderacaosugerir")
                                .setEmoji(`1200629740420202686`)
                                .setStyle(2)
                                .setDisabled(false),
                        )

                    interaction.editReply({ components: [row] })
                }
            }
        }







        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'sugestaoprodutos') {
                if (interaction.values[0] === 'SugerirEnviar') {
                    interaction.editReply()
                    const modalaAA = new ModalBuilder()
                        .setCustomId('sugestaoprodutos')
                        .setTitle(`💡 | Sugerir`);

                    const newnameboteN = new TextInputBuilder()
                        .setCustomId('1')
                        .setLabel("TÍTULO DA SUGESTÃO:")
                        .setPlaceholder("Dê um título para sua sugestão.")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                    const newnameboteN2 = new TextInputBuilder()
                        .setCustomId('2')
                        .setLabel("DESCRIÇÃO DA SUGESTÃO:")
                        .setPlaceholder("Descreva sua sugestão.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                    const newnameboteN3 = new TextInputBuilder()
                        .setCustomId('3')
                        .setLabel("CASO QUEIRA, COLOQUE UMA IMAGEM: (OPCIONAL)")
                        .setPlaceholder("Coloque o link da imagem aqui.")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)

                    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                    const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                    const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
                    modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                    await interaction.showModal(modalaAA);
                }




                if (interaction.values[0] === 'AvaliarEnviar') {
                    interaction.editReply()

                    const modalaAA = new ModalBuilder()
                        .setCustomId('avaliacaogerallll')
                        .setTitle(`💡 | Sugerir`);

                    const newnameboteN = new TextInputBuilder()
                        .setCustomId('1')
                        .setLabel("Quantas estrelas (1 a 5):")
                        .setPlaceholder("Exemplo: 3")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                    const newnameboteN2 = new TextInputBuilder()
                        .setCustomId('2')
                        .setLabel("Sua avaliação:")
                        .setPlaceholder("Descreva sua avaliação.")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)

                    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                    const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                    modalaAA.addComponents(firstActionRow3, firstActionRow4);
                    await interaction.showModal(modalaAA);

                }
            }
        }

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

        if (interaction.type == InteractionType.ModalSubmit) {
            var uu22 = db.table('permissionsmessage2')
            if (interaction.customId === 'StockFantasma') {

                const qtd = interaction.fields.getTextInputValue('1')
                const valor = interaction.fields.getTextInputValue('2')


                const t = await uu22.get(interaction.message.id)
                if (t.user !== interaction.user.id) return

                const novosValores = Array.from({ length: qtd }, () => valor);

       

                produtos.set(`${t.produto}_${interaction.guild.id}.settings.estoque`, novosValores);

                var ll = produtos.get(`${t.produto}_${interaction.guild.id}.settings.notify`)
                if (ll !== null) {
                    ll.forEach(async function (id) {
                        const member = await interaction.guild.members.fetch(id);
                        const embed = new EmbedBuilder()
                            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${client.user.username} - Notificações`)
                            .setThumbnail(`${client.user.displayAvatarURL()}`)
                            .setDescription(`${obterEmoji(27)} | O estoque do produto **${t.produto}**, foi reabastecido com \`${qtd}\` itens.\n${obterEmoji(12)}| O produto se encontra no canal <#${produtos.get(`${t.produto}_${interaction.guild.id}.ChannelID`)}>`)
                        try {
                            await member.send({ embeds: [embed] })
                        } catch (error) {

                        }
                    });
                    produtos.delete(`${t.produto}_${interaction.guild.id}.settings.notify`)
                }


                interaction.reply({ content: `${obterEmoji(8)} | Foram adicionados ${qtd} Produtos`, ephemeral: true }).then(msg => {
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


            }






            if (interaction.customId === 'configurarporcentagemcashback') {
                await interaction.deferUpdate()
                const codigo = interaction.fields.getTextInputValue('configurarporcentagemcashback')
                if (isNaN(codigo)) return interaction.reply({ content: `Você inseriu um VALOR inválido para adicionar em sua porcnetagem do cash-back.`, ephemeral: true })

                General.set(`ConfigGeral.CashBack.Porcentagem`, codigo)
                interaction.followUp({ content: `${obterEmoji(8)} | você alterou a porcentagem de seu cash-back para \`${codigo}%\``, ephemeral: true })
                ConfigCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'avaliar') {
                await interaction.deferUpdate()
                avaliacao(interaction, interaction.message.id, interaction.channel.id, client, interaction.user.id)
            }
            if (interaction.customId === 'criar-drop-modal') {
                const codigo = interaction.fields.getTextInputValue('codigo-drop')
                const premio = interaction.fields.getTextInputValue('premio-drop')

                var u = drops.get(codigo)

                if (u !== null) interaction.reply({ cointent: `Código já existente nesse servidor.`, ephemeral: true })

                drops.set(codigo, { premio: premio, usercreate: interaction.user.id })

                const embed = new EmbedBuilder()
                    .setTitle('Drop criado!')
                    .setDescription(`Você acabou de criar um drop, para alguem resgatar só utilizar o comando \`/pegardrop\` e inserir o código: \`${codigo}\``)
                    .addFields(
                        { name: `${obterEmoji(11)} | Código:`, value: `${codigo}` },
                        { name: `${obterEmoji(6)} | O QUE SERÁ ENTREGUE:`, value: `${premio}` }
                    )
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }

        if (interaction.isButton()) {

            if (interaction.customId.startsWith('resetperfilestatisticas')) {
                estatisticasgeral.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | As estatisticas foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetRankCompradores')) {
                usuariosinfo.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | O Rank de compradores foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetRankProdutos')) {
                estatisticas.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | O Rank de produtos foram resetadas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetCupons')) {
                Cupom.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Cupons foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetGiftCards')) {
                giftcards.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Gifts Cards foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetKeys')) {
                Keys.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | As Keys foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetDrops')) {
                drops.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os Drops foram resetados`, ephemeral: true })
            }

            if (interaction.customId.startsWith('ResetProdutos')) {
                var a = produtos.fetchAll()
                var b = PainelVendas.fetchAll()

                for (var i = 0; i < a.length; i++) {
                    var obj = a[i];
                    var ID = obj.data.ID;
                    var dd = produtos.get(`${ID}_${interaction.guild.id}`)
                    try {
                        const channel = await client.channels.fetch(dd.ChannelID);
                        const fetchedMessage = await channel.messages.fetch(dd.MessageID);
                        fetchedMessage.delete()
                    } catch (error) {

                    }
                }

                for (let bbbb = 0; bbbb < b.length; bbbb++) {
                    const element = b[bbbb];
                    try {
                        const channel = await client.channels.fetch(element.data.ChannelID);
                        const fetchedMessage = await channel.messages.fetch(element.data.MessageID);
                        fetchedMessage.delete()
                    } catch (error) {

                    }

                }

                produtos.deleteAll()
                PainelVendas.deleteAll()
                interaction.reply({ content: `${obterEmoji(8)} | Os produtos e paineis foram resetados`, ephemeral: true })

            }




            if (interaction.customId.startsWith('cashtoggle')) {
                await interaction.deferUpdate()
                UpdateCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId.startsWith('configurarporcentagemcashback')) {
                var uudd = db.table('permissionsmessage')
                var t132435445421 = await uudd.get(interaction.message.id)
                if (interaction.user.id !== t132435445421) return await interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('configurarporcentagemcashback')
                    .setTitle(`Nova porcentagem`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('configurarporcentagemcashback')
                    .setLabel("Nova porcentagem do cash-back:")
                    .setPlaceholder("Exemplo: 22")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }




            if (interaction.customId.startsWith('ReembolsarCompra')) {


                const modal = new ModalBuilder()
                    .setCustomId('confirm-reembolso')
                    .setTitle(`Confirmar Reembolso`)

                const pergunta01 = new TextInputBuilder()
                    .setCustomId('yesorno')
                    .setLabel('Deseja realizar o reembolso dessa compra?')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Digite SIM caso queira reembolsar')
                    .setRequired(true)

                const p1 = new ActionRowBuilder().addComponents(pergunta01)

                modal.addComponents(p1)

                await interaction.showModal(modal);





            }
            if (interaction.customId.startsWith('222coma22ndosliv333reuso')) {
                await interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Comandos Liberados Para todos os Usuários`)
                    .addFields(
                        {
                            name: `${obterEmoji(1)} /help`,
                            value: `\`Exibe essa mensagem.\``
                        },
                        {
                            name: `${obterEmoji(1)} /perfil`,
                            value: `\`Mostra o perfil de quem enviou o comando.\``
                        },
                        {
                            name: `${obterEmoji(1)} /rank`,
                            value: `\`Mostra o rank de pessoas que mais compraram.\``
                        },
                        {
                            name: `${obterEmoji(1)} /adicionarsaldo`,
                            value: `\`Adiciona saldo via pix.\``
                        },
                        {
                            name: `${obterEmoji(1)} /ativarkey`,
                            value: `\`Resgata uma key.\``
                        },
                        {
                            name: `${obterEmoji(1)} /resgatargift`,
                            value: `\`Resgata um gift.\``
                        },
                        {
                            name: `${obterEmoji(1)} /pegardrop \`CÓDIGO\``,
                            value: `\`Pega um drop.\``
                        },
                        {
                            name: `${obterEmoji(1)} /cleardm`,
                            value: `\`Apagar as mensagens do bot da sua dm.\``
                        },
                        {
                            name: `${obterEmoji(1)} /info \`ID DA COMPRA\``,
                            value: `\`Mostra informações da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
                        },
                        {
                            name: `${obterEmoji(1)} /pegar \`ID DA COMPRA\``,
                            value: `\`Mostra o Produto que foi Entregue da compra que você colocou o ID.(Liberado apenas para quem comprou e para os Adm)\``
                        }
                    )
                    .setFooter({ text: `Página 1/2`, iconURL: `${client.user.displayAvatarURL()}` })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("wdgjujujcojujmandosuajujujudmhelp")
                            .setLabel('Comandos Adm')
                            .setEmoji(`1219812472177954898`)
                            .setStyle(1)
                            .setDisabled(false),
                    )

                interaction.editReply({ embeds: [embed], components: [row] }).then(async u => {
                    createCollector(u)
                })
            }

            if (interaction.customId.startsWith('wdgjujujcojujmandosuajujujudmhelp')) {
                await interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Comandos Liberados Para todos os Usuários`)
                    .setFooter({ text: `Página 2/2`, iconURL: `${client.user.displayAvatarURL()}` })
                    .setDescription(`**${obterEmoji(1)} /botconfig**\n\`Configura o bot e os canais.\`\n\n**${obterEmoji(1)} /administrarsaldo**\n\`Administra o saldo de um usuário, podendo adicionar ou remover saldo.\`\n\n**${obterEmoji(1)} /criar**\n\`Cria um produto para venda.\`\n\n**${obterEmoji(1)} /config**\n**\`Configura o produto selecionado.\`**\n\n**${obterEmoji(1)} /criardrop**\n**\`Cria um drop.\`**`)
                    .addFields(

                        {
                            name: `${obterEmoji(1)} /gerarpix`,
                            value: `\`Cria uma cobrança com o valor selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /set`,
                            value: `\`Seta a mensagem de compra do produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /stockid`,
                            value: `\`Mostra o estoque do produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /del`,
                            value: `\`Deleta o produto selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criarcupom`,
                            value: `\`Cria um Cupom de Desconto.\``
                        },
                        {
                            name: `${obterEmoji(1)} /configcupom`,
                            value: `\`Configura o Cupom selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criargift`,
                            value: `\`Cria um código que ao ser resgatado, o usuário ganhará o saldo selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criados`,
                            value: `\`Mostra todos os produtos, cupons, keys, etc. cadastrados no bot.\``
                        },
                        {
                            name: `${obterEmoji(1)} /criarkey \`@cargo\``,
                            value: `\`Cria uma key, ao ser resgatada o usuário receberá o cargo selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /delkey \`key\``,
                            value: `\`Deleta uma key.\``
                        },
                        {
                            name: `${obterEmoji(1)} /entregar`,
                            value: `\`Entrega o produto selecionado para um usuário.\``
                        },
                        {
                            name: `${obterEmoji(1)} /estatisticas`,
                            value: `\`Mostra as estatisticas de vendas do bot.\``
                        },
                        {
                            name: `${obterEmoji(1)} /permadd`,
                            value: `\`Concede a permissão de usar o bot para um usuário.\``
                        },
                        {
                            name: `${obterEmoji(1)} /permremove`,
                            value: `\`Remove a permissão de um usuário\``
                        },
                        {
                            name: `${obterEmoji(1)} /permlista`,
                            value: `\`Ver todos os usuários que tem permissão\``
                        },
                        {
                            name: `${obterEmoji(1)} /personalizar`,
                            value: `\`Personalize uma embed\``
                        },
                        {
                            name: `${obterEmoji(1)} /rankadm`,
                            value: `\`Mostra o rank de pessoas que mais compraram com o valor gasto.\``
                        },
                        {
                            name: `${obterEmoji(1)} /rankprodutos`,
                            value: `\`Mostra os produtos que mais geraram lucro.\``
                        },
                        {
                            name: `${obterEmoji(1)} /reembolsar`,
                            value: `\`Reembolsa de forma automática o pagamento selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /resetar`,
                            value: `\`Reseta as vendas, o rank, cupons, etc.\``
                        },
                        {
                            name: `${obterEmoji(1)} /status`,
                            value: `\`Verifica o Status da Compra selecionada.\``
                        },
                        {
                            name: `${obterEmoji(1)} /conectar`,
                            value: `\`Faz o bot entrar no canal de voz selecionado.\``
                        },
                        {
                            name: `${obterEmoji(1)} /anunciar`,
                            value: `\`Faz o bot enviar um anuncio.\``
                        },
                        {
                            name: `${obterEmoji(1)} /say`,
                            value: `\`Faz o bot falar.\``
                        },
                        {
                            name: `${obterEmoji(1)} /dm`,
                            value: `\`Faz o bot mandar uma mensagem no privado do membro selecionado.\``
                        }
                    )




                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("222coma22ndosliv333reuso")
                            .setLabel('Comandos de Livre uso.')
                            .setEmoji(`1219812472177954898`)
                            .setStyle(3)
                            .setDisabled(false),
                    )
                interaction.editReply({ embeds: [embed], components: [row] }).then(async u => {
                    createCollector(u)
                })
            }


            if (interaction.customId.startsWith('cancelgeneratepix')) {
                interaction.message.delete()
            }

            if (interaction.customId.startsWith('pixcdawdwadawdwdopiawdwawdwadecola182381371')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)

                interaction.reply({ content: `${tttttt.pixcopiaecola}`, ephemeral: true })
            }
            if (interaction.customId.startsWith('qwadawrcode18281wadawdwadwa2981')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)
                const buffer = Buffer.from(tttttt.qrcode, "base64");
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });
                interaction.reply({ files: [attachment], ephemeral: true })
            }

            if (interaction.customId.startsWith('verificarpagam032')) {
                var uu182723937247347934978398 = db.table('messagepixgerar')
                var tttttt = await uu182723937247347934978398.get(interaction.message.id)
                interaction.reply({ content: `${obterEmoji(10)} | Verificando pagamento....`, ephemeral: true })
                var res = await axios.get(`https://api.mercadopago.com/v1/payments/${tttttt.id}`, {
                    headers: {
                        Authorization: `Bearer ${General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
                    }
                })

                if (res.data.status == 'approved') { // approved ou approved

                    interaction.editReply({ content: `${obterEmoji(8)} | O Pagamento foi aprovado.`, embeds: [], components: [] })
                    interaction.editReply({ content: `${obterEmoji(8)} | O Pagamento foi aprovado.`, ephemeral: true })

                } else {
                    interaction.editReply({ content: `${obterEmoji(10)} | Aguardando o Pagamento!`, ephemeral: true })

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
                                .setCustomId("verificarpagam032")
                                .setLabel('Verificar o Pagamento')
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(true),
                            new ButtonBuilder()
                                .setCustomId("cancelgeneratepix")
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false),)


                    interaction.editReply({ components: [row] })

                    setTimeout(() => {
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
                                    .setDisabled(false),)


                        interaction.editReply({ components: [row] })
                    }, 10000);
                }
            }

            if (interaction.customId.startsWith('1avaliar') || interaction.customId.startsWith('2avaliar') || interaction.customId.startsWith('3avaliar') || interaction.customId.startsWith('4avaliar') || interaction.customId.startsWith('5avaliar')) {
                var aaa = interaction.customId
                var resultado = aaa.replace(/avaliar/, "");

                function transformarEmEstrelas(numero) {
                    return '\u2B50'.repeat(numero);
                }

                uud.set(`${interaction.message.id}.resultado`, resultado)

                setTimeout(async () => {
                    try {
                        await avaliacao(interaction, interaction.message.id, interaction.channel.id, client, interaction.user.id)
                    } catch (error) {

                    }
                }, 120000);

                const modala = new ModalBuilder()
                    .setCustomId('avaliar')
                    .setTitle(`⭐ | Avaliar`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('avaliar')
                    .setLabel(`AVALIAÇÃO - ${transformarEmEstrelas(resultado)} (${resultado})`)
                    .setPlaceholder("Escreva uma breve avaliação aqui.")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                // Verifique se a interação já foi respondida antes de chamar `showModal()`
                if (!interaction.deferred) {
                    await interaction.showModal(modala);
                }
            }

        }
    }
}

async function realizarReembolso(preferenceId, interaction, id, editsql, IdCompra2, valortotal) {
    try {
        interaction.reply({ content: `${obterEmoji(10)} | Reembolsando`, ephemeral: true })
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/search?external_reference=${preferenceId}`, {
            headers: {
                'Authorization': `Bearer ${General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`
            }
        });
        const paymentStatus = response.data.results[0].status;
        if (paymentStatus !== 'approved' && paymentStatus !== 'authorized') {
            interaction.editReply({ content: `${obterEmoji(22)} | O pagamento não está elegível para reembolso.`, ephemeral: true })
            return;
        }
        const paymentId = response.data.results[0].id;
        const refundResponse = await axios.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {}, {
            headers: {
                'Authorization': `Bearer ${General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`)}`
            }
        });

        StatusCompras.set(`${editsql}.Status`, 'Reembolsado')
        interaction.editReply(`${obterEmoji(8)} | Reembolso aprovado\n${obterEmoji(7)} | ID do Pagamento: ${IdCompra2}\n${obterEmoji(14)} | Valor Reembolsado: R$${valortotal}`)


    } catch (error) {
        interaction.editReply({ content: `${obterEmoji(22)} | Ocorreu um erro ao realizar o reembolso: ${error.message}` });
    }
}