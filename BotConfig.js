
const { ButtonBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, EmbedBuilder, ActionRowBuilder, TextInputStyle, ComponentType, RoleSelectMenuBuilder, ChannelSelectMenuBuilder } = require('discord.js');
const { obterEmoji } = require('../Handler/EmojiFunctions');
const { General, blacklist } = require('../databases');
const readyFunction = require('../Eventos/teste/FunctionReady');

const { QuickDB } = require("quick.db");
const db = new QuickDB({ filePath: "databases/database.sqlite"});
var uu = db.table('permissionsmessage')


const editEmbed = {
    content: `⚠️ | Use o Comando Novamente!`,
    components: [],
    embeds: []
};

const editMessage = async (message) => {
    try {
        await message.edit(editEmbed).catch(e => null);
    } catch (error) {
        console.log(error)
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

async function updateMessageConfig(interaction, user, client) {

    const embed = new EmbedBuilder()
        .setTitle(`${obterEmoji(1)} | Painel de Configuração do bot`)
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? '#1e1f22' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${obterEmoji(1)} | Sistema de Vendas: ${General.get('ConfigGeral').Status}\n\n**Use os botões abaixo para configurar seu bot:**\n[Link Para Add o Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`)

    const status = General.get('ConfigGeral').Status


    let buttonColor

    if (status == 'ON') {
        buttonColor = 3
    } else if (status == 'OFF') {
        buttonColor = 4;
    }


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("vendastoggle")
                .setLabel('Vendas On/Off')
                .setEmoji(`1202610851056451654`)
                .setStyle(buttonColor)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("confirmpagament")
                .setLabel('Configurar Pagamento')
                .setEmoji(`1190299502377173025`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("configbot")
                .setLabel('Configurar Bot')
                .setEmoji(`1213804917123452928`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("configchannels")
                .setLabel('Configurar Canais')
                .setEmoji(`1237510909291663490`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changetermos")
                .setLabel('Configurar os Termos de compra')
                .setEmoji(`1257118195417092116`)
                .setStyle(1)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ButtonDuvidasPainel")
                .setLabel('Botão Dúvidas')
                .setEmoji(`1178347540756836363`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("SaldoInvitePainel")
                .setLabel('Personalizar Invite')
                .setEmoji(`🔗`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("configmoderacao")
                .setLabel('Configurar Moderação')
                .setEmoji(`1200629740420202686`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("BlackListPainel")
                .setLabel('Personalizar BlackList')
                .setEmoji(`1205483985644290058`)
                .setStyle(4)
                .setDisabled(false),)





    if (interaction.message == undefined) {
        await interaction.editReply({ embeds: [embed], components: [row, row2], fetchReply: true, ephemeral: true}).then(async (u) => {
            createCollector(u);

            const messages = await interaction.channel.messages.fetch({ limit: 1 });
            const lastMessage = messages.first();

            const fetch = await interaction.fetchReply()
            uu.set(fetch.id, user);

        }).catch(console.error);
    } else {

        var t = await uu.get(interaction.message.id)
        if (interaction.user.id !== t) return
        interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (u) => {
            createCollector(u);
        }).catch(e => null);
    }
}



async function configmoderacao(interaction, client) {



    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${obterEmoji(1)} **| Painel de Configuração Moderação**\n\nSelecione o Sistema que Deseja configurar:`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("autorole")
                .setLabel('Configurar Auto Role')
                .setEmoji(`1176326985052590132`)
                .setStyle(1)
                .setDisabled(false),

            // new ButtonBuilder()
            //     .setCustomId("automsgggs")
            //     .setLabel('Mensagem Automática')
            //     .setEmoji(`1157103148603818025`)
            //     .setStyle(1)
            //     .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("boasveindas")
                .setLabel('Configurar Boas Vindas')
                .setEmoji(`1160607683041308692`)
                .setStyle(1)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("systemantifake")
                .setLabel('Configurar Sistema Anti-Fake')
                .setEmoji(`1205483985644290058`)
                .setStyle(1)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] })



}





