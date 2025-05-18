const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Role } = require("discord.js");
const { Pagamentos, StatusCompras, produtos, Carrinho, AccountAllBuys, RoleTime, DefaultMessages, General, PainelVendas, estatisticas, usuariosinfo, estatisticasgeral, PagamentosSaldos } = require("../databases");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { atualizarmensagempainel } = require("./PainelSettingsAndCreate");
const { obterEmoji } = require("../Handler/EmojiFunctions");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uud = db.table('avaliarrrrr')

const nomeAmigavel = {
    'Nu Pagamentos S.A.': 'nu',
    'Mercadopago.com Representações Ltda.': 'mp',
    'Banco do Brasil S.A.': 'bdb',
    'Caixa Econômica Federal': 'caixa',
    'Banco Itaú Unibanco S.A.': 'itau',
    'Banco Bradesco S.A.': 'bradesco',
    'Banco Inter S.A.': 'inter',
    'Neon Pagamentos S.A.': 'neon',
    'Original S.A.': 'original',
    'Next': 'next',
    'Agibank': 'agibank',
    'Santander (Brasil) S.A.': 'santander',
    'C6 Bank S.A.': 'c6',
    'Banrisul': 'banrisul',
    'PagSeguro Internet S.A.': 'pagseguro',
    'BS2': 'bs2',
    'Modalmais': 'modalmais',
    'Picpay Serviços S.A.': 'picpay'
};

