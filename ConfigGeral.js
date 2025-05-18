const { UpdateStatusVendas, updateMessageConfig, UpdatePagamento, ConfigMP, ToggeMP, TimeMP, ToggleSaldo, bonusSaldo, ConfigSaldo, ConfigSemiAuto, ToggleSemiAuto, PixChangeSemiAuto, configbot, configbotToggle, FunctionCompletConfig, configchannels, configchannelsToggle, CompletConfigChannels, ConfigTermoConfig, ConfigTermo, ConfigCashBack, configmoderacao, autorole } = require("../../FunctionsAll/BotConfig")
const { InteractionType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, RoleSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require("../../Handler/EmojiFunctions");
const { General } = require("../../databases");
const axios = require('axios');
const { QuickDB } = require("quick.db");
const { automsg } = require("../../FunctionsAll/Blacklist.js");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permissionsmessage')
const { nomeAmigavel } = require("../../FunctionsAll/ChackoutPagamentoNovo.js");

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'timeMP') {

                TimeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId === 'tokenMP') {
                //await interaction.deferUpdate()
                TimeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'bonusSaldo') {

                bonusSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'SemiautoPix') {

                PixChangeSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'Semiautoqrcode') {

                PixChangeSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newnamebot') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeAvatar') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeColorBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarMiniatura') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'AlterarBanner') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'ChangeStatusBOT') {

                FunctionCompletConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newtermocompra') {

                ConfigTermoConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId === 'newanuncio') {

                const title = interaction.fields.getTextInputValue('title');
                const desc = interaction.fields.getTextInputValue('desc');
                const content = interaction.fields.getTextInputValue('content');
                const image = interaction.fields.getTextInputValue('image');
                const color = interaction.fields.getTextInputValue('color');

                const embed = new EmbedBuilder()
                    .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
                    .setTitle(title)
                    .setDescription(desc)

                if (color !== '') {
                    var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    var isHexadecimal = regex.test(color);
                    if (isHexadecimal) {
                        embed.setColor(color)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${obterEmoji(21)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (image !== '') {
                    const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
                    if (url.test(image)) {
                        embed.setThumbnail(image)
                    } else {
                        interaction.reply({ ephemeral: true, content: `${obterEmoji(21)} | Ocorreu algum erro, tem certeza que colocou as informações corretas?` })
                        return
                    }
                }
                if (content !== '') {
                    interaction.channel.send({ embeds: [embed], content: content })
                } else {
                    interaction.channel.send({ embeds: [embed] })
                }

                interaction.reply({ ephemeral: true, content: `${obterEmoji(8)} | Anuncio enviado com sucesso!` })
            }

            if (interaction.customId === 'sdajuidsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                let arrayDeBancos = [];

                if (title){
                    const stringSemEspacos = title.replace(/\s/g, '');
                    arrayDeBancos = stringSemEspacos.split(',');
                }else{
                    arrayDeBancos = []
                }

                const arrayBankValues = [];
                Object.entries(nomeAmigavel).map((element) => arrayBankValues.push(element[1]));

                for (const key in arrayDeBancos) {
                    const element = arrayDeBancos[key];
                    const elementExistInArray = arrayBankValues.includes(element);

                    if (!elementExistInArray) {
                        return interaction.reply({ content: `❌ | Você colocou um banco incorreto! Nome do Banco: ${element}`, ephemeral: true })
                    }
                }

                General.set(`ConfigGeral.BankBlock`, arrayDeBancos)
                const gfgfggfg = General.get(`ConfigGeral.BankBlock`)
                var hhhh = ''
                for (const key in gfgfggfg) {
                    const element = gfgfggfg[key];
                    hhhh += `${element}`;
                    if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                        hhhh += ', ';
                    }
                }

                await interaction.reply({ content: `${obterEmoji(8)} | Lista de bancos bloqueados foi atualizada com sucesso!\n\`${hhhh}\``, ephemeral: true })
            }

            if (interaction.customId === 'sdaju11111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('tokenMP3');

                if (title) {
                    if (!isNaN(title)) {
                        General.set(`ConfigGeral.AntiFake.diasminimos`, Number(title))
                    } else {
                        interaction.reply({ content: `❌ | Você colocou um numero incorreto nos dias!`, ephemeral: true })
                        return
                    }
                } else {
                    General.set(`ConfigGeral.AntiFake.diasminimos`, 0)
                }


                if (title2) {
                    const stringSemEspacos = title2.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    General.set(`ConfigGeral.AntiFake.status`, arrayDeBancos)
                }else{
                    General.set(`ConfigGeral.AntiFake.status`, [])
                }


                if (title3) {
                    const stringSemEspacos = title3.replace(/\s/g, '');
                    const arrayDeBancos = stringSemEspacos.split(',');
                    General.set(`ConfigGeral.AntiFake.nomes`, arrayDeBancos)
                }else{
                    General.set(`ConfigGeral.AntiFake.nomes`, [])
                }

                await interaction.reply({ content: `✅ | Todas configurações de Anti-Fake foram configuradas com sucesso!`, ephemeral: true })
            }

            if (interaction.customId === 'sdaju111idsjjsdua') {
                const title = interaction.fields.getTextInputValue('tokenMP');
                const title2 = interaction.fields.getTextInputValue('tokenMP2');
                const title3 = interaction.fields.getTextInputValue('qualcanal');


                const stringSemEspacos = title3.replace(/\s/g, '');
                const arrayDeBancos = stringSemEspacos.split(',');


                if (isNaN(title2) == true) return interaction.reply({ content: `❌ | Você colocou um tempo incorreto para a mensagem ser apagada!`, ephemeral: true })

                General.set('ConfigGeral.Entradas', {
                    msg: title,
                    tempo: title2,
                    channelid: arrayDeBancos,
                })

                interaction.reply({ content: `✅ | Todas configurações de Bem vindo foram configuradas com sucesso!`, ephemeral: true })
            }




        }



        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'wdawwadawwadwaroleaddautorole') {
                await interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                General.set(`ConfigGeral.AutoRole.add`, interaction.values)
                autorole(interaction, client)

                await interaction.followUp({ content: `O sistema de AutoRole foi configurado com sucesso`, ephemeral: true })
            }

            if (interaction.customId == 'ereggbggbroleremoveautorole') {
                await interaction.deferUpdate()

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                General.set(`ConfigGeral.AutoRole.remove`, interaction.values)
                autorole(interaction, client)

                await interaction.followUp({ content: `O sistema de AutoRole foi configurado com sucesso`, ephemeral: true })
            }

        }

        if (interaction.type == InteractionType.ModalSubmit) {

            if (interaction.customId === 'awdwat123ransferawdawdwadaw') {
                const titulo = interaction.fields.getTextInputValue('titulo');
                const descricao = interaction.fields.getTextInputValue('descricao');
                const bannerembed = interaction.fields.getTextInputValue('bannerembed');
                const buttomes = interaction.fields.getTextInputValue('buttomes');
                const idchanell = interaction.fields.getTextInputValue('idchanell');


                if (isNaN(buttomes) == true) return interaction.reply({ content: `O valor fornecido é incorreto, revise novamente`, ephemeral: true })

                function hasValidLink(text) {
                    const linkRegex = /(http|https):\/\/\S+/;

                    return linkRegex.test(text);
                }

                if (bannerembed !== '') {
                    if (!hasValidLink(bannerembed)) return interaction.reply({ content: `O banner fornecido é incorreto, revise novamente`, ephemeral: true })
                }
                General.push(`ConfigGeral.AutoMessage`, [{
                    titulo: titulo,
                    descricao: descricao,
                    bannerembed: bannerembed,
                    time: buttomes,
                    idchanell: idchanell
                }])

                await interaction.deferUpdate();

                automsg(interaction, client)
                return interaction.followUp({ content: `O sistema foi configurado com sucesso! (REINICIE O BOT para funcionar perfeitamente!)`, ephemeral: true })

            }



            if (interaction.customId === 'awdwasdajdaawdu1111awdwadawdaw1idsjjsdua') {
                await interaction.deferUpdate()
                const tokenMP = interaction.fields.getTextInputValue('tokenMP');

                if (isNaN(tokenMP) == true) return interaction.followUp({ content: `❌ | Número incorreto.`, ephemeral: true })

                const gggg = General.get(`ConfigGeral.AutoMessage`)
                if (gggg[tokenMP - 1] == undefined) return interaction.followUp({ content: `❌ | Número incorreto.`, ephemeral: true })

                General.pull(`ConfigGeral.AutoMessage`, (element, index, array) => index == tokenMP - 1)

                await interaction.followUp({ content: `Removida com Sucesso`, ephemeral: true })
                automsg(interaction, client)
            }
        }

        if (interaction.isButton()) {


            if (interaction.customId == 'criarmsgauto') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwat123ransferawdawdwadaw')
                    .setTitle(`Configurar Embed`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('titulo')
                    .setLabel(`Envie abaixo o Titulo da Embed`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(100)
                    .setRequired(false)


                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('descricao')
                    .setLabel("Envie abaixo a Mensagem")
                    .setStyle(TextInputStyle.Paragraph)
                    .setMaxLength(4000)
                    .setRequired(true)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('bannerembed')
                    .setLabel("Envie o Banner")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN444 = new TextInputBuilder()
                    .setCustomId('buttomes')
                    .setLabel("Quanto tempo? (Em segundos)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(150)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('idchanell')
                    .setLabel("Envie o ID do canal que será enviado")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(25)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN3);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN444);
                modalaAA.addComponents(firstActionRow3, firstActionRow2, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'automsgggs') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                automsg(interaction, client)
            }


            if (interaction.customId == 'remmsgautomatica') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('awdwasdajdaawdu1111awdwadawdaw1idsjjsdua')
                    .setTitle(`Configurar Mensagem Automatica`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUAL MENSAGEM DESEJA RETIRAR?`)
                    .setPlaceholder(`Envie apenas numeros.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)



                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);


                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);



            }




            if (interaction.customId == 'systemantifake') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjsdua')
                    .setTitle(`Configurar anti fake`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`QUANTIDADE DE DIAS MÍNIMA PARA ENTRAR`)
                    .setPlaceholder(`Para desativar, deixe em branco. Serve para todos campos`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`LISTA DE STATUS QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os status das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(4000)

                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`LISTA DE NOMES QUE DESEJA BLOQUEAR`)
                    .setPlaceholder(`Digite separado por vírgual os nomes das contas que deseja punir se detectadas.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(4000)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'AdicionarNaAutorole') {

                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('wdawwadawwadwaroleaddautorole')
                            .setPlaceholder('Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE.')
                            .setMaxValues(20)
                    )

                interaction.editReply({ components: [select] })

            }


            if (interaction.customId == 'RemoverNaAutorole') {

                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const select = new ActionRowBuilder()
                    .addComponents(
                        new RoleSelectMenuBuilder()
                            .setCustomId('ereggbggbroleremoveautorole')
                            .setPlaceholder('Selecione abaixo qual será o CARGO vai dar AUTOMATICAMENTE.')
                            .setMaxValues(20)
                    )

                interaction.editReply({ components: [select] })

            }




            if (interaction.customId == 'autorole') {
                await interaction.deferUpdate()
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                autorole(interaction, client)


            }


            if (interaction.customId == 'boasveindas') {


                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()


                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju111idsjjsdua')
                    .setTitle(`Editar Boas Vindas`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`Mensagem`)
                    .setPlaceholder(`Insira aqui sua mensagem, use {member} para mencionar o membro e {guildname} para o servidor.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1000)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`TEMPO PARA APAGAR A MENSAGEM`)
                    .setPlaceholder(`Insira aqui a quantidade em segundos.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(6)


                const newnameboteN3 = new TextInputBuilder()
                    .setCustomId('qualcanal')
                    .setLabel(`QUAL CANAL VAI SER ENVIADO?`)
                    .setPlaceholder(`Insira aqui o ID do canal que vai enviar. (ID, ID, ID)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(200)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId == 'blockbank') {
                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                const gfgfggfg = General.get(`ConfigGeral.BankBlock`)

                var hhhh = ''
                for (const key in gfgfggfg) {
                    const element = gfgfggfg[key];
                    hhhh += `${element}`;
                    if (key !== Object.keys(gfgfggfg)[Object.keys(gfgfggfg).length - 1]) {
                        hhhh += ', ';
                    }
                }


                const modalaAA = new ModalBuilder()
                    .setCustomId('sdajuidsjjsdua')
                    .setTitle(`Bloquear Bancos`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel("BANCOS BLOQUEADOS")
                    .setPlaceholder(`bancos que deseja recusar separado por vírgula, ex: nu, mp, inter, neon, next, c6, banrisul, bs2`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(hhhh)
                    .setRequired(false)
                    .setMaxLength(1000)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);
            }



            if (interaction.customId == '+18porra') {

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return await interaction.deferUpdate()

                const modalaAA = new ModalBuilder()
                    .setCustomId('tokenMP')
                    .setTitle(`Alterar Token`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel("TOKEN: APP_USR-2837005141447972-076717-c37...")
                    .setPlaceholder("APP_USR-2837005141447972-076717-c37...")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(256)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                modalaAA.addComponents(firstActionRow3);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId == '-18porra') {
                const repliedMessage = await interaction.deferUpdate();

                var t = await uu.get(interaction.message.id)
                if (interaction.user.id !== t) return

                const fernandinhaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://api.barraapps.cloud/oauth/mp/${interaction.guild.id}`)
                            .setStyle(5)
                            .setLabel('Autorizar Mercado Pago'),
                        new ButtonBuilder()
                            .setCustomId('voltar1234sda')
                            .setStyle(1)
                            .setEmoji('⬅️')

                    )

                const forFormat = Date.now() + 10 * 60 * 1000
                const timestamp = Math.floor(forFormat / 1000)

                await repliedMessage.edit({ embeds: [], content: `Autorizar seu **Mercado Pago** á **Appsystems**\n\n**Status:** Aguardando você autorizar.\nEssa mensagem vai expirar em <t:${timestamp}:R>\n (Para autorizar, clique no botão abaixo, selecione 'Brasil' e clique em Continuar/Confirmar/Autorizar)`, components: [fernandinhaa] })
                var intervalVerifyToken = null;
                var tempoLimite = 5 * 60 * 1000;

                const veryfyToken = async () => {
                    try {
                        const response = await axios.get(`https://api.barraapps.cloud/oauth/mp/token/${interaction.guild.id}`, { headers: { authorization: "batata123"}});
                        const geral = response.data;

                        const token = geral.access_token;
                        console.log(token)

                        if (token){
                            clearInterval(intervalVerifyToken);
                            General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`, token)
                            General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessIdade`, 'menor')

                            const fernandinhaa = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('voltar1234sda')
                                        .setStyle(1)
                                        .setEmoji('⬅️')

                                )

                            await repliedMessage.edit({ content: `**Status:** ✅ Autorização bem sucedida!.`, components: [fernandinhaa], ephemeral: true })
                        }
                    }catch(e){
                        console.log("Erro ao verificar token!, tentando novamente ... " + e.message)
                    }
                };

                intervalVerifyToken = setInterval(veryfyToken, 5000);

                setTimeout(() => {
                    clearInterval(intervalVerifyToken);

                    const fernandinhaa = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('voltar1234sda')
                                .setStyle(1)
                                .setEmoji('⬅️')

                        )

                        repliedMessage.edit({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription('❌ | Você não se cadastrou durante 5 Minutos, cadastre-se novamente!')
                        ],
                        components: [fernandinhaa]
                    })

                }, tempoLimite);
            }

            if (interaction.customId == 'voltar1234sda') {
                await interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'vendastoggle') {
                await interaction.deferUpdate()
                UpdateStatusVendas(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'returnconfig') {
                await interaction.deferUpdate({ ephemeral: true })
                updateMessageConfig(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'closepanel') {
                await interaction.deferUpdate()
                interaction.message.delete()
            }

            if (interaction.customId == 'confirmpagament') {
                await interaction.deferUpdate({ ephemeral: true })
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigMP') {
                await interaction.deferUpdate()
                ConfigMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'returnUpdatePagamento') {
                await interaction.deferUpdate({ ephemeral: true })
                UpdatePagamento(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'PixMPToggle') {
                await interaction.deferUpdate()
                ToggeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'SiteMPToggle') {
                await interaction.deferUpdate()
                ToggeMP(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'TimePagament') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'TokenAcessMP') {
                ToggeMP(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SaldoToggle') {
                await interaction.deferUpdate()
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'BonusChange') {
                ToggleSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSaldo') {
                await interaction.deferUpdate()
                ConfigSaldo(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigSemiAuto') {
                await interaction.deferUpdate()
                ConfigSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ConfigCashBack') {
                await interaction.deferUpdate()
                ConfigCashBack(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoToggle') {
                await interaction.deferUpdate()
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'SemiautoPix') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'Semiautoqrcode') {
                ToggleSemiAuto(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'configbot') {
                await interaction.deferUpdate()
                configbot(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeName') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeAvatar') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeColorBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'AlterarBanner') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'AlterarMiniatura') {
                configbotToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeStatusBOT') {
                configbotToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'configchannels') {
                await interaction.deferUpdate()
                configchannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'vvconfigchannels') {
                await interaction.deferUpdate()
                configchannels(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelLogs') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelavaliar') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelentrada') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }
            if (interaction.customId == 'ChangeChannelsaida') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelLogsPublica') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }


            if (interaction.customId == 'ChangeChannelsugestao') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelCategoriaShop') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeCargoCliente') {
                await interaction.deferUpdate()
                configchannelsToggle(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'changetermos') {
                ConfigTermo(interaction, interaction.user.id, client)
            }
        }

        if (interaction.isChannelSelectMenu()) {
            if (interaction.customId == 'canallog') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canalticketdirect') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogpublica') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogsugestao') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }



            if (interaction.customId == 'ChangeChannelsaida') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelentrada') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'canallogavaliar') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

            if (interaction.customId == 'ChangeChannelCategoriaShop') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

        }
        if (interaction.isRoleSelectMenu()) {
            if (interaction.customId == 'ChangeCargoCliente') {
                await interaction.deferUpdate()
                CompletConfigChannels(interaction, interaction.user.id, client)
            }

        }
    }
}
