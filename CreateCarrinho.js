const { InteractionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, AttachmentBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const { produtos, General, Carrinho, Cupom, PagamentosSaldos, Pagamentos, StatusCompras, blacklist } = require('../../databases');
const mercadopago = require("mercadopago");
const lastReturnTimes = {};
const cooldownTime = 3;
const utilities = require("../../Lib/utilities")

const { QuickDB } = require("quick.db");
const { verificarpagamento, EntregarProdutos } = require('../../FunctionsAll/ChackoutPagamentoNovo');
const { obterEmoji } = require('../../Handler/EmojiFunctions');
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permcaraddcreate')

const accept_terms_awaiting = {}

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {


        const editMessage = async (message) => {

            try {

                const resultado = message.channel.topic.replace('carrinho_', '');
                const member = await interaction.guild.members.fetch(resultado);

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`${client.user.username} | Compra Cancelada`)
                    .setDescription(`Olá ${interaction.user},\n\nA sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)


                await member.send({ embeds: [embed] })

            } catch (error) {

            }

            try {
                if (General.get(`ConfigGeral.statuslogcompras`) !== false) {
                    const embedppppp = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`${client.user.username} | Compra Cancelada`)
                        .setDescription(`A compra do ${interaction.user} | ${interaction.user.username} Foi cancelada por inatividade, e todos os produtos foram devolvidos para o estoque`)
                        .setFooter({ text: `${interaction.user.username}` })
                        .setTimestamp()
                        .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))

                    const channel = await client.channels.fetch(General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
                    await channel.send({ embeds: [embedppppp] })
                }
            } catch (error) {

            }

            try {
                Carrinho.delete(message.channel.topic)
                await message.channel.delete()
            } catch (error) {

            }

        };

        const createCollector = (message) => {

            const collector = message.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000
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

            if (interaction.customId === 'addcupomcarlast') {

                const Cupom22 = interaction.fields.getTextInputValue('addcupomcarlast');
                var ppp = Cupom.get(Cupom22)
                var carr = Carrinho.get(interaction.channel.topic)

                if (ppp == null) return interaction.reply({ content: `${obterEmoji(22)} | Cupom invalído`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (ppp.quantidade <= 0) return interaction.reply({ content: `${obterEmoji(22)} | Todas quantidades dísponiveis do CUPOM foram utilizadas.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                if (Number(carr.totalpicecar) < ppp.valorminimo) return interaction.reply({ content: `${obterEmoji(22)} | O valor mínimo para utilizar esse cupom e de \`R$${Number(ppp.valorminimo).toFixed(2)}\``, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                const member = await interaction.guild.members.fetch(interaction.user.id);
                if (ppp.cargo !== undefined) if (!member.roles.cache.has(ppp.cargo)) return interaction.reply({ content: `${obterEmoji(22)} | Este cupom e permitido apenas se você tiver o CARGO <@&${ppp.cargo}>`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })
                var carr22222 = Carrinho.get(`${interaction.channel.topic}.cupomaplicado`)
                if (carr22222 !== null) return interaction.reply({ content: `${obterEmoji(22)} | Você já aplicou um CUPOM neste produto.`, ephemeral: true }).then(msgg => {
                    setTimeout(async () => {
                        try {
                            await msgg.delete()
                        } catch (error) { }
                    }, 3000);
                })


                var carr2 = Carrinho.get(`${interaction.channel.topic}.produtos`)
                var nomes = carr2.map(obj => Object.keys(obj)[0]);

                var nomespossui = []
                var nomespossui22 = []
                var nomespossui23 = []
                var cupomaplicatotal = 0
                if (ppp.categoria !== null) {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = produtos.get(`${nome}_${interaction.guild.id}.embedconfig.categoria`)
                        if (p == ppp.categoria) {
                            nomespossui.push(nome)

                        }
                    }

                    if (nomespossui == 0) {
                        for (var i = 0; i < nomes.length; i++) {

                            var nome = nomes[i];

                            var p = produtos.get(`${nome}_${interaction.guild.id}.embedconfig.cupom`)

                            if (p == true) {
                                nomespossui22.push(nome)

                            }
                        }

                    } else {
                        for (let i = 0; i < nomespossui.length; i++) {
                            const name = nomespossui[i];

                            for (var i2 = 0; i2 < carr2.length; i2++) {
                                var objeto = carr2[i2];
                                var nome = Object.keys(objeto)[0];

                                if (nome === name) {
                                    if (produtos.get(`${nome}_${interaction.guild.id}.embedconfig.cupom`) == true) {
                                        var produto = objeto[nome];

                                        cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                        break;
                                    }
                                }
                            }


                        }
                    }
                } else {
                    for (var i = 0; i < nomes.length; i++) {
                        var nome = nomes[i];
                        var p = produtos.get(`${nome}_${interaction.guild.id}.embedconfig.cupom`)
                        if (p == true) {
                            nomespossui22.push(nome)

                        }
                    }
                }

                if (nomespossui22 !== 0) {
                    for (let pds = 0; pds < nomespossui22.length; pds++) {
                        const ele = nomespossui22[pds];
                        var bbbbbbbb = produtos.get(`${ele}_${interaction.guild.id}`);
                        if (bbbbbbbb.embedconfig.cupom == true) {
                            nomespossui23.push(ele)
                        }
                    }

                    for (let i = 0; i < nomespossui23.length; i++) {
                        const name = nomespossui23[i];

                        for (var i2 = 0; i2 < carr2.length; i2++) {
                            var objeto = carr2[i2];
                            var nome = Object.keys(objeto)[0];

                            if (nome === name) {
                                if (produtos.get(`${nome}_${interaction.guild.id}.embedconfig.cupom`) == true) {
                                    var produto = objeto[nome];

                                    cupomaplicatotal = cupomaplicatotal + produto.pricetotal
                                    break;
                                }
                            }
                        }
                    }
                }
                if (cupomaplicatotal == 0) interaction.channel.send({ content: `${obterEmoji(22)} | Nenhum dos produtos estão ativados para receber CUPOM!!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                var un = Carrinho.get(interaction.channel.topic)
                var u = un.messagem
                var totalll = Number(un.totalpicecar).toFixed(2)

                var resultado = (Number(cupomaplicatotal) * ppp.porcentagem) / 100;
                var kk = Number(cupomaplicatotal).toFixed(2)
                var kkk = Number(resultado).toFixed(2)

                var novoValorAPagar = totalll - kkk

                if (novoValorAPagar <= 0) return interaction.channel.send({ content: `${obterEmoji(22)} | Valor de sua compra não pode se menor de 0`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                Carrinho.set(`${interaction.channel.topic}.totalpicecar`, totalll - kkk)


                string = u.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');
                string = string.replace(/\n${obterEmoji(14)} \*\*| Valor a Pagar:\*\* `.*`\n${obterEmoji(16)} \*\*| Cupom adicionado:\*\* `.*`/g, '');

                string = string.replace(/^\|.*$/gm, '');

                string += `${obterEmoji(14)} **| Valor a Pagar:** \`R$${Number(novoValorAPagar).toFixed(2)}\`\n`;
                string += `${obterEmoji(6)} **| Valor do desconto aplicado:** \`R$${kkk} - ${ppp.porcentagem}%\`\n`
                string += `${obterEmoji(16)} **| Cupom adicionado:** \`${Cupom22}\``;

                let string2 = string.replace(/${obterEmoji(2)} \*\*\| Produtos no Carrinho:\*\* \`2\`(\|+)/g, `${obterEmoji(2)} **| Produtos no Carrinho:** \`2\``);
                string2 = string2.replace(/🎁 \*\*.*\n/g, '\n');

                Carrinho.set(`${interaction.channel.topic}.cupomaplicado`, Cupom22)
                Carrinho.set(`${interaction.channel.topic}.valordodesconto`, kkk)
                Cupom.set(`${Cupom22}.quantidade`, Cupom.get(`${Cupom22}.quantidade`) - 1)


                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Resumo da Compra`)
                    .setDescription(string2)
                interaction.deferUpdate()
                interaction.message.edit({ embeds: [embed] }).then(msg => {
                    createCollector(msg)
                })
            }


            if (interaction.customId === 'escolherqtdproduto') {
                if (accept_terms_awaiting[interaction.user.id]){
                    return interaction.reply({ content: "Próxima tentativa de BUG = Blacklist 🐂 ", ephemeral: true})
                }

                const qtdddd = interaction.fields.getTextInputValue('escolherqtdproduto');
                const quantidade = parseFloat(qtdddd);

                if (isNaN(quantidade) || quantidade < 1 || quantidade % 1 !== 0) {

                    return interaction.reply({
                        content: `${obterEmoji(21)} | Quantidade inválida! Deve ser no minimo 1.`,
                        ephemeral: true
                    }).then(msg => {
                        setTimeout(async () => {
                            try {
                                await msg.delete();
                            } catch (error) {
                                console.error(error);
                            }
                        }, 3000);
                    });
                }

                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)

                const nomeObjetoProcurado = h.ID
                const t = Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                var ggggg = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var uuuuu = produtos.get(`${h.ID}_${interaction.guild.id}.settings.estoque`)
                if (qtdddd > Object.keys(uuuuu).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true }).then(msg => {
                    setTimeout(async () => {
                        try {
                            await msg.delete()
                        } catch (error) {
                        }
                    }, 3000);
                })

                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, qtdddd)

                var gggggf = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)

                var pricee = ggggg.price * gggggf.qtd
                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`🪐 **| Produto:** \`${ggggg.name}\`\n\n${obterEmoji(12)} **| Quantidade:** \`${gggggf.qtd}\`\n\n${obterEmoji(14)} **| Preço:** \`R$ ${Number(pricee).toFixed(2)}\`\n\n${obterEmoji(19)} **| Quantidade disponível:** \`${Object.keys(uuuuu).length}\``)

                interaction.message.edit({ embeds: [embed] })
                interaction.deferUpdate()
            }
        }

        if (interaction.isButton()) {

            if (interaction.customId.startsWith('generatepagamentlastfase')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = Carrinho.get(interaction.channel.topic)
                var sss = ''
                var sss2 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                });


                Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)

                if (General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`) == "ON") {
                    const embed = new EmbedBuilder()
                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de pagamento`)
                        .setDescription(`\`\`\`Efetue o pagamento Utilizando a Chave Pix ou o Qr Code.\`\`\`\n${obterEmoji(12)} **| Produto(s):**\n${sss}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}
                    `)
                        .setFooter({ text: `Após efetuar o pagamento, mande o comprovante, e aguarde a verificação.` })
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("manualpix")
                                .setLabel('Chave Pix')
                                .setEmoji(`1213543527196131388`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("manualqr")
                                .setLabel('Qr Code')
                                .setEmoji(`1238271183523156029`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("AprovarManual")
                                .setLabel('Aprovar Compra')
                                .setEmoji(`1041371452001226852`)
                                .setStyle(3)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("stopcompracancellastfase")
                                .setLabel(`Cancelar Compra`)
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false))

                    interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                        createCollector(msg)
                    })

                } else {
                    const embed = new EmbedBuilder()
                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de pagamento`)
                        .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`\n${obterEmoji(12)} **| Produto(s):**\n${sss}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}
                    `)
                        .setFooter({ text: `Escolha a forma de pagamento utilizando os botões abaixo:` })

                    var u = General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                    var bb = General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1213543527196131388`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`${obterEmoji(4)}`)
                                .setStyle(1)
                                .setDisabled(bb),
                            new ButtonBuilder()
                                .setCustomId("checkoutsiteeee")
                                .setLabel('Pagar no Site')
                                .setEmoji(`1190299502377173025`)
                                .setStyle(1)
                                .setDisabled(u),
                            new ButtonBuilder()
                                .setCustomId("stopcompracancellastfase")
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false))
                    
                        
                    interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                }
            }

            if (interaction.customId.startsWith('manualpix')) {
                interaction.channel.permissionOverwrites.edit(interaction.member, { SendMessages: true, AttachFiles: true })

                try {
                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `Chave Pix`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: `${obterEmoji(11)} **| Tipo de Chave:**`, value: `${General.get(`ConfigGeral.SemiAutoConfig.typepix`)}` },
                            { name: `${obterEmoji(18)} **| Chave Pix:**`, value: `${General.get(`ConfigGeral.SemiAutoConfig.pix`)}` }
                        )
                        .setFooter({ text: `${client.user.username} - Todos os direitos reservados.`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    await interaction.reply({ ephemeral: true, embeds: [embed] })

                } catch (error) {
                    await interaction.reply({ content: `${obterEmoji(21)} | Não Disponível!`, ephemeral: true })
                }
            }

            if (interaction.customId.startsWith('manualqr')) {
                interaction.channel.permissionOverwrites.edit(interaction.member, { SendMessages: true })
                try {
                    const embed = new EmbedBuilder()

                        .setImage(General.get(`ConfigGeral.SemiAutoConfig.qrcode`))

                    await interaction.reply({ embeds: [embed] })

                } catch (error) {
                    await interaction.reply({ content: `${obterEmoji(21)} | Não Disponível!`, ephemeral: true })
                }
            }

            if (interaction.customId.startsWith('AprovarManual')) {

                if (!utilities.getUserHasPermission(interaction.user.id)){
                    return interaction.deferUpdate()
                }

                const resultado = interaction.channel.topic.replace('carrinho_', '');

                var gg = Carrinho.get(interaction.channel.topic)
                const uu2 = generateCode2(7)

                const today = new Date();

                await StatusCompras.set(`${uu2}`, { Status: 'Aprovado', user: resultado, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: uu2, Metodo: 'Saldo', Data: today })

                if (gg.messagepagamento !== null) {
                    StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    // await interaction.channel.bulkDelete(messages)
                })
                EntregarProdutos(client)
            }


            if (interaction.customId.startsWith('checkoutsaldo')) {

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                var pp = PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)
                if (pp == null) pp = 0.00

                var gg = Carrinho.get(interaction.channel.topic)

                var tt = General.get('ConfigGeral')

                if (pp < Number(gg.totalpicecar)) {
                    interaction.reply({ content: `${obterEmoji(22)} | Você não tem saldo suficiente para realizar essa compra. Seu saldo: \`R$${Number(pp).toFixed(2)}\`, valor da compra: \`R$${Number(gg.totalpicecar).toFixed(2)}\``, ephemeral: true })
                    var u = General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                    var bb = General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"
                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("checkoultpix")
                                .setLabel('Pix')
                                .setEmoji(`1213543527196131388`)
                                .setStyle(1)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId("checkoutsaldo")
                                .setLabel('Saldo')
                                .setEmoji(`${obterEmoji(4)}`)
                                .setStyle(1)
                                .setDisabled(bb),
                            new ButtonBuilder()
                                .setCustomId("checkoutsiteeee")
                                .setLabel('Pagar no Site')
                                .setEmoji(`1190299502377173025`)
                                .setStyle(1)
                                .setDisabled(u),
                            new ButtonBuilder()
                                .setCustomId("stopcompracancellastfase")
                                .setEmoji(`1041371454211633254`)
                                .setStyle(4)
                                .setDisabled(false))
                    interaction.message.edit({ components: [row] }).then(msg => {
                        createCollector(msg)
                    })
                    return
                }
                interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de pagamento`)
                    .setDescription(`${obterEmoji(9)} - Você deseja efetuar o pagamento de ${gg.messagepagamento2} no valor de \`R$${Number(gg.totalpicecar).toFixed(2)}\` utilizando seu saldo de \`R$${Number(pp).toFixed(2)}\`?`)
                    .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de no maximo 1 minuto!`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("ComprarSaLDOcONFIRM")
                            .setLabel('Comprar')
                            .setEmoji(`1041371452001226852`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("voltarlastcheckout")
                            .setEmoji(`⬅️`)
                            .setStyle(2)
                            .setDisabled(false))

                interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }

            if (interaction.customId.startsWith('ComprarSaLDOcONFIRM')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var pp = PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)

                var gg = Carrinho.get(interaction.channel.topic)
                const uu2 = generateCode2(7)
                PagamentosSaldos.set(`${interaction.user.id}.SaldoAccount`, Number(PagamentosSaldos.get(`${interaction.user.id}.SaldoAccount`)) - Number(gg.totalpicecar).toFixed(2))



                const today = new Date();

                await StatusCompras.set(`${uu2}`, { Status: 'Aprovado', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic, IdCompra: uu2, Metodo: 'Saldo', Data: today })
                if (gg.messagepagamento !== null) {
                    StatusCompras.set(`${uu2}.messageinfoprodutos`, gg.messagepagamento)
                }

                if (gg.cupomaplicado !== null && gg.cupomaplicado !== undefined) {
                    StatusCompras.set(`${uu2}.cupomaplicado`, gg.cupomaplicado)
                }
                if (gg.valordodesconto !== null && gg.valordodesconto !== undefined) {
                    StatusCompras.set(`${uu2}.valordodesconto`, gg.valordodesconto)
                }
                await interaction.channel.messages.fetch().then(async (messages) => {
                    await interaction.channel.bulkDelete(messages)
                })

                interaction.channel.send(`${interaction.user}, estamos verificando seu pagamento. Aguarde.`)
                EntregarProdutos(client)
            }

            if (interaction.customId.startsWith('voltarlastcheckout')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = Carrinho.get(interaction.channel.topic)
                var sss = ''
                var sss2 = ''
                gg.produtos.forEach((objeto, index) => {
                    const chave = Object.keys(objeto)[0];
                    const { name, qtd } = objeto[chave];
                    sss += `${name} x${qtd}`;
                    if (index !== gg.produtos.length - 1) {
                        sss += '\n';
                    }

                    sss2 += `${name} - ${qtd}, `;
                });


                Carrinho.set(`${interaction.channel.topic}.messagepagamento`, sss)
                Carrinho.set(`${interaction.channel.topic}.messagepagamento2`, sss2)

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de pagamento`)
                    .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`${obterEmoji(12)} **| Produto(s):**\n${sss}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}
                    `)
                    .setFooter({ text: `Escolha a forma de pagamento utilizando os botões abaixo:` })

                var u = General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`) == "OFF"
                var bb = General.get(`ConfigGeral.SaldoConfig.SaldoStatus`) == "OFF"
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("checkoultpix")
                            .setLabel('Pix')
                            .setEmoji(`1213543527196131388`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("checkoutsaldo")
                            .setLabel('Saldo')
                            .setEmoji(`${obterEmoji(4)}`)
                            .setStyle(1)
                            .setDisabled(bb),
                        new ButtonBuilder()
                            .setCustomId("checkoutsiteeee")
                            .setLabel('Pagar no Site')
                            .setEmoji(`1190299502377173025`)
                            .setStyle(1)
                            .setDisabled(u),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setEmoji(`1041371454211633254`)
                            .setStyle(4)
                            .setDisabled(false))

                
                interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                    createCollector(msg)
                })
            }



            if (interaction.customId.startsWith('checkoutsiteeee')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = Carrinho.get(interaction.channel.topic)

                var tt = General.get('ConfigGeral')

                let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

                let timestamp = Math.floor(forFormat / 1000)
                mercadopago.configurations.setAccessToken(General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
                const ID = `PAYMENTEE${generateCode(35)}`
                var preference = {
                    items: [
                        {
                            title: `Pagamento - ${interaction.user.username}`,
                            unit_price: Number(gg.totalpicecar),
                            quantity: 1,
                        },
                    ],
                    external_reference: ID
                };
                var ttttttt = generateCode(7)

                mercadopago.preferences
                    .create(preference)
                    .then(async function (data) {
                        Pagamentos.set(`${interaction.channel.topic}`, {
                            Type: 'site',
                            PaymentId: ID,
                            ID: ttttttt,
                            BodyCompra: data.body.id,
                            link: data.body.init_point,
                            IdServer: General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                            IdServer2: interaction.guild.id,
                            user: interaction.user.id,
                            CanalID: interaction.channel.id,
                        })

                        StatusCompras.set(`${data.body.id}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic })

                        const embed = new EmbedBuilder()
                            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                            .setTitle(`${client.user.username} | Sistema de pagamento`)
                            .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`\n${obterEmoji(12)} **| Produto(s):**\n${gg.messagepagamento}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}\n${obterEmoji(7)} **| Pagamento expira em:**\n<t:${timestamp}> (<t:${timestamp}:R>)`)
                            .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de 15 segundos`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel('Realizar o Pagamento')
                                    .setEmoji(`1190299502377173025`)
                                    .setURL(data.body.init_point)
                                    .setStyle(5)
                                    .setDisabled(false),
                                new ButtonBuilder()
                                    .setCustomId("stopcompracancellastfase")
                                    .setEmoji(`1041371454211633254`)
                                    .setStyle(4)
                                    .setDisabled(false))
                        
                        
                        interaction.message.edit({ embeds: [embed], components: [row] }).then(msg => {
                            setTimeout(async () => {
                                try {
                                    await interaction.channel.delete()
                                    const resultado = message.channel.topic.replace('carrinho_', '');
                                    const member = await interaction.guild.members.fetch(resultado);

                                    const embed = new EmbedBuilder()
                                        .setColor("Red")
                                        .setTitle(`${client.user.username} | Compra Cancelada`)
                                        .setDescription(`Olá ${interaction.user},\n\nA sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)


                                    await member.send({ embeds: [embed] })
                                } catch (error) {

                                }
                            }, General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);
                        })
                    })
            }


            if (interaction.customId.startsWith('checkoultpix')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                var gg = Carrinho.get(interaction.channel.topic)

                var tt = General.get('ConfigGeral')

                let forFormat = Date.now() + tt.MercadoPagoConfig.TimePagament * 60 * 1000

                let timestamp = Math.floor(forFormat / 1000)

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de pagamento`)
                    .setDescription(`\`\`\`Escolha a forma de pagamento.\`\`\`\n${obterEmoji(12)} **| Produto(s):**\n${gg.messagepagamento}\n${obterEmoji(14)} **| Valor:**\nR$${Number(gg.totalpicecar).toFixed(2)}\n${obterEmoji(7)} **| Pagamento expira em:**\n<t:${timestamp}> (<t:${timestamp}:R>)`)
                    .setFooter({ text: `Após efetuar o pagamento, o tempo de entrega é de 15 segundos`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("pixcopiaecola182381371")
                            .setLabel('Pix Copia e Cola')
                            .setEmoji(`1213543527196131388`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("qrcode182812981")
                            .setLabel('Qr Code')
                            .setEmoji(`1238271183523156029`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setEmoji(`1041371454211633254`)
                            .setStyle(4)
                            .setDisabled(false))


                
                interaction.message.edit({ embeds: [embed], components: [row] }).then(async msg => {

                    setTimeout(async () => {
                        try {
                            await interaction.channel.delete()
                            const resultado = message.channel.topic.replace('carrinho_', '');
                            const member = await interaction.guild.members.fetch(resultado);

                            const embed = new EmbedBuilder()
                                .setColor("Red")
                                .setTitle(`${client.user.username} | Compra Cancelada`)
                                .setDescription(`Olá ${interaction.user},\n\nA sua compra foi cancelada por **inatividade**, e todos os produtos foram devolvidos para o estoque. Você pode voltar a comprar quando quiser!`)


                            await member.send({ embeds: [embed] })
                        } catch (error) {

                        }
                    }, General.get(`ConfigGeral.MercadoPagoConfig.TimePagament`) * 60000);

                    var payment_data = {
                        transaction_amount: Number(gg.totalpicecar),
                        description: `Pagamento - ${interaction.user.username}`,
                        payment_method_id: 'pix',
                        payer: {
                            email: `${interaction.user.id}@gmail.com`,
                            first_name: `Victor André`,
                            last_name: `Ricardo Almeida`,
                            identification: {
                                type: 'CPF',
                                number: '15084299872'
                            },

                            address: {
                                zip_code: '86063190',
                                street_name: 'Rua Jácomo Piccinin',
                                street_number: '971',
                                neighborhood: 'Pinheiros',
                                city: 'Londrina',
                                federal_unit: 'PR'
                            }
                        }
                    }
                    mercadopago.configurations.setAccessToken(General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP);
                    var ttttttt = generateCode2(7)

                    await mercadopago.payment.create(payment_data)
                        .then(async function (data) {
                            Pagamentos.set(`${interaction.channel.topic}`, {
                                Type: 'pix',
                                BodyCompra: data.body.id,
                                IdServer: General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP,
                                user: interaction.user.id,
                                ID: ttttttt,
                                QrCode: data.body.point_of_interaction.transaction_data.qr_code_base64,
                                pixcopiaecola: data.body.point_of_interaction.transaction_data.qr_code,
                                CanalID: interaction.channel.id,
                            })

                            StatusCompras.set(`${data.body.id}`, { Status: 'Pendente', user: interaction.user.id, GuildServerID: interaction.guild.id, ID: interaction.channel.topic })
                        })
                })
            }

            if (interaction.customId.startsWith('pixcopiaecola182381371')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                interaction.reply({ content: `${Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)}`, ephemeral: true })
            }

            if (interaction.customId.startsWith('qrcode182812981')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                await interaction.reply({content: `${obterEmoji(10)} Gerando QRCode...`, ephemeral: true})
                await new Promise(resolve => setTimeout(resolve, 1000));

                var ttttt = Pagamentos.get(`${interaction.channel.topic}.pixcopiaecola`)
                if (ttttt == null) return interaction.editReply({ content: `QR Code ainda não gerado, tente novamente`, ephemeral: true })

                const { qrGenerator } = require("../../Lib/QRCodeLib");
                const qr = new qrGenerator({ imagePath: './Lib/logo.png' })
          
                const qrcode = await qr.generate(ttttt)


                const buffer = Buffer.from(qrcode.response, "base64");
                const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                interaction.editReply({ files: [attachment], ephemeral: true, content: `` })
            }


            if (interaction.customId.startsWith('verificarpagamento172371293')) {
                interaction.deferUpdate()
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return
                verificarpagamento(client)
            }


            if (interaction.customId.startsWith('termos-continuar')) {
                accept_terms_awaiting[interaction.user.id] = true;

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                var vv = Carrinho.get(interaction.channel.topic).produtos

                if (vv == 0) return interaction.reply({ content: `❌ | Você não pode prosseguir sem nenhum produto no carrinho`, ephemeral: true })
                interaction.deferUpdate()

                let somaPricetotal = 0
                let produtostotal = 0
                var mensagem = ''
                for (let i = 0; i < vv.length; i++) {
                    produtostotal = produtostotal + 1
                    const objeto = vv[i];

                    const propriedade = Object.keys(objeto)[0];

                    const ChannelID = objeto[propriedade].ChannelID
                    const MessageID = objeto[propriedade].MessageID

                    const canal = client.channels.cache.get(ChannelID);
                    canal.messages.fetch(MessageID)
                        .then(mensagem => { mensagem.delete() })
                        .catch();


                    const pricetotal = objeto[propriedade].pricetotal
                    const price = objeto[propriedade].price
                    const name = objeto[propriedade].name
                    const qtd2 = objeto[propriedade].qtd

                    somaPricetotal = parseFloat(somaPricetotal) + parseFloat(pricetotal);



                    mensagem += `${obterEmoji(28)} | Produto: \`${name}\`\n`;
                    mensagem += `${obterEmoji(14)} | Valor unitário: \`R$${Number(price).toFixed(2)}\`\n`;
                    mensagem += `${obterEmoji(12)} | Quantidade: \`${qtd2}\`\n`;
                    mensagem += `${obterEmoji(14)} | Total: \`R$${Number(price * qtd2).toFixed(2)}\`\n\n`;

                }

                mensagem += `\n${obterEmoji(12)} **| Produtos no Carrinho:** \`${Number(produtostotal).toFixed(0)}\`\n`;
                mensagem += `${obterEmoji(14)} **| Valor a Pagar:** \`R$${Number(somaPricetotal).toFixed(2)}\`\n`;
                mensagem += `${obterEmoji(16)} **| Cupom adicionado:** \`Sem Cupom\`\n`;

                Carrinho.set(`${interaction.channel.topic}.totalpicecar`, Number(somaPricetotal).toFixed(2))
                Carrinho.set(`${interaction.channel.topic}.messagem`, mensagem)
                Carrinho.set(`${interaction.channel.topic}.accepttermo`, true)
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Resumo da Compra`)
                    .setDescription(mensagem)



                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("generatepagamentlastfase")
                            .setLabel('Ir para o Pagamento')
                            .setEmoji(`1041371452001226852`)
                            .setStyle(3)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("addcupomcarlast")
                            .setLabel('Adicionar Cupom de Desconto')
                            .setEmoji(`1238280206591066112`)
                            .setStyle(1)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("stopcompracancellastfase")
                            .setLabel('Cancelar Compra')
                            .setEmoji(`1041371454211633254`)
                            .setStyle(4)
                            .setDisabled(false))
                interaction.message.edit({ embeds: [embed], components: [row], content: `${interaction.user}` }).then(msg => {
                    delete accept_terms_awaiting[interaction.user.id]
                    createCollector(msg)
                })
            }



            if (interaction.customId.startsWith('stopcompracancellastfase')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                Carrinho.delete(interaction.channel.topic)


                try {
                    if (General.get(`ConfigGeral.statuslogcompras`) !== false) {
                        const embedppppp = new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(`${client.user.username} | Compra Cancelada`)
                            .setDescription(`O ${interaction.user} | ${interaction.user.username}\n\n • Cancelou a compra, e todos os produtos foram devolvidos para o estoque`)
                            .setFooter({ text: `${interaction.user.username}` })
                            .setTimestamp()
                            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))

                        const channel = await client.channels.fetch(General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
                        await channel.send({ embeds: [embedppppp] })
                    }
                } catch (error) {

                }


                interaction.channel.delete()
            }

            if (interaction.customId.startsWith('addcupomcarlast')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()

                const modala = new ModalBuilder()
                    .setCustomId('addcupomcarlast')
                    .setTitle(`Adicionar Cupom`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('addcupomcarlast')
                    .setLabel("NOME DO CUPOM?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }

            if (interaction.customId.startsWith('escolherqtdproduto')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                const modala = new ModalBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setTitle(`✏ | Alterar Quantidade`);

                const AdicionarNoTicket = new TextInputBuilder()
                    .setCustomId('escolherqtdproduto')
                    .setLabel("Quantidade?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const firstActionRow = new ActionRowBuilder().addComponents(AdicionarNoTicket);

                modala.addComponents(firstActionRow);

                await interaction.showModal(modala);
            }


            if (interaction.customId.startsWith('removerprodutocarrinho')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)

                Carrinho.pull(`carrinho_${interaction.user.id}.produtos`, (element, index, array) => element.nomeObjetoProcurado)


                interaction.reply({ content: `${obterEmoji(8)} | Produto removido com sucesso!`, ephemeral: true })

                interaction.message.delete()

            }

            if (interaction.customId.startsWith('remqtdproducto')) {
                if (accept_terms_awaiting[interaction.user.id]){
                    return interaction.reply({ content: "Próxima tentativa de BUG = Blacklist 🐂 ", ephemeral: true})
                }

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)

                const nomeObjetoProcurado = h.ID
                const t = Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }

                var ggggg = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var uuuuu = produtos.get(`${h.ID}_${interaction.guild.id}.settings.estoque`)
                if (ggggg.qtd <= 1) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível diminuir mais que o produto mínimo!`, ephemeral: true })
                interaction.deferUpdate()
                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`) - 1)



                var gggggf = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)




                var pricee = ggggg.price * gggggf.qtd
                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(28)} **| Produto:** \`${ggggg.name}\`\n\n${obterEmoji(12)} **| Quantidade:** \`${gggggf.qtd}\`\n\n${obterEmoji(14)} **| Preço:** \`R$ ${Number(pricee).toFixed(2)}\`\n\n${obterEmoji(19)} **| Quantidade disponível:** \`${Object.keys(uuuuu).length}\``)

                interaction.message.edit({ embeds: [embed] })
            }

            if (interaction.customId.startsWith('termos-ler')) {
                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Termos de compra`)
                    .setDescription(General.get(`ConfigGeral.TermosCompra`))

                interaction.reply({ embeds: [embed], ephemeral: true })
            }


            if (interaction.customId.startsWith('addqtdproducto')) {
                if (accept_terms_awaiting[interaction.user.id]){
                    return interaction.reply({ content: "Próxima tentativa de BUG = Blacklist 🐂 ", ephemeral: true})
                }

                const resultado = interaction.channel.topic.replace('carrinho_', '');
                if (resultado !== interaction.user.id) return interaction.deferUpdate()
                var uuu = db.table('infoseditproductocarrinho')
                var h = await uuu.get(interaction.message.id)
                const nomeObjetoProcurado = h.ID
                const t = Carrinho.get(`carrinho_${interaction.user.id}`)
                let posicao = -1;

                for (let i = 0; i < t.produtos.length; i++) {
                    const objeto = t.produtos[i];
                    if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                        posicao = i;
                        break;
                    }
                }
                var ggggg = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var uuuuu = produtos.get(`${h.ID}_${interaction.guild.id}.settings.estoque`)
                if (ggggg.qtd >= Object.keys(uuuuu).length) return interaction.reply({ content: `${obterEmoji(22)} | Não é possível adicionar mais que o estoque disponível!`, ephemeral: true })
                interaction.deferUpdate()
                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`, Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.qtd`) + 1)
                var gggggf = Carrinho.get(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}`)
                var pricee = ggggg.price * gggggf.qtd
                Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${h.ID}.pricetotal`, pricee)

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(28)} **| Produto:** \`${ggggg.name}\`\n\n${obterEmoji(12)} **| Quantidade:** \`${gggggf.qtd}\`\n\n${obterEmoji(14)} **| Preço:** \`R$ ${Number(pricee).toFixed(2)}\`\n\n${obterEmoji(19)} **| Quantidade disponível:** \`${Object.keys(uuuuu).length}\``)

                interaction.message.edit({ embeds: [embed] })
            }

            if (interaction.customId.startsWith('activeNotificacaoProduto')) {
                var aa = await uu.get(interaction.user.id)


                var tt = produtos.get(`${aa}.settings.notify`)
                if (tt !== null) {
                    if (tt.includes(interaction.user.id)) {
                        interaction.reply({
                            content: `${obterEmoji(8)} | Você já estava com as notificações ativadas, portanto elas foram desativadas.\n**Caso queira ativar só clicar no botão novamente!**`, ephemeral: true
                        })
                        var novaArray = tt.filter(function (elemento) {
                            return elemento !== interaction.user.id;
                        });

                        produtos.set(`${aa}.settings.notify`, novaArray)

                    } else {
                        interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                        produtos.push(`${aa}.settings.notify`, interaction.user.id)
                    }
                } else {
                    interaction.reply({ content: `${obterEmoji(8)} | Notificações ativadas com sucesso!`, ephemeral: true })
                    produtos.push(`${aa}.settings.notify`, interaction.user.id)
                }
            }

        }
        var g = null
        var namecustom = null
        var painel2222 = null
        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'buyprodutoporselect') {
                g = produtos.get(interaction.values[0])
                namecustom = interaction.values[0]
                painel2222 = true
                painelname = interaction.customId
            }
        }
        if (interaction.isButton()) {
            g = produtos.get(interaction.customId)
            namecustom = interaction.customId
            painel2222 = false
        }
        if (g !== null) {
            interaction.message.edit()
            const currentTime = Date.now();
            const customId = interaction.user.id;

            const ddawdawdd = blacklist.get(`BlackList.users`)

            if (ddawdawdd !== null) {
                if (ddawdawdd.includes(interaction.user.id) == true) {
                    interaction.reply({ content: `❌ | Você está registrado na **BLACK-LIST** de nosso sistema de LOJA!`, ephemeral: true })
                    return
                }
            }

            if (lastReturnTimes[customId]) {
                const elapsedTime = currentTime - lastReturnTimes[customId];
                const remainingTime = Math.max(0, cooldownTime - Math.floor(elapsedTime / 1000));

                if (remainingTime > 0) {
                    interaction.reply({ content: `Aguarde ${remainingTime} segundos para interagir novamente.`, ephemeral: true });
                    return;
                }
            }
            const axios = require('axios');
            lastReturnTimes[customId] = currentTime;

            if (General.get('ConfigGeral').MercadoPagoConfig.PixToggle == "ON") {
                const embed3 = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`${obterEmoji(21)} | ${interaction.user} Você não configurou corretamente o Token do Mercado Pago!.`)

                if (General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP == "") return interaction.reply({ embeds: [embed3], ephemeral: true })
            }

            const embed4 = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${client.user.username} | Sistema de Vendas`)
                .setDescription(`${obterEmoji(21)} | ${interaction.user}, o dono do bot ainda não configurou os canais, aguarde até ele configurar!`)


            if (General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) == null) return interaction.reply({ embeds: [embed4], ephemeral: true })
            if (General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) == null) return interaction.reply({ embeds: [embed4], ephemeral: true })

            const embed2 = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setTitle(`${client.user.username} | Sistema de Vendas`)
                .setDescription(`${obterEmoji(21)} | ${interaction.user} O sistema de vendas se encontra desativado, aguarde até ele ser ligado novamente!`)


            if (General.get(`ConfigGeral.Status`) == 'OFF') return interaction.reply({ embeds: [embed2], ephemeral: true })



            var fasasas = produtos.get(`${namecustom}.settings.CargosBuy`)

            if (fasasas !== null) {
                const hasAnyRole = fasasas.some(roleId => interaction.member.roles.cache.has(roleId))
                if (hasAnyRole) {
                } else {
                    const embedakdkjasd = new EmbedBuilder()
                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de Vendas`)
                        .setDescription(`${obterEmoji(22)} | ${interaction.user} Você não possui permissão para comprar esse produto`)

                    interaction.reply({ embeds: [embedakdkjasd], ephemeral: true })
                    return
                }
            }



            var f = produtos.get(`${namecustom}.settings.estoque`)

            const embed = new EmbedBuilder()
                .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                .setDescription(`${obterEmoji(21)} | Este produto está sem estoque, aguarde um reabastecimento!`)

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("activeNotificacaoProduto")
                        .setLabel('Ativar Notificações')
                        .setEmoji(`1176326488073699338`)
                        .setStyle(2)
                        .setDisabled(false))

            if (f !== null) {
                if (Object.keys(f).length <= 0) return interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                    uu.set(interaction.user.id, namecustom)
                })
            } else {
                return interaction.reply({ embeds: [embed], components: [row], ephemeral: true }).then(msg => {
                    uu.set(interaction.user.id, namecustom)
                })
            }






            let achando = interaction.guild.channels.cache.find(a => a.topic === `carrinho_${interaction.user.id}`);

            var a = Carrinho.get(`carrinho_${interaction.user.id}.ChannelUrl`)



            if (a !== null) {


                const row2 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`🛒・Ir para o Carrinho`)
                        .setStyle(5)
                        .setURL(a)
                )
                if (achando) {

                    var uuuu = Carrinho.get(`carrinho_${interaction.user.id}.accepttermo`)

                    const row99 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`🛒・Ir para o Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )
                    if (uuuu == true) return interaction.reply({ content: `${obterEmoji(21)} | Não é possível adicionar mais produtos no seu carrinho!`, components: [row99], ephemeral: true })


                    var all = Carrinho.get(`carrinho_${interaction.user.id}`)
                    var bbbb = Carrinho.get(`carrinho_${interaction.user.id}.produtos`)
                    const objetoEncontrado = bbbb.find(objeto => {
                        return objeto.hasOwnProperty(g.ID);
                        // Ou utilize: return palavra in objeto;
                    });
                    if (objetoEncontrado) {
                        interaction.reply({ content: `${obterEmoji(21)} | Esse produto já está no seu carrinho!`, components: [row2], ephemeral: true })
                        return
                    }



                    const embedaaaa = new EmbedBuilder()
                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setTitle(`${client.user.username} | Sistema de Vendas`)
                        .setDescription(`${obterEmoji(8)} | ${interaction.user} Produto adicionado com sucesso no seu carrinho!`)
                    const row3 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel(`🛒・Ir para o Carrinho`)
                            .setStyle(5)
                            .setURL(a)
                    )

                    interaction.reply({ embeds: [embedaaaa], components: [row3], ephemeral: true })
                    const channela = interaction.guild.channels.cache.get(all.ChannelID);

                    const embed = new EmbedBuilder()
                        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                        .setDescription(`${obterEmoji(18)} **| Produto:** \`${g.settings.name}\`\n\n${obterEmoji(12)} **| Quantidade:** \`1\`\n\n${obterEmoji(14)} **| Preço:** \`R$ ${Number(g.settings.price).toFixed(2)}\`\n\n${obterEmoji(19)} **| Quantidade disponível:** \`${Object.keys(f).length}\``)

                    const row22 = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel('+')
                            .setCustomId('addqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('✏️')
                            .setCustomId('escolherqtdproduto')
                            .setStyle(3),
                        new ButtonBuilder()
                            .setLabel('-')
                            .setCustomId('remqtdproducto')
                            .setStyle(2),
                        new ButtonBuilder()
                            .setEmoji('1225163648918356051')
                            .setCustomId('removerprodutocarrinho')
                            .setStyle(4)
                    )

                    channela.send({ embeds: [embed], components: [row22] }).then(msg => {
                        const produto = { [g.ID]: { price: g.settings.price, qtd: 1, name: g.settings.name, ChannelID: msg.channel.id, MessageID: msg.id, pricetotal: g.settings.price, GuildServerID: interaction.guild.id } };
                        Carrinho.push(`carrinho_${interaction.user.id}.produtos`, produto)
                        var uuu = db.table('infoseditproductocarrinho')
                        uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id })
                    })
                    return
                }
            }



            var categoria
            if (General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) !== null) {
                categoria = General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)
            } else {
                categoria = null
            }

            const channel = client.channels.cache.get(General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`));

            if (channel == undefined) return interaction.reply({ content: `❌ | Error o CHAT escolhido não é uma categoria`, ephemeral: true })

            var tttttttt = channel.type == ChannelType.GuildCategory
            if (tttttttt == false) return interaction.reply({ content: `❌ | Error o CHAT escolhido não é uma categoria`, ephemeral: true })


            var uuuuuuuuuu = 1
            if (General.get('ConfigGeral').MercadoPagoConfig.PixToggle == "ON") {
                await axios.get('https://api.mercadopago.com/v1/payment_methods', {
                    headers: {
                        'Authorization': `Bearer ${General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}`
                    }
                })
                    .then(async (data) => {
                        await interaction.reply({ content: `${obterEmoji(10)} | Criando o Carrinho...`, ephemeral: true })
                    })
                    .catch(async error => {
                        await interaction.reply({ content: `❌ | Error Mercado Pago: ${error.response.data.message}`, ephemeral: true })
                        uuuuuuuuuu = 0
                    });
            } else {

                await interaction.reply({ content: `${obterEmoji(10)} | Criando o Carrinho...`, ephemeral: true })
            }
            if (uuuuuuuuuu !== 1) return

            interaction.guild.channels.create({
                name: `🛒・${interaction.user.username}`,
                parent: categoria,
                topic: `carrinho_${interaction.user.id}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ],
            }).then(async channel281243664 => {

                var g = produtos.get(namecustom)
                var f = produtos.get(`${namecustom}.settings.estoque`)
                var pp = g.ID
                const produto = { [pp]: { price: g.settings.price, qtd: 1, name: g.settings.name, pricetotal: g.settings.price } };
                if (painel2222 == true) {
                    Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222, painelname: painelname })
                } else {
                    Carrinho.set(`carrinho_${interaction.user.id}`, { ChannelUrl: channel281243664.url, ChannelID: channel281243664.id, produtos: [produto], GuildServerID: interaction.guild.id, painel: painel2222 })
                }
                const embedPrincipalCar = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Sistema de compra`)
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(29)} | Olá ${interaction.user}, este é seu carrinho, fique à vontade para adicionar mais produtos ou fazer as modificações que achar necessário.\n\n${obterEmoji(30)} | Lembre-se de ler nossos termos e compra, para não ter nenhum problema futuramente, ao continuar com a compra, você concorda com nossos termos.\n\n${obterEmoji(27)} | Quando estiver tudo pronto aperte o botão abaixo, para continuar com sua compra!`)
                    .setFooter({ text: `${client.user.username} - Todos os direitos reservados.` })

                const RowPrincipalCar = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Aceitar e Continuar')
                        .setEmoji('1041371452001226852')
                        .setCustomId('termos-continuar')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setLabel('Cancelar')
                        .setEmoji('1041371454211633254')
                        .setCustomId('stopcompracancellastfase')
                        .setStyle(4),
                    new ButtonBuilder()
                        .setLabel('Ler os Termos')
                        .setEmoji('📋')
                        .setCustomId('termos-ler')
                        .setStyle(3)
                )
                channel281243664.send({ embeds: [embedPrincipalCar], components: [RowPrincipalCar], content: `${interaction.user}` }).then(msg => {
                    createCollector(msg)
                })

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#000000' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setDescription(`${obterEmoji(28)} **| Produto:** \`${g.settings.name}\`\n\n${obterEmoji(12)} **| Quantidade:** \`1\`\n\n${obterEmoji(14)} **| Preço:** \`R$ ${Number(g.settings.price).toFixed(2)}\`\n\n${obterEmoji(19)} **| Quantidade disponível:** \`${Object.keys(f).length}\``)


                const row22 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('+')
                        .setCustomId('addqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('✏️')
                        .setCustomId('escolherqtdproduto')
                        .setStyle(3),
                    new ButtonBuilder()
                        .setLabel('-')
                        .setCustomId('remqtdproducto')
                        .setStyle(2),
                    new ButtonBuilder()
                        .setEmoji('1225163648918356051')
                        .setCustomId('removerprodutocarrinho')
                        .setStyle(4)
                )
                channel281243664.send({ embeds: [embed], components: [row22] }).then(msg => {
                    const nomeObjetoProcurado = g.ID
                    const t = Carrinho.get(`carrinho_${interaction.user.id}`)
                    let posicao = -1;

                    for (let i = 0; i < t.produtos.length; i++) {
                        const objeto = t.produtos[i];
                        if (objeto.hasOwnProperty(nomeObjetoProcurado)) {
                            posicao = i;
                            break;
                        }
                    }
                    Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.ChannelID`, msg.channel.id)
                    Carrinho.set(`carrinho_${interaction.user.id}.produtos[${posicao}].${g.ID}.MessageID`, msg.id)
                    var uuu = db.table('infoseditproductocarrinho')
                    uuu.set(msg.id, { ID: g.ID, ChannelID: msg.channel.id, MessageID: msg.id, GuildServerID: interaction.guild.id })
                })


                const reply = new EmbedBuilder()
                    .setTitle(`${client.user.username} | Sistema de Vendas`)
                    .setDescription(`**✅ | ${interaction.user} Seu carrinho foi aberto com sucesso em: ${channel281243664}, fique à vontade para adicionar mais produtos.**`)
                    .setColor('Green')

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel(`🛒・Ir para o Carrinho`)
                        .setStyle(5)
                        .setURL(channel281243664.url)
                )

                interaction.editReply({ content: ``, embeds: [reply], components: [row] })



                try {
                    if (General.get(`ConfigGeral.statuslogcompras`) !== false) {
                        const embedppppp = new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(`${client.user.username} | Carrinho Criado`)
                            .setDescription(`${obterEmoji(9)} | ${interaction.user} | ${interaction.user.username} Criou Um carrinho\n\nProduto: \`${g.settings.name}\`\nValor: \`${g.settings.price}\``)
                            .setFooter({ text: `${interaction.user.username}` })
                            .setTimestamp()
                            .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))

                        const channel = await client.channels.fetch(General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`))
                        await channel.send({ embeds: [embedppppp] })
                    }
                } catch (error) {

                }
            })
        } else {
            return
        }
    }
}

function generateCode(length) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}
function generateCode2(length) {
    let characters = '1234567890';
    let code = '';

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}