async function EntregarProdutos(client) {
    var status = StatusCompras.fetchAll()
    for (let i = 0; i < status.length; i++) {
        const PaymentName = status[i].ID
        const Status = status[i].data.Status
        const GuildServerID = status[i].data.GuildServerID
        const user = status[i].data.user
        const ID = status[i].data.ID
        const ID2 = status[i]
        const IdCompra = status[i].data.IdCompra
        const Metodo = status[i].data.Metodo

        if (Status == "Aprovado") {
            StatusCompras.set(`${PaymentName}.Status`, 'Entregue')
            var tbbb = Carrinho.get(`${ID}`)

            const channel222 = await client.channels.fetch(tbbb.ChannelID).catch()
            await channel222.messages.fetch().then(async (messages) => {
                try {
                    await channel222.bulkDelete(messages)
                } catch (error) {

                }

            })

            var t = Carrinho.get(`${ID}.produtos`)

            var produtosname = []
            var logmessage1 = ''
            var logmessage2 = ''
            var logmessage3 = ''
            var logmessage4 = ''

            for (let i = 0; i < t.length; i++) {
                for (let key in t[i]) {
                    produtosname.push({
                        Name: key,
                        Qtd: t[i][key].qtd,
                    });

                    

                    logmessage1 += `${produtos.get(`${key}_${GuildServerID}.settings.name`)} x${t[i][key].qtd}`
                    logmessage2 += produtos.get(`${key}_${GuildServerID}.settings.name`)
                    logmessage3 += produtos.get(`${key}_${GuildServerID}.ID`)
                    logmessage4 += `${produtos.get(`${key}_${GuildServerID}.settings.name`)} - ${t[i][key].qtd}\n`

                    var valor = Number(produtos.get(`${key}_${GuildServerID}.settings.price`)) * Number(t[i][key].qtd)

                    var get = 0
                    var get2 = 0
                    if (estatisticas.get(`${key}_${GuildServerID}.TotalPrice`) !== null) {
                        get = Number(estatisticas.get(`${key}_${GuildServerID}.TotalPrice`))
                    }
                    if (estatisticas.get(`${key}_${GuildServerID}.TotalQtd`) !== null) {
                        get2 = Number(estatisticas.get(`${key}_${GuildServerID}.TotalQtd`))
                    }

                    estatisticas.set(`${key}_${GuildServerID}.TotalQtd`, Number(get2) + Number(t[i][key].qtd))
                    estatisticas.set(`${key}_${GuildServerID}.TotalPrice`, Number(get) + Number(valor))

                    if (i < t.length - 1) {
                        logmessage2 += ', ';
                        logmessage3 += ', ';
                        logmessage1 += ', ';
                    }

                }
            }

            StatusCompras.set(`${PaymentName}.ProdutosComprados`, logmessage4)
            

            var ppppopopooopo = ''
            var finalproduto = ''
            var finalproduto2 = ''
            var qtddd = 0
            for (var ie = 0; ie < produtosname.length; ie++) {


                qtddd = qtddd+produtosname[ie].Qtd
                for (var j = 0; j < produtosname[ie].Qtd; j++) {

                    var produto = produtos.get(`${produtosname[ie].Name}_${GuildServerID}.settings.estoque`)[0]

                    produtos.pull(`${produtosname[ie].Name}_${GuildServerID}.settings.estoque`, (element, index, array) => index == 0)

                    var produto2 = produto
                    if (produto2 == undefined) produto2 = '\`Estoque desse produto esgotou - Contate um STAFF\`'
                    finalproduto += `${obterEmoji(12)} | Entrega do Produto: ${produtosname[ie].Name} - ${j + 1}/${produtosname[ie].Qtd}\n${produto2}\n\n`
                    finalproduto2 += `${produto2}\n`
                    
                }

                var oooo = produtos.get(`${produtosname[ie].Name}_${GuildServerID}.embedconfig.cargo.name`)
                var temporole = produtos.get(`${produtosname[ie].Name}_${GuildServerID}.embedconfig.cargo.tempo`)

                if (oooo !== null) {
                    await client.guilds.cache.get(GuildServerID).members.fetch(user).then(member => member.roles.add(oooo)).catch(console.error);

                    const currentTime = new Date();
                    const timestamp2 = currentTime.getTime();
                    var dkçnajbyoa = temporole * produtosname[ie].Qtd
                    const timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000;
                    bfuu = timestamp2 + timestamp

                    if (temporole !== null) {
                        var gg = RoleTime.get(user)
                        if (gg && gg.length) {
                            for (let i = 0; i < gg.length; i++) {
                                if (RoleTime.get(`${user}[${i}].role`) == oooo)
                                    RoleTime.set(`${user}[${i}].timestamp`, RoleTime.get(`${user}[${i}].timestamp`) + timestamp);
                                else
                                    await RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: produtos.get(`${produtosname[ie].Name}_${GuildServerID}.settings.name`) });
                            }
                        } else {
                            await RoleTime.push(user, { role: oooo, user, timestamp: bfuu, guildid: GuildServerID, produto: produtos.get(`${produtosname[ie].Name}_${GuildServerID}.settings.name`) });
                        }
                    }


                    if (gg && gg.length) {
                        for (let i = 0; i < gg.length; i++) {
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                            let timestamp2 = Math.floor(RoleTime.get(`${user}[${i}].timestamp`) / 1000);
                            if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n` : '';
                            else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                        }
                    } else {
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Permanente\n`) && temporole === null) ppppopopooopo += `<@&${oooo}> - Permanente\n`;
                        const currentTime = new Date(), timestamp2 = currentTime.getTime(), dkçnajbyoa = temporole * produtosname[ie].Qtd, timestamp = dkçnajbyoa * 24 * 60 * 60 * 1000, bfuu = timestamp2 + timestamp, timestamp22 = Math.floor(bfuu / 1000);
                        if (!ppppopopooopo.includes(`<@&${oooo}> - Expira em:`)) temporole !== null ? ppppopopooopo += `<@&${oooo}> - Expira em: <t:${timestamp22}:R>\n` : '';
                        else if (temporole !== null) ppppopopooopo = ppppopopooopo.replace(new RegExp(`<@&${oooo}> - Expira em:.+`, 'g'), `<@&${oooo}> - Expira em: <t:${timestamp2}:R>\n`);
                    }



                }

                var fsfs = produtos.get(`${produtosname[ie].Name}_${GuildServerID}.settings.estoque`)
                var fsfs2222 = produtos.get(`${produtosname[ie].Name}_${GuildServerID}.settings.name`)

                if (fsfs.length == 0) {
                    const channela = await client.channels.fetch(General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

                    try {
                        await channela.send({ content: `Acabou o stock do produto de id: **${produtosname[ie].Name}** Nome: **${fsfs2222}**` })
                    } catch (error) {

                    }
                }



            }

            var kkkkkkk = PainelVendas.fetchAll()
            const channel = await client.channels.fetch(tbbb.ChannelID).catch()

            for (var bg = produtosname.length - 1; bg >= 0; bg--) {
                var produto = produtosname[bg].Name;
                try {
                    for (const item of kkkkkkk) {
                        for (const p of item.data.produtos) {
                            if (p === produto) {
                                await atualizarmensagempainel(tbbb.GuildServerID, item.ID, client);
                            }
                        }
                    }
                } catch (error) { }
                atualizarmessageprodutosone2(client, produto, tbbb.GuildServerID);
            }




            const member = await client.guilds.cache.get(tbbb.GuildServerID).members.fetch(user);
            if (General.get('ConfigGeral.ChannelsConfig.CargoCliente') !== null) {
                try {
                    await member.roles.add(General.get('ConfigGeral.ChannelsConfig.CargoCliente'));
                } catch (error) {
                    // Tratamento de erro
                }
            }
            var fileName
            var fileBuffer2
            var produtoentregarfinal
            if (finalproduto.length >= 500) {
                fileName = `entrega_produtos.txt`;
                fileBuffer2 = Buffer.from(finalproduto2, 'utf-8');
                produtoentregarfinal = `Seus produtos não cabem aqui!! olhe no TXT abaixo.`
            } else {
                produtoentregarfinal = finalproduto
            }
            StatusCompras.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2));
            const embedlogsucess = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${client.user.username} | Compra aprovada`)
                .addFields(
                    { name: `${obterEmoji(23)} **| ID PEDIDO:**`, value: `${IdCompra}` },
                    { name: `${obterEmoji(13)} **| COMPRADOR:**`, value: `${member.user} | ${member.user.username}` },
                    { name: `${obterEmoji(32)} **| ID COMPRADOR:**`, value: `\`${member.user.id}\`` },
                    { name: `${obterEmoji(17)} **| DATA:**`, value: `<t:${Math.ceil(Date.now() / 1000)}> (<t:${Math.ceil(Date.now() / 1000)}:R>)` },
                    { name: `${obterEmoji(32)} **| PRODUTO(S) ID(S):**`, value: `\`${logmessage3}\`` },
                    { name: `${obterEmoji(12)} **| PRODUTO(S) NOME(S):**`, value: `\`${logmessage1}\`` },
                    { name: `${obterEmoji(14)} **| VALOR PAGO:**`, value: `\`R$${Number(tbbb.totalpicecar).toFixed(2)}\`` },
                    { name: `${obterEmoji(15)} **| MÉTODO DE PAGAMENTO:**`, value: `${Metodo == undefined ? 'Saldo' : Metodo}` },
                    { name: `${obterEmoji(4)} **| CUPOM UTILIZADO:**`, value: `${tbbb.cupomaplicado == null ? '\`NENHUM CUPOM USADO!\`' : `\`${tbbb.cupomaplicado}\``}` },
                    { name: `${obterEmoji(16)} **| VALOR DO DESCONTO:**`, value: `${tbbb.valordodesconto == null ? '\`R$0\`' : `\`R$${Number(tbbb.valordodesconto)}\``}` },
                    { name: `${obterEmoji(33)} **| PRODUTO ENTREGUE:**`, value: `\`\`\`${produtoentregarfinal}\`\`\`` }
                )
                .setFooter({ text: `${client.user.username} Todos os direitos reservados.` });

            const row222 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('ReembolsarCompra')
                        .setLabel('Reembolsar')
                        .setEmoji('1190299502377173025')
                        .setStyle(2)
                        .setDisabled(false)
                );

            const channela = await client.channels.fetch(General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));

            try {
                if (finalproduto.length >= 500) {
                    await channela.send({
                        embeds: [embedlogsucess], components: [row222], content: `${member.user}`, files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    }).then(msg => {
                        StatusCompras.set(`${PaymentName}.IDMessageLogs`, msg.id);
                        StatusCompras.set(`${PaymentName}.IDChannelLogs`, msg.channel.id);
                        StatusCompras.set(`${PaymentName}.produtosentregue`, finalproduto);
                    });
                } else {
                    await channela.send({ embeds: [embedlogsucess], components: [row222], content: `${member.user}` }).then(msg => {
                        StatusCompras.set(`${PaymentName}.IDMessageLogs`, msg.id);
                        StatusCompras.set(`${PaymentName}.IDChannelLogs`, msg.channel.id);
                        StatusCompras.set(`${PaymentName}.produtosentregue`, finalproduto);
                        
                    });
                }
            } catch (error) {
                // Tratamento de erro
            }







            const embed = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${obterEmoji(6)} ${client.user.username} | Compra aprovada ${obterEmoji(6)}`)
                .addFields(
                    { name: `${obterEmoji(12)} **| Produto(s) Comprado(s):**`, value: `${tbbb.messagepagamento}` },
                    { name: `${obterEmoji(24)} **| Id da Compra:**`, value: `${IdCompra}` },
                    { name: `**❤️ | Muito obrigado por comprar conosco,**`, value: `**${client.user.username} agradece a sua preferência**` }
                )
                .setFooter({
                    text: `Seu(s) Produto(s):`
                });


            if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                embed.setImage(General.get(`ConfigGeral.BannerEmbeds`))
            }
            if (General.get(`ConfigGeral.MiniaturaEmbeds`) !== undefined) {
                embed.setThumbnail(General.get(`ConfigGeral.MiniaturaEmbeds`))
            }

            const embedppppp = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`❤️ ${client.user.username} | Faça uma Avaliação ❤️`)
                .setDescription(`**Caso queira, escolha uma nota para a venda:**`)


            const row2222 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('1avaliar')
                        .setLabel('1')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('2avaliar')
                        .setLabel('2')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('3avaliar')
                        .setLabel('3')
                        .setEmoji('⭐')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('4avaliar')
                        .setEmoji('⭐')
                        .setLabel('4')
                        .setStyle(2)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setCustomId('5avaliar')
                        .setEmoji('⭐')
                        .setLabel('5')
                        .setStyle(2)
                        .setDisabled(false))

            try { await channel.send(`${obterEmoji(8)} | Pagamento Aprovado\n${obterEmoji(9)} | Id da Compra: ${IdCompra}`) } catch (error) { }

            if (General.get(`ConfigGeral.CashBack.ToggleCashBack`) == "ON") {

                var yui = Number(tbbb.totalpicecar)
                const porcentagem = General.get(`ConfigGeral.CashBack.Porcentagem`);
                var yty = (yui * porcentagem) / 100;
                if (PagamentosSaldos.get(`${user}.SaldoAccount`) == null) {
                    PagamentosSaldos.set(`${user}.SaldoAccount`, Number(yty))
                } else {

                    PagamentosSaldos.set(`${user}.SaldoAccount`, Number(PagamentosSaldos.get(`${user}.SaldoAccount`)) + Number(yty))
                }
                try { await channel.send(`${obterEmoji(4)} | Parabéns o sistema de CASHBACK do servidor está ligado!\n\n💥 | Você recebeu \`${General.get(`ConfigGeral.CashBack.Porcentagem`)}%\` do valor da compra de volta em **SALDO**\n\n${obterEmoji(4)} | Valor recebido ${Number(yty).toFixed(2)}`) } catch (error) { }
            }




            if (usuariosinfo.get(`${user}.qtdprodutos`) !== null && usuariosinfo.get(`${user}.qtdprodutos`) !== undefined) {
                usuariosinfo.set(`${user}.qtdprodutos`, Number(usuariosinfo.get(`${user}.qtdprodutos`)) + 1)
            } else {
                usuariosinfo.set(`${user}.qtdprodutos`, 1)
            }

            if (usuariosinfo.get(`${user}.gastos`) !== null && usuariosinfo.get(`${user}.gastos`) !== undefined) {
                usuariosinfo.set(`${user}.gastos`, Number(usuariosinfo.get(`${user}.gastos`)) + Number(tbbb.totalpicecar))
            } else {
                usuariosinfo.set(`${user}.gastos`, Number(tbbb.totalpicecar))
            }



            const today = new Date();
            estatisticasgeral.set(`${PaymentName}.Status`, 'Entregue')
            estatisticasgeral.set(`${PaymentName}.Data`, today)
            estatisticasgeral.set(`${PaymentName}.valortotal`, Number(tbbb.totalpicecar).toFixed(2))
            estatisticasgeral.set(`${PaymentName}.produtos`, qtddd)

            try {
                await member.send({ embeds: [embed] }).then(async (msg222) => {
                    if (finalproduto.length >= 500) {
                        const embed2 = new EmbedBuilder()
                            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${obterEmoji(6)} ${client.user.username} | Pagamento Aprovado ${obterEmoji(6)}`)
                            .setDescription(`<@${user}> **Pagamento aprovado verifique sua Dm**\n__Este canal será apagado após 1 minuto__`)

                        const row = new ActionRowBuilder()
                        row.addComponents(
                            new ButtonBuilder()
                                .setURL(msg222.url)
                                .setLabel('Atalho Para DM')
                                .setStyle(5)
                                .setDisabled(false))

                        await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    await channel.delete()
                                } catch (error) {

                                }
                            }, 60000);
                        });

                        await member.send({
                            files: [{
                                attachment: fileBuffer2,
                                name: fileName
                            }]
                        })

                        member.send({
                            embeds: [embedppppp],
                            components: [row2222]
                        }).then(ppppp => {

                            uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })

                            setTimeout(async () => {
                                var null2 = null
                                avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                            }, 300000);
                        })

                    } else {
                        member.send({ content: finalproduto }).then(async msg => {

                            const embed2 = new EmbedBuilder()
                                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                                .setTitle(`${obterEmoji(6)} ${client.user.username} | Pagamento Aprovado ${obterEmoji(6)}`)
                                .setDescription(`<@${user}> **Pagamento aprovado verifique sua Dm**\n__Este canal será apagado após 1 minuto__`)

                            if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                                embed2.setImage(General.get(`ConfigGeral.BannerEmbeds`))
                            }

                            const row = new ActionRowBuilder()
                            row.addComponents(
                                new ButtonBuilder()
                                    .setURL(msg.url)
                                    .setLabel('Atalho Para DM')
                                    .setStyle(5)
                                    .setDisabled(false))

                            await channel.send({ embeds: [embed2], components: [row] }).then(msg => {
                                setTimeout(async () => {
                                    try {
                                        await channel.delete()
                                    } catch (error) {

                                    }
                                }, 60000);
                            });


                            member.send({
                                embeds: [embedppppp],
                                components: [row2222]
                            }).then(ppppp => {

                                uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })

                                setTimeout(async () => {
                                    var null2 = null
                                    avaliacao(null2, ppppp.id, ppppp.channel.id, client, user)

                                }, 300000);
                            })


                        })
                    }
                })
            } catch (error) {
                const embed2 = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${obterEmoji(6)} ${client.user.username} | Pagamento Aprovado ${obterEmoji(6)}`)
                    .setDescription(`<@${user}> **Pagamento aprovado como seu privado está fechado enviei aqui.**\n__Este canal será apagado após 1 minuto__`)

                if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
                    embed2.setThumbnail(General.get(`ConfigGeral.BannerEmbeds`))
                }


                if (finalproduto.length >= 500) {
                    await channela.send({
                        embeds: [embed2], files: [{
                            attachment: fileBuffer2,
                            name: fileName
                        }]
                    })
                } else {
                    await channel.send({ embeds: [embed2] }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await channel.delete()
                            } catch (error) {

                            }
                        }, 60000);
                    });

                    try {
                        await channel.send({ content: finalproduto })
                    } catch (error) {

                    }
                }



                try {
                    await channel.send({
                        embeds: [embedppppp],
                        components: [row2222]
                    }).then(async ppppp => {
                        uud.set(ppppp.id, { message: tbbb.messagepagamento2, valorpago: tbbb.totalpicecar, valordodesconto: tbbb.valordodesconto, guildid: tbbb.GuildServerID })
                        setTimeout(async () => {
                            var null2 = null
                            avaliacao(null2, ppppp.id, General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`), client, user, GuildServerID)

                        }, 300000);
                    })
                } catch (error) {

                }
            }

            try { if (ppppopopooopo !== '') await channel.send({ content: `${obterEmoji(8)} | Cargos setados:\n${ppppopopooopo}` }); } catch (error) { }

        }
    }
}













async function verificarpagamento(client) {

    var type = Pagamentos.fetchAll()
    for (let i = 0; i < type.length; i++) {
        const PaymentName = type[i].data.ID;
        const PaymentName22 = type[i].ID;
        const typeValue = type[i].data.Type;
        const PaymentId = type[i].data.PaymentId;
        const IdServer = type[i].data.IdServer;
        const IdServer2 = type[i].data.IdServer2;
        const BodyCompra = type[i].data.BodyCompra;
        const canalidd = type[i].data.CanalID;
        const user = type[i].data.user;

        let channel = await client.channels.cache.get(canalidd)
        if (!channel) {
            Pagamentos.delete(PaymentName22)
            StatusCompras.set(`${BodyCompra}.Status`, 'Cancelado')
        }

        if (typeValue == 'site') {
            const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${PaymentId}`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${IdServer}`
            };

            axios.get(url, { headers })
                .then(async (response) => {
                    if (response.status == 200) {
                        const Data = response.data.results[0]
                        if (!Data) return
                        else if (Data.status_detail == 'accredited') {
                    
                            function obterNomeSimplificado(entidade) {
                                return nomeAmigavel[entidade] || entidade;
                            }

                            if (response.data.results[0].point_of_interaction.transaction_data.bank_info !== undefined) {
                                const nomeSimplificadoPayer = obterNomeSimplificado(response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name)

                                const ggggggg = General.get('ConfigGeral.BankBlock')
                                if (ggggggg !== null) {
                                    const arrayLowerCase = ggggggg.map(item => item.toLowerCase());
                                    const ffaa11 = Carrinho.get(`${PaymentName22}`)
                                    if (arrayLowerCase.includes(nomeSimplificadoPayer) == true) {

                                        await channel.messages.fetch().then(async (messages) => {
                                            try {
                                                await channel.bulkDelete(messages)
                                            } catch (error) {

                                            }

                                        })
                                        const response = await axios.get(`https://api.mercadopago.com/v1/payments/search?external_reference=${PaymentId}`, {
                                            headers: {
                                                'Authorization': `Bearer ${IdServer}`
                                            }
                                        });
                                        const paymentId = response.data.results[0].id;
                                        const refundResponse = await axios.post(`https://api.mercadopago.com/v1/payments/${paymentId}/refunds`, {}, {
                                            headers: {
                                                'Authorization': `Bearer ${IdServer}`
                                            }
                                        });

                                        const embed = new EmbedBuilder()
                                            .setColor('Red')
                                            .setAuthor({ name: `Pedido #${BodyCompra}` })
                                            .setTitle(`Pedido não aprovado`)
                                            .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                                            .addFields(
                                                { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                            )


                                        const embed2 = new EmbedBuilder()
                                            .setColor('Red')
                                            .setAuthor({ name: `Pedido #${BodyCompra}` })
                                            .setTitle(`Anti Banco | Nova Venda`)
                                            .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${response.data.results[0].point_of_interaction.transaction_data.bank_info.payer.long_name}\`, o dinheiro do Comprador foi reembolsado, Obrigado por confiar em meu trabalho.`).addFields(
                                                { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                            )



                                        try {
                                            const channela = await client.channels.fetch(General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                                            channela.send({ embeds: [embed2], content: `<@${user}>` })

                                        } catch (error) {

                                        }

                                        const agora = Math.floor(new Date().getTime() / 1000);
                                        const novoTimestamp = agora + 60;

                                        channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                                            setInterval(async () => {
                                                try {
                                                    await channel.delete()
                                                } catch (error) {

                                                }
                                            }, 60000);
                                        })
                                        Pagamentos.delete(PaymentName22)
                                        return
                                    }

                                }
                            }

                            var iddd = response.data.results[0].id

                            const today = new Date();

                            StatusCompras.delete(BodyCompra)

                            StatusCompras.set(`${iddd}.Status`, 'Aprovado')
                            StatusCompras.set(`${iddd}.Data`, today)
                            StatusCompras.set(`${iddd}.Metodo`, 'Site')
                            StatusCompras.set(`${iddd}.IdPreference`, PaymentId)
                            StatusCompras.set(`${iddd}.GuildServerID`, IdServer2)
                            StatusCompras.set(`${iddd}.ID`, PaymentName22)
                            StatusCompras.set(`${iddd}.user`, user)
                            StatusCompras.set(`${iddd}.IdCompra`, iddd)


                            EntregarProdutos(client)
                            Pagamentos.delete(PaymentName22)
                        }
                    }
                })
        }

        if (typeValue == 'pix') {
            var res = await axios.get(`https://api.mercadopago.com/v1/payments/${BodyCompra}`, {
                headers: {
                    Authorization: `Bearer ${IdServer}`
                }
            })

            if (res.data.status == 'approved') { // approved ou approved


                const nomeAmigavel = {
                    'Nu Pagamentos S.A.': 'nu',
                    'Mercadopago.com Representações Ltda.': 'mp',
                    'Banco do Brasil S.A.': 'bdb',
                    'Caixa Econômica Federal': 'caixa',
                    'Banco Itaú Unibanco S.A.': 'itau',
                    'Banco Bradesco S.A.': 'bradesco',
                    'Banco Inter S.A.': 'inter',
                    'Neon Pagamentos S.A.': 'neon',
                    'Original S.A.': 'original',
                    'Next': 'next',
                    'Agibank': 'agibank',
                    'Santander (Brasil) S.A.': 'santander',
                    'C6 Bank S.A.': 'c6',
                    'Banrisul': 'banrisul',
                    'PagSeguro Internet S.A.': 'pagseguro',
                    'BS2': 'bs2',
                    'Modalmais': 'modalmais'
                };

                function obterNomeSimplificado(entidade) {
                    return nomeAmigavel[entidade] || entidade;
                }
                const nomeSimplificadoPayer = obterNomeSimplificado(res.data.point_of_interaction.transaction_data.bank_info.payer.long_name)


                const ggggggg = General.get('ConfigGeral.BankBlock')
                if (ggggggg !== null) {
                    const arrayLowerCase = ggggggg.map(item => item.toLowerCase());
                    const ffaa11 = Carrinho.get(`${PaymentName22}`)

                    if (arrayLowerCase.includes(nomeSimplificadoPayer) == true) {

                        await channel.messages.fetch().then(async (messages) => {
                            try {
                                await channel.bulkDelete(messages)
                            } catch (error) {

                            }

                        })

                        const urlReembolso = `https://api.mercadopago.com/v1/payments/${BodyCompra}/refunds`;
                        const headers = {
                            Authorization: `Bearer ${IdServer}`,
                        };
                        const body = {
                            metadata: {
                                reason: 'Banco Bloqueado!',
                            },
                        };
                        axios.post(urlReembolso, body, { headers })
                            .then(async response => {

                                const embed = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Pedido não aprovado`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, seu dinheiro foi reembolsado, tente novamente usando outro banco.`)
                                    .addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                    )

                                const embed2 = new EmbedBuilder()
                                    .setColor('Red')
                                    .setAuthor({ name: `Pedido #${BodyCompra}` })
                                    .setTitle(`Anti Banco | Nova Venda`)
                                    .setDescription(`Esse servidor não está aceitando pagamentos desta instituição \`${res.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\`, o dinheiro do Comprador foi reembolsado, Obrigado por confiar em meu trabalho.`).addFields(
                                        { name: `Detalhes`, value: `\`${ffaa11.messagepagamento2} | R$ ${ffaa11.totalpicecar}\`` }
                                    )

                                try {
                                    const channela = await client.channels.fetch(General.get('ConfigGeral.ChannelsConfig.ChannelLogAdm'));
                                    channela.send({ embeds: [embed2], content: `<@${user}>` })

                                } catch (error) {

                                }

                                const agora = Math.floor(new Date().getTime() / 1000);
                                const novoTimestamp = agora + 60;

                                channel.send({ content: `<@${user}>, Este canal será excluido em <t:${novoTimestamp}:R>`, embeds: [embed] }).then(deletechannel => {
                                    setInterval(async () => {
                                        try {
                                            await channel.delete()
                                        } catch (error) {

                                        }
                                    }, 60000);
                                })


                            })
                            .catch(error => {

                                console.error('Erro ao emitir o reembolso:', error.response.data);
                            });
                        Pagamentos.delete(PaymentName22)
                        return
                    }
                }
                StatusCompras.set(`${BodyCompra}.Status`, 'Aprovado')

                const today = new Date();

                StatusCompras.set(`${BodyCompra}.Data`, today)
                StatusCompras.set(`${BodyCompra}.IdCompra`, BodyCompra)
                StatusCompras.set(`${BodyCompra}.Metodo`, 'Pix')

                EntregarProdutos(client)

                Pagamentos.delete(PaymentName22)

            }
        }

    }
}