function BlackListPainel(interaction, client) {

    const ss = blacklist.fetchAll()

    if (ss.length <= 0) {
        blacklist.set(`BlackList.users`, [])
    }

    var fff = ``

    for (let i = 0; i < ss.length; i++) {
        const element = ss[i];
        const dd2 = element.data.users
        for (let iiiiii = 0; iiiiii < dd2.length; iiiiii++) {
            const element2 = dd2[iiiiii];
            if (element.data.users == 0) {

            } else {
                fff += `**ID: ${iiiiii + 1}** - <@${element2}> \`(${element2})\`\n`
            }
        }
    }

    if (fff !== ``) {
        fff = `Usuários que estão na BlackList:\n\n${fff}`
    } else {
        fff = `Nenhum usuário se encontra na BlackList!`
    }

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${fff}`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AdicionarNaBlacklist")
                .setLabel('Adicionar Membro na Black-List')
                .setEmoji(`1223710032001110086`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("RemoverNaBlacklist")
                .setLabel('Remover Membro na Black-List')
                .setEmoji(`1225171461036179549`)
                .setStyle(4)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] })
}


function SaldoInvitePainel(interaction, client) {


    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${obterEmoji(15)} **| Cargo Expecifico: ${General.get(`ConfigGeral.Convites.Cargo`) == null ? `Todos` : `<@&${General.get(`ConfigGeral.Convites.Cargo`)}>`}**\n\n${obterEmoji(18)} | Quanto de invite para ganhar saldo: ${Number(General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo') == null ? 2 : General.get('ConfigGeral.Convites.qtdinvitesresgatarsaldo'))}\n${obterEmoji(15)} | Quanto vai ganhar por cada invite: ${Number(General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites') == null ? 0.10 : General.get('ConfigGeral.Convites.QuantoVaiGanharPorInvites')).toFixed(2)}\n${obterEmoji(15)} | Status: ${General.get('ConfigGeral.Convites.Status') == null ? `Desativado!` : General.get('ConfigGeral.Convites.Status') == true ? `Ativado!` : `Desativado!`}`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("StatusConvites")
                .setLabel('Ativar/Desativar Convites')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("CargoExpecificoConvite")
                .setLabel('Cargo Especifico')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("SaldoporInvite")
                .setLabel('Quantos Saldos Por Invite')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("QuantosInvitesParaGanharSaldo")
                .setLabel('Quantos Invites Para Ganhar Saldo')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),


        )

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ResetarConvites")
                .setLabel('Resetar Configurações')
                .setEmoji(`1202610851056451654`)
                .setStyle(4)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),
        )

    interaction.editReply({ embeds: [embed], components: [row, row2], content: `` })

}


















async function UpdateStatusVendas(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    const currentStatus = General.get(`ConfigGeral.Status`);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    General.set(`ConfigGeral.Status`, newStatus);

    updateMessageConfig(interaction, user, client)
}

async function UpdatePagamento(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ iconURL: `${client.user.displayAvatarURL()}`, name: `${client.user.username}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`${obterEmoji(1)} | Painel de Configuração do bot`)
        .setDescription(`Selecione o Sistema que Deseja configurar:`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ConfigMP")
                .setLabel('Mercado Pago')
                .setEmoji(`1190299502377173025`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ConfigSaldo")
                .setLabel('Saldo')
                .setEmoji(`${obterEmoji(4)}`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ConfigSemiAuto")
                .setLabel('Pagamento Semiauto')
                .setEmoji(`1224797970885771325`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ConfigCashBack")
                .setLabel('Sistema Cashback')
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(1)
                .setDisabled(false),
        )



    interaction.editReply({ embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}


function blockbank(interaction, client) {

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`
Para bloquear um banco, clique abaixo.
    `)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("amoana")
                .setLabel('Configurar Bancos')
                .setStyle(1)
                .setDisabled(false)
        )



    interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}










async function ConfigMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`${obterEmoji(15)} **| Configurar Mercado Pago**`)
        .setDescription(`${obterEmoji(18)} | Pix: ${General.get('ConfigGeral').MercadoPagoConfig.PixToggle}\n${obterEmoji(15)} | Pagar pelo Site: ${General.get('ConfigGeral').MercadoPagoConfig.SiteToggle}\n🕗 | Tempo Máximo para pagar: ${General.get('ConfigGeral').MercadoPagoConfig.TimePagament} Minutos\n${obterEmoji(1)} | Access Token: ${General.get(`ConfigGeral.MercadoPagoConfig.TokenAcessIdade`) == 'menor' ? `|| Token de Menor ||` : `${General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP !== "" ? `\|\|${General.get('ConfigGeral').MercadoPagoConfig.TokenAcessMP}\|\|` : '|| Não configurado. ||'}`}`)

    const status = General.get('ConfigGeral').MercadoPagoConfig.PixToggle


    let buttonColor

    if (status == 'ON') {
        buttonColor = 3
    } else if (status == 'OFF') {
        buttonColor = 4;
    }

    const status2 = General.get('ConfigGeral').MercadoPagoConfig.SiteToggle


    let buttonColor2

    if (status2 == 'ON') {
        buttonColor2 = 3
    } else if (status2 == 'OFF') {
        buttonColor2 = 4;
    }


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("PixMPToggle")
                .setLabel('Pix ON/OFF')
                .setEmoji(`1237510909291663490`)
                .setStyle(buttonColor)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("SiteMPToggle")
                .setLabel('Site ON/OFF')
                .setEmoji(`1237510909291663490`)
                .setStyle(buttonColor2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("TimePagament")
                .setLabel('Tempo para Pagar')
                .setEmoji(`1170844151009509497`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("TokenAcessMP")
                .setLabel('Alterar Access Token')
                .setEmoji(`1190299502377173025`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("blockbank")
                .setLabel('Bloquear Banco')
                .setEmoji(`🏦`)
                .setStyle(4)
                .setDisabled(false),
        )

    const row2 = new ActionRowBuilder()
        .addComponents(


            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),
        )
    interaction.editReply({ embeds: [embed], components: [row, row2], content: `` }).then(async (u) => {
        createCollector(u);
    }).catch(e => null);

}

async function ToggeMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'PixMPToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = General.get(`ConfigGeral.MercadoPagoConfig.PixToggle`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        General.set(`ConfigGeral.MercadoPagoConfig.PixToggle`, newStatus);
        ConfigMP(interaction, user, client)
    }
    if (interaction.customId == 'SiteMPToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = General.get(`ConfigGeral.MercadoPagoConfig.SiteToggle`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        General.set(`ConfigGeral.MercadoPagoConfig.SiteToggle`, newStatus);
        ConfigMP(interaction, user, client)
    }

    if (interaction.customId == 'TimePagament') {
        if (interaction.user.id !== t) return await interaction.deferUpdate()

        const modalaAA = new ModalBuilder()
            .setCustomId('timeMP')
            .setTitle(`Alterar Tempo`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('timeMP')
            .setLabel("TEMPO: (ENTRE 5 A 20 MINUTOS)")
            .setPlaceholder("10")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(256)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);
    }

    if (interaction.customId == 'TokenAcessMP') {
        await interaction.deferUpdate()
        var t = await uu.get(interaction.message.id)
        if (interaction.user.id !== t) return

        const fernandinha = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`🤝 **| Alterar Acess Token**`)
        .setDescription(`Se a sua conta no Mercado Pago for de um menor de idade, opte pela segunda opção.`)

        const fernandona = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("+18porra")
                    .setLabel('Setar Acess Token')
                    .setEmoji(`1237510909291663490`)
                    .setStyle(1)
                    .setDisabled(false),
                new ButtonBuilder()
                    .setCustomId("-18porra")
                    .setLabel('Autenticar MercadoPago [-18]')
                    .setEmoji(`1203716650206232637`)
                    .setStyle(2)
                    .setDisabled(false),
                    new ButtonBuilder()
                    .setCustomId("voltar1234sda")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
                    
                    )

        interaction.editReply({ embeds: [fernandinha], components: [fernandona] })
    }
}

async function TimeMP(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    if (interaction.customId === 'timeMP') {
        let NewTime = interaction.fields.getTextInputValue('timeMP');

        await interaction.deferUpdate();

        if ( /^\d+$/.test(NewTime) && (NewTime >= 5 && NewTime <= 20) ) {
            General.set(`ConfigGeral.MercadoPagoConfig.TimePagament`, NewTime)
            ConfigMP(interaction, user, client)
        } else {
            await interaction.followUp({ content: `NEGADO: você inseriu em seus VALORES alguma letra ou um valor errado`, ephemeral: true })
            return
        }
    }
    const mercadopago = require('mercadopago')

    if (interaction.customId === 'tokenMP') {
        const tokenMP = interaction.fields.getTextInputValue('tokenMP');
        try {
            const dsdasda = '10'; 

            const payment_data = {
                transaction_amount: parseFloat(dsdasda),
                description: 'Testando se o token é Válido | Appsystems',
                payment_method_id: 'pix',
                payer: {
                    email: 'stormappsrecebimentos@gmail.com',
                    first_name: 'Victor André',
                    last_name: 'Ricardo Almeida',
                    identification: {
                        type: 'CPF',
                        number: '15084299872',
                    },
                    address: {
                        zip_code: '86063190',
                        street_name: 'Rua Jácomo Piccinin',
                        street_number: '971',
                        neighborhood: 'Pinheiros',
                        city: 'Londrina',
                        federal_unit: 'PR',
                    },
                },
            };

            mercadopago.configurations.setAccessToken(tokenMP); 
            await mercadopago.payment.create(payment_data);

           
        } catch (error) {

            await interaction.reply({
                content: `⚠️ | Access Token inválido!\n${error}\n\n> Tutorial para pegar o Access Token: [CliqueAqui](https://www.youtube.com/watch?v=w7kyGZUrkVY&feature=youtu.be)\n> Lembre-se de cadastrar uma chave pix na sua conta mercado pago!`,
                ephemeral: true,
            });

            return
        }

        interaction.deferUpdate()
        ConfigMP(interaction, user, client)
        General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessMP`, tokenMP);
        General.set(`ConfigGeral.MercadoPagoConfig.TokenAcessIdade`, 'maior');
    }


}

async function ConfigSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`${obterEmoji(4)} **| Configurar Sistema de Saldo**`)
        .setDescription(`Sistema de Saldo: ${General.get('ConfigGeral').SaldoConfig.SaldoStatus}\nBônus por depósito: ${General.get('ConfigGeral').SaldoConfig.Bonus}%\nValor mínimo para depósito: R$${General.get('ConfigGeral').SaldoConfig.ValorMinimo}`)

    const status = General.get('ConfigGeral').SaldoConfig.SaldoStatus
    let buttonColor
    if (status == 'ON') {
        buttonColor = 3
    } else if (status == 'OFF') {
        buttonColor = 4
    }

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("SaldoToggle")
                .setLabel('Saldo ON/OFF')
                .setEmoji(`1237510909291663490`)
                .setStyle(buttonColor)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("BonusChange")
                .setLabel('Bônus por Depósito')
                .setEmoji(`1237510909291663490`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(e => null);
}

async function ToggleSaldo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'SaldoToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = General.get(`ConfigGeral.SaldoConfig.SaldoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        General.set(`ConfigGeral.SaldoConfig.SaldoStatus`, newStatus);
        ConfigSaldo(interaction, user, client)

    }

    if (interaction.customId == 'BonusChange') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('bonusSaldo')
            .setTitle(`💰 | Bônus por depósito`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('bonusSaldo')
            .setLabel("PORCENTAGEM DO BÔNUS")
            .setPlaceholder("10")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('bonusPorcent')
            .setLabel("VALOR MÍNIMO DE DEPÓSITO")
            .setPlaceholder("5")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(3)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow3, firstActionRow2);
        await interaction.showModal(modalaAA);

    }
}