async function atualizarmessageprodutosone2(client, produto, serverid) {

    var s = produtos.get(`${produto}_${serverid}.settings.estoque`)
    var dd = produtos.get(`${produto}_${serverid}`)

    const embeddesc = DefaultMessages.get("ConfigGeral")


    var modifiedEmbeddesc = embeddesc.embeddesc
        .replace('#{desc}', produtos.get(`${produto}_${serverid}.settings.desc`))
        .replace('#{nome}', produtos.get(`${produto}_${serverid}.settings.name`))
        .replace('#{preco}', Number(produtos.get(`${produto}_${serverid}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length);

    var modifiedEmbeddesc2 = embeddesc.embedtitle
        .replace('#{nome}', produtos.get(`${produto}_${serverid}.settings.name`))
        .replace('#{preco}', Number(produtos.get(`${produto}_${serverid}.settings.price`)).toFixed(2))
        .replace('#{estoque}', Object.keys(s).length)

    const embed = new EmbedBuilder()
        .setTitle(modifiedEmbeddesc2)
        .setDescription(modifiedEmbeddesc)
        .setColor(`${dd.embedconfig.color == null ? '#000000' : dd.embedconfig.color}`)

    if (dd.embedconfig.banner !== null) {
        embed.setImage(dd.embedconfig.banner)
    }
    if (dd.embedconfig.miniatura !== null) {
        embed.setThumbnail(dd.embedconfig.miniatura)
    }
    try {
        const channel = await client.channels.fetch(dd.ChannelID);
        const fetchedMessage = await channel.messages.fetch(dd.MessageID);

        await fetchedMessage.edit({ embeds: [embed] });
    } catch (error) {

    }
}

async function avaliacao(interaction, pp, canalId, client, user) {
    var tttttt = await uud.get(pp)
    var avaliar22
    try {
        avaliar22 = interaction.fields.getTextInputValue('avaliar');
    } catch (error) {
        avaliar22 = null
    }

    const canal = client.channels.cache.get(canalId)
    try {


        await canal.messages.fetch(pp)
            .then(async (mensagem) => {

                await mensagem.edit({ content: `${obterEmoji(8)} | Obrigado por avaliar!`, embeds: [], components: [] }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) {
                        }
                    }, 2000);
                })
            })
    } catch (error) {
        return
    }
    function transformarEmEstrelas(numero) {
        return '\u2B50'.repeat(numero);
    }
    const member = await client.guilds.cache.get(tttttt.guildid).members.fetch(user);

    var mensagemfinal

    var result = null



    if (tttttt.resultado !== null) {
        result = tttttt.resultado
    }



    if (result == null) {
        mensagemfinal = `\`Nenhuma Avaliação\``
    } else {
        mensagemfinal = `${transformarEmEstrelas(result)} (${result})`

        if (avaliar22 !== ``) {
            mensagemfinal = `${transformarEmEstrelas(result)} (${result})\n**__${member.user.username}__:** \`${avaliar22}\``
        } else {
            mensagemfinal = `${transformarEmEstrelas(result)} (${result})\n**__${member.user.username}__:** \`Nenhum Comentário Adicional.\``
        }
    }

    const embedppppp = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setTitle(`${client.user.username} | Compra Aprovada`)
        .addFields(
            { name: `${obterEmoji(13)} **| COMPRADOR:**`, value: `${member.user} | ${member.user.username}` },
            { name: `${obterEmoji(12)} **| PRODUTO(S) COMPRADO(S):**`, value: `${tttttt.message}` },
            { name: `${obterEmoji(14)} **| VALOR PAGO:**`, value: `R$${Number(tttttt.valorpago).toFixed(2)}` },
            { name: `${obterEmoji(16)} **| VALOR DO DESCONTO:**`, value: `${tttttt.valordodesconto == null ? '\`R$0\`' : `\`R$${Number(tttttt.valordodesconto)}\``}` },
            { name: `${obterEmoji(17)} **| DATA:**`, value: `<t:${Math.ceil(Date.now() / 1000)}> (<t:${Math.ceil(Date.now() / 1000)}:R>)` },
            { name: `${obterEmoji(33)} **| Avaliação:**`, value: `${mensagemfinal}` }

        )
        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.` })
    if (General.get(`ConfigGeral.BannerEmbeds`) !== undefined) {
        embedppppp.setImage(General.get(`ConfigGeral.BannerEmbeds`))
    }


    try {
        const channel = await client.channels.fetch(General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`))
        channel.send({ embeds: [embedppppp], content: `<@${user}>` })
    } catch (error) {

    }

}


module.exports = {
    EntregarProdutos,
    verificarpagamento,
    atualizarmessageprodutosone2,
    avaliacao,
    nomeAmigavel
};