async function bonusSaldo(interaction, user, client) {
    await interaction.deferUpdate()

    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'bonusSaldo') {

        const bonusSaldo = interaction.fields.getTextInputValue('bonusSaldo');
        const bonusPorcent = interaction.fields.getTextInputValue('bonusPorcent');
        const hasLetters1 = /[a-zA-Z]/.test(bonusSaldo);
        const hasLetters2 = /[a-zA-Z]/.test(bonusPorcent);

        if (hasLetters1 || hasLetters2) {
            await interaction.followUp({ content: `ERROR: você inseriu em seus VALORES alguma letra`, ephemeral: true });
            return;
        }

        if (bonusSaldo > 100) {
            await interaction.followUp({ content: `ERROR: você não pode inserir valor MAIOR que 100`, ephemeral: true });
            return;
        }

        General.set(`ConfigGeral.SaldoConfig.ValorMinimo`, bonusPorcent);
        General.set(`ConfigGeral.SaldoConfig.Bonus`, bonusSaldo);
        await interaction.followUp({ content: `✅ | Bônus por depósito: ${bonusSaldo}%\n✅ | Valor mínimo de depósito: R$${bonusPorcent}`, ephemeral: true });
        await ConfigSaldo(interaction, user, client);
    }
}

async function ConfigSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setTitle(`🛠️ **| Sistema de Pagamento Semi Automático.**`)
        .setDescription(`${obterEmoji(1)} | Sistema: ${General.get('ConfigGeral').SemiAutoConfig.SemiAutoStatus}\n${obterEmoji(18)} | Chave Pix: ${General && General.get('ConfigGeral') ? General.get('ConfigGeral').SemiAutoConfig.pix || 'Não Configurado' : 'Não Configurado'}\n📋 | Qr Code: ${General && General.get('ConfigGeral') ? `[Qr Code](${General && General.get('ConfigGeral').SemiAutoConfig.qrcode})` || 'Não Configurado' : 'Não Configurado'}`)

    const status2 = General.get('ConfigGeral').SemiAutoConfig.SemiAutoStatus


    let buttonColor2

    if (status2 == 'ON') {
        buttonColor2 = 3
    } else if (status2 == 'OFF') {
        buttonColor2 = 4;
    }


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("SemiautoToggle")
                .setLabel('Semiauto ON/OFF')
                .setEmoji(`1237510909291663490`)
                .setStyle(buttonColor2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("SemiautoPix")
                .setLabel('Chave Pix')
                .setEmoji(`1213543527196131388`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("Semiautoqrcode")
                .setLabel('Qr Code')
                .setEmoji(`1238271183523156029`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function ToggleSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)

    if (interaction.customId == 'SemiautoToggle') {
        if (interaction.user.id !== t) return
        const currentStatus = General.get(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`);
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        General.set(`ConfigGeral.SemiAutoConfig.SemiAutoStatus`, newStatus);
        ConfigSemiAuto(interaction, user, client)

    }
    if (interaction.customId == 'SemiautoPix') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('SemiautoPix')
            .setTitle(`Alterar Chave Pix`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('TypePix')
            .setLabel("TIPO DA CHAVE:")
            .setPlaceholder("Email, Cpf, Aleatória, ETC.")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('Pix')
            .setLabel("CHAVE:")
            .setPlaceholder("keven.mto@hotmail.com")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow2 = new ActionRowBuilder().addComponents(newnameboteN2);
        modalaAA.addComponents(firstActionRow3, firstActionRow2);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'Semiautoqrcode') {
        if (interaction.user.id !== t) return interaction.deferUpdate()
        const modalaAA = new ModalBuilder()
            .setCustomId('Semiautoqrcode')
            .setTitle(`Alterar QR CODE`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('Semiautoqrcode')
            .setLabel("LINK QRCODE:")
            .setPlaceholder("Link do QRCODE.")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }
}

async function PixChangeSemiAuto(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'SemiautoPix') {
        await interaction.deferUpdate()

        const TypePix = interaction.fields.getTextInputValue('TypePix');
        const Pix = interaction.fields.getTextInputValue('Pix');

        General.set(`ConfigGeral.SemiAutoConfig.typepix`, TypePix);
        General.set(`ConfigGeral.SemiAutoConfig.pix`, Pix);
        await ConfigSemiAuto(interaction, user, client);
        interaction.followUp({ content: `✅ | Chave Pix: ${Pix}\n✅ | Tipo da Chave: ${TypePix}`, ephemeral: true });
    }

    if (interaction.customId === 'Semiautoqrcode') {
        await interaction.deferUpdate()
        const Semiautoqrcode = interaction.fields.getTextInputValue('Semiautoqrcode');

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(Semiautoqrcode)) {
            General.set(`ConfigGeral.SemiAutoConfig.qrcode`, Semiautoqrcode);
            await interaction.followUp({ content: `✅ | Qr Code: [Qr Code](${Semiautoqrcode})`, ephemeral: true });
        } else {
            await interaction.followUp({ content: `ERROR: Você inseriu um LINK de imagem QRCODE invalido`, ephemeral: true });
        }
        ConfigSemiAuto(interaction, user, client);
    }
}


async function configbot(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`Nome Atual: **${client.user.username}**\nAvatar Atual: [Avatar](${client.user.displayAvatarURL()})\nCor Padrão do Bot Atual: ${General.get('ConfigGeral').ColorEmbed}\nBanner Default do BOT: ${General.get('ConfigGeral.BannerEmbeds') == null ? `Não definido!` : `[Banner](${General.get('ConfigGeral.BannerEmbeds')})`}\nMiniatura Default do BOT: ${General.get('ConfigGeral.MiniaturaEmbeds') == null ? `Não definido!` : `[Miniatura](${General.get('ConfigGeral.MiniaturaEmbeds')})`}\n\n**Você pode configurar o bot usando os botões abaixo:**`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeName")
                .setLabel('Alterar Nome')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeAvatar")
                .setLabel('Alterar Avatar')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeColorBOT")
                .setLabel('Alterar Cor Padrão do bot')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeStatusBOT")
                .setLabel('Alterar o Status do bot')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
        )


    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AlterarBanner")
                .setLabel('Alterar Banner')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("AlterarMiniatura")
                .setLabel('Alterar Miniatura')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    await interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function configbotToggle(interaction, user, client) {

    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return interaction.deferUpdate()

    if (interaction.customId == 'ChangeName') {

        const modalaAA = new ModalBuilder()
            .setCustomId('newnamebot')
            .setTitle(`Alterar Nome Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('newnamebot')
            .setLabel("NOVO NOME:")
            .setPlaceholder("Novo Nome")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeAvatar') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeAvatar')
            .setTitle(`Alterar Avatar Do BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeAvatar')
            .setLabel("LINK AVATAR:")
            .setPlaceholder("NOVO AVATAR")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeColorBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeColorBOT')
            .setTitle(` | Alterar COR do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('ChangeColorBOT')
            .setLabel("Nova Cor do seu Bot. (Hexadecimal):")
            .setPlaceholder("#FF0000, #FF69B4, #FF1493")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'AlterarBanner') {

        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarBanner')
            .setTitle(` | Alterar Banner do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('editpainelBanner')
            .setLabel("LINK BANNER:")
            .setPlaceholder("NOVO BANNER")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId.startsWith('AlterarMiniatura')) {
        const t = await uu.get(interaction.message.id)
        const modalaAA = new ModalBuilder()
            .setCustomId('AlterarMiniatura')
            .setTitle(` | Alterar Miniatura do Painel`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('AlterarMiniatura')
            .setLabel("LINK DA MINIATURA:")
            .setPlaceholder("NOVO MINIATURA")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        modalaAA.addComponents(firstActionRow3);
        await interaction.showModal(modalaAA);

    }

    if (interaction.customId == 'ChangeStatusBOT') {

        const modalaAA = new ModalBuilder()
            .setCustomId('ChangeStatusBOT')
            .setTitle(`Alterar Status do seu BOT`);

        const newnameboteN = new TextInputBuilder()
            .setCustomId('typestatus')
            .setLabel("ESCOLHA O TIPO DE PRESENÇA:")
            .setPlaceholder("Online, Ausente, Invisivel ou Não Pertubar")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN2 = new TextInputBuilder()
            .setCustomId('ativistatus')
            .setLabel("ESCOLHA O TIPO DE ATIVIDADE:")
            .setPlaceholder("Jogando, Assistindo, Competindo, Transmitindo, Ouvindo")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN3 = new TextInputBuilder()
            .setCustomId('textstatus')
            .setLabel("ESCREVA O TEXTO DA ATIVIDADE:")
            .setPlaceholder("Vendas Automáticas")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        const newnameboteN4 = new TextInputBuilder()
            .setCustomId('urlstatus')
            .setLabel("URL DO CANAL:")
            .setPlaceholder("Se a escolha foi Transmitindo, Coloque a Url aqui, ex: https://barraapps.cloud/")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)

        const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
        const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
        const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN3);
        const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN4);
        modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
        await interaction.showModal(modalaAA);

    }

}

async function FunctionCompletConfig(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'newnamebot') {
        const newnamebot = interaction.fields.getTextInputValue('newnamebot');

        await interaction.deferUpdate({ephemeral: true, content: `Alterando o Nome do BOT...`});
        try {
            await client.user.setUsername(newnamebot)
            await configbot(interaction, user, client)
        } catch (error) {
            await interaction.followUp({ ephemeral: true, content: `ERROR: Sua alteração de NOME falhou, Possiveis motivos: Nome inapropriado, Maximo de caracterias, Nome Generico, Alteração Recente;` })
        }
    }

    if (interaction.customId === 'ChangeAvatar') {
        const ChangeAvatar = interaction.fields.getTextInputValue('ChangeAvatar');

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(ChangeAvatar)) {
            await interaction.deferUpdate({ ephemeral: true, content: `Alterando o Avatar do BOT...` });

            try {
                await client.user.setAvatar(`${ChangeAvatar}`)
                await configbot(interaction, user, client)
            } catch (error) {
                await interaction.followUp({ ephemeral: true, content: `ERROR: ocorreu algum erro interno na API do BOT, ou você está alterando muito rapidamente o seu AVATAR.;` })
            }
        } else {
            await interaction.followUp({ ephemeral: true, content: `ERROR: Você inseriu um AVATAR invalido para seu BOT;` })
        }
    }
    if (interaction.customId === 'ChangeColorBOT') {
        const ChangeColorBOT = interaction.fields.getTextInputValue('ChangeColorBOT');

        var regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        var isHexadecimal = regex.test(ChangeColorBOT);

        await interaction.deferUpdate()
        if (isHexadecimal) {
            General.set(`ConfigGeral.ColorEmbed`, ChangeColorBOT)
            await configbot(interaction, user, client)
        } else {
            await interaction.followUp({ ephemeral: true, content: `ERROR: Você inseriu um COR diferente de HexaDecimal;` })
        }
    }

    if (interaction.customId === 'AlterarMiniatura') {
        await interaction.deferUpdate()

        const AlterarMiniatura = interaction.fields.getTextInputValue('AlterarMiniatura');
        if (AlterarMiniatura == ``) {
            General.delete(`ConfigGeral.MiniaturaEmbeds`)
            await configbot(interaction, user, client)
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarMiniatura)) {
            await interaction.followUp({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou a MINIATURA do seu Produto.` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
            General.set(`ConfigGeral.MiniaturaEmbeds`, AlterarMiniatura)
            configbot(interaction, user, client)
        } else {
            await interaction.followUp({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu uma MINIATURA invalido para seu BOT;` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
        }

    }

    if (interaction.customId === 'AlterarBanner') {
        const AlterarBanner = interaction.fields.getTextInputValue('editpainelBanner');
        await interaction.deferUpdate();

        if (AlterarBanner == ``) {
            General.delete(`ConfigGeral.BannerEmbeds`)
            await configbot(interaction, user, client)
            return
        }

        const url = /((([(https)(http)]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        if (url.test(AlterarBanner)) {

            await interaction.followUp({ ephemeral: true, content: `${obterEmoji(8)} | Você alterou o BANNER do seu BOT.` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
            General.set(`ConfigGeral.BannerEmbeds`, AlterarBanner)
            await configbot(interaction, user, client)

        } else {
            await interaction.followUp({ ephemeral: true, content: `${obterEmoji(22)} | Você inseriu um BANNER invalido para seu BOT;` }).then(msg => {
                setTimeout(async () => {
                    try {
                        await msg.delete()
                    } catch (error) {

                    }
                }, 3000);
            })
        }
    }


    if (interaction.customId === 'ChangeStatusBOT') {
        const typestatus = interaction.fields.getTextInputValue('typestatus');
        const ativistatus = interaction.fields.getTextInputValue('ativistatus');
        const textstatus = interaction.fields.getTextInputValue('textstatus');
        const urlstatus = interaction.fields.getTextInputValue('urlstatus');

        if (typestatus !== 'Online' && typestatus !== 'Ausente' && typestatus !== 'Invisível' && typestatus !== 'Não Perturbar') return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu um TIPO incorreto de STATUS;` })
        if (ativistatus !== "Jogando" && ativistatus !== "Assistindo" && ativistatus !== "Competindo" && ativistatus !== "Transmitindo" && ativistatus !== "Ouvindo") return interaction.reply({ ephemeral: true, content: `ERROR: Você inseriu uma ATIVIDADE incorreto de STATUS;` })
        if (ativistatus == "Transmitindo") {
            if (urlstatus == "") {
                interaction.reply({ ephemeral: true, content: `❌ | Você não colocou um link.` })
                return
            }
        }


        General.set(`ConfigGeral.StatusBot.typestatus`, typestatus)
        General.set(`ConfigGeral.StatusBot.ativistatus`, ativistatus)
        General.set(`ConfigGeral.StatusBot.textstatus`, textstatus)

        interaction.reply({ content: `CERTO: Você alterou com sucesso o STATUS de seu BOT`, ephemeral: true })

        if (urlstatus !== "") {
            General.set(`ConfigGeral.StatusBot.urlstatus`, urlstatus)
        }

        readyFunction.updateRichPresence(client)

    }
}




function ButtonDuvidasPainel(interaction, client) {

    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`Status Dúvidas: ${General.get(`ConfigGeral.statusduvidas`) == null ? `\`Desativado!\`` : General.get(`ConfigGeral.statusduvidas`) == true ? `\`Ativado!\`` : `\`Desativado!\``}\nCanal de Redirecionamento: ${General.get(`ConfigGeral.channelredirectduvidas`) == null ? `\`Não definido\`` : `${General.get(`ConfigGeral.channelredirectduvidas`)}`}\nTexto Button: \`${General.get(`ConfigGeral.textoduvidas`) == null ? `Dúvida` : General.get(`ConfigGeral.textoduvidas`)}\`\nEmoji: ${General.get(`ConfigGeral.emojiduvidas`) == null ? `🔗` : General.get(`ConfigGeral.emojiduvidas`)}`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("StatusDuvidas")
                .setLabel('Ativar/Desativar Button Dúvidas')
                .setEmoji(`1202610851056451654`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changechannelredirecionamento")
                .setLabel('Alterar Canal de Redirecionamento')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changetextoduvidas")
                .setLabel('Alterar Texto Button')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("changeemojiduvidas")
                .setLabel('Alterar Emoji Button')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),
        )

    interaction.editReply({ embeds: [embed], components: [row], content: `` })

}


async function configchannels(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setDescription(`Canal de Logs Adm Atual: ⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`)}>` : 'Não Definido'}\nCanal Logs Públicas Atual: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`)}>` : 'Não Definido'}\nCanal avaliação Atual: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`)}>` : 'Não Definido'}\nCanal Sugestão Atual: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`)}>` : 'Não Definido'}\nCategoria de Carrinhos Atual: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)}>` : 'Não Definido'}\nCargo de Cliente Atual: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.CargoCliente`) != null ? `<@&${General.get(`ConfigGeral.ChannelsConfig.CargoCliente`)}>` : 'Não Definido'}\nStatus Logs Carrinho: ${General.get(`ConfigGeral.statuslogcompras`) == null ? 'Ativado!' : General.get(`ConfigGeral.statuslogcompras`) == true ? 'Ativado!' : `Desativado!`}\nCanal de Entrada: ${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`) ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`)}>` : "Não definido"}\nCanal de Saida: ${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`) ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`)}>` : "Não definido"} \n\n**Você pode configurar os canais usando os botões abaixo:**`)


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeChannelLogs")
                .setLabel('Alterar Canal de Logs Adm')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeChannelLogsPublica")
                .setLabel('Alterar Canal Logs Públicas')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeChannelCategoriaShop")
                .setLabel('Alterar Categoria dos Carrinho')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeCargoCliente")
                .setLabel('Alterar Cargo de Cliente')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("desativarlogcarrinhos")
                .setLabel('Desativar/Ativar Logs Carrinhos')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),)

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("ChangeChannelsugestao")
                .setLabel('Alterar Canal de Sugestão')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("ChangeChannelavaliar")
                .setLabel('Alterar Canal Avaliação')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("ChangeChannelentrada")
                .setLabel('Alterar Canal Entrada')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),

            new ButtonBuilder()
                .setCustomId("ChangeChannelsaida")
                .setLabel('Alterar Canal Saida')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),



            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),
        )

    interaction.editReply({ embeds: [embed], components: [row, row2] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}


async function configchannelsToggle(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return

    if (interaction.customId == 'ChangeChannelTicket') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelTicket`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canalticketdirect')
                    .setPlaceholder('Selecione abaixo qual é seu canal de TICKET.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }



    if (interaction.customId == 'ChangeChannelLogs') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelLogAdm`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallog')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de log ADM.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelLogsPublica') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelLogPublica`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogpublica')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de log Publica.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelsugestao') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelSugestao`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogsugestao')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Sugestão.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }

    if (interaction.customId == 'ChangeChannelavaliar') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelAvaliar`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('canallogavaliar')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Avaliação.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }




    if (interaction.customId == 'ChangeChannelentrada') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelentrada')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Entrada.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }


    if (interaction.customId == 'ChangeChannelsaida') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Canal Definido: ⁠⁠${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelsaida')
                    .setPlaceholder('Selecione abaixo qual será o CANAL de Saida.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildText)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }






    if (interaction.customId == 'ChangeChannelCategoriaShop') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Categoria Definida: ⁠${General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`) != null ? `<#${General.get(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('ChangeChannelCategoriaShop')
                    .setPlaceholder('Selecione abaixo qual será a CATEGORIA de seus CARRINHOS.')
                    .setMaxValues(1)
                    .addChannelTypes(ChannelType.GuildCategory)
            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }
    if (interaction.customId == 'ChangeCargoCliente') {
        const embed = new EmbedBuilder()
            .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
            .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription(`Categoria Definida: ⁠${General.get(`ConfigGeral.ChannelsConfig.CargoCliente`) != null ? `<@&${General.get(`ConfigGeral.ChannelsConfig.CargoCliente`)}>` : 'Não Definido'}`)


        const select = new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('ChangeCargoCliente')
                    .setPlaceholder('Selecione abaixo qual cargo será setado aos CLIENTES.')
                    .setMaxValues(1)

            )

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("vvconfigchannels")
                    .setLabel('Voltar')
                    .setEmoji(`⬅️`)
                    .setStyle(2)
                    .setDisabled(false),
            )
        interaction.editReply({ components: [select, row2], embeds: [embed] }).then(async (u) => {
            createCollector(u);
        }).catch(console.error);
    }
}

async function CompletConfigChannels(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId == 'canallog') {

        General.set(`ConfigGeral.ChannelsConfig.ChannelLogAdm`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'canallogpublica') {
        General.set(`ConfigGeral.ChannelsConfig.ChannelLogPublica`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeChannelentrada') {
        General.set(`ConfigGeral.ChannelsConfig.ChangeChannelentrada`, interaction.values[0])
        configchannels(interaction, user, client)
    }
    if (interaction.customId == 'ChangeChannelsaida') {
        General.set(`ConfigGeral.ChannelsConfig.ChangeChannelsaida`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'canalticketdirect') {
        General.set(`ConfigGeral.ChannelsConfig.ChannelTicket`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'canallogsugestao') {
        General.set(`ConfigGeral.ChannelsConfig.ChannelSugestao`, interaction.values[0])
        configchannels(interaction, user, client)
    }


    if (interaction.customId == 'canallogavaliar') {
        General.set(`ConfigGeral.ChannelsConfig.ChannelAvaliar`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeChannelCategoriaShop') {

        General.set(`ConfigGeral.ChannelsConfig.ChannelCategoriaShop`, interaction.values[0])
        configchannels(interaction, user, client)
    }

    if (interaction.customId == 'ChangeCargoCliente') {

        General.set(`ConfigGeral.ChannelsConfig.CargoCliente`, interaction.values[0])
        configchannels(interaction, user, client)
    }
}


async function ConfigTermo(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return interaction.deferUpdate()

    const modalaAA = new ModalBuilder()
        .setCustomId('newtermocompra')
        .setTitle(`🔧 | Alterar Termos De Compra`);

    const newnameboteN = new TextInputBuilder()
        .setCustomId('newtermocompra')
        .setLabel("TERMOS DE COMPRA:")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)

    const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
    modalaAA.addComponents(firstActionRow3);
    await interaction.showModal(modalaAA);
}
async function ConfigTermoConfig(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    if (interaction.customId === 'newtermocompra') {
        const newtermocompra = interaction.fields.getTextInputValue('newtermocompra');
        interaction.reply({
            ephemeral: true,
            content: `CERTO: Você alterou o TERMO de comprade sua LOJA.
        
**${newtermocompra}**`
        })

        General.set(`ConfigGeral.TermosCompra`, newtermocompra)
        updateMessageConfig(interaction, user, client)
    }
}

function ConfigCashBack(interaction, user, client) {
    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .setDescription(`${obterEmoji(1)} | Sistema de Cash-Back: ${General.get(`ConfigGeral.CashBack.ToggleCashBack`) == null ? 'OFF' : General.get(`ConfigGeral.CashBack.ToggleCashBack`)}\n${obterEmoji(16)} | Porcentagem: ${General.get(`ConfigGeral.CashBack.Porcentagem`) == null ? '0' : General.get(`ConfigGeral.CashBack.Porcentagem`)}%\n\n**Você pode configurar o bot usando os botões abaixo:**`)

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("cashtoggle")
                .setLabel('Cash-Back On/Off')
                .setEmoji(`1202610851056451654`)
                .setStyle(1)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("configurarporcentagemcashback")
                .setLabel('Configurar Porcentagem')
                .setEmoji(`1190299502377173025`)
                .setStyle(2)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnUpdatePagamento")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] }).then(async (u) => {
        createCollector(u);
    }).catch(console.error);
}

async function UpdateCashBack(interaction, user, client) {
    var t = await uu.get(interaction.message.id)
    if (interaction.user.id !== t) return
    const currentStatus = General.get(`ConfigGeral.CashBack.ToggleCashBack`);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    General.set(`ConfigGeral.CashBack.ToggleCashBack`, newStatus);

    ConfigCashBack(interaction, user, client)
}







function autorole(interaction, client) {

    const gawawg2 = General.get(`ConfigGeral.AutoRole.add`)

    var cargosadd = ''
    if (gawawg2 !== null) {
        for (const add of gawawg2) {
            cargosadd += `<@&${add}>\n`
        }
    } else {
        cargosadd = `Nenhum Cargo Definido!`
    }



    const embed = new EmbedBuilder()
        .setColor(General.get(`ConfigGeral.ColorEmbed`) == '#635b44' ? 'Random' : `${General.get(`ConfigGeral.ColorEmbed`)}`)
        .setAuthor({ name: ` ${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
        .setThumbnail(`${client.user.displayAvatarURL()}`)
        .addFields(
            { name: `Cargos Automáticos:`, value: `${cargosadd}` }
        )


    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("AdicionarNaAutorole")
                .setLabel('Adicionar Cargo Ao Entrar')
                .setEmoji(`1223710032001110086`)
                .setStyle(3)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId("returnconfig")
                .setLabel('Voltar')
                .setEmoji(`⬅️`)
                .setStyle(2)
                .setDisabled(false),)

    interaction.editReply({ embeds: [embed], components: [row] })
}


module.exports = {
    updateMessageConfig,
    UpdateStatusVendas,
    UpdatePagamento, ConfigMP,
    ToggeMP,
    TimeMP,
    ConfigSaldo,
    ToggleSaldo,
    bonusSaldo,
    ConfigSemiAuto,
    ConfigCashBack,
    ToggleSemiAuto,
    PixChangeSemiAuto,
    configbot,
    configbotToggle,
    FunctionCompletConfig,
    configchannels,
    configchannelsToggle,
    CompletConfigChannels,
    ConfigTermo,
    UpdateCashBack,
    ConfigTermoConfig,
    ButtonDuvidasPainel,
    SaldoInvitePainel,
    BlackListPainel,
    configmoderacao,
    autorole
};