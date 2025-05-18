const { JsonDatabase } = require("wio.db");

const Mensagens = new JsonDatabase({
    databasePath: "./databases/Mensagens.json",
});

const produtos = new JsonDatabase({
    databasePath: "./databases/produtos.json",
});

const General = new JsonDatabase({
    databasePath: "./databases/configallbots.json",
});

const PagamentosSaldos = new JsonDatabase({
    databasePath: "./databases/Saldos.json",
});

const Keys = new JsonDatabase({
    databasePath: "./databases/keys.json",
});

const estatisticas = new JsonDatabase({
    databasePath: "./databases/estatisticasprodutos.json",
});

const DefaultMessages = new JsonDatabase({
    databasePath: "./databases/DefaultMessages.json",
});

const Carrinho = new JsonDatabase({
    databasePath: "./databases/Carrinho.json",
});

const Cupom = new JsonDatabase({
    databasePath: "./databases/Cupom.json",
});

const Pagamentos = new JsonDatabase({
    databasePath: "./databases/Pagamentos.json",
});

const StatusCompras = new JsonDatabase({
    databasePath: "./databases/StatusCompras.json",
});

const RoleTime = new JsonDatabase({
    databasePath: "./databases/RoleTime.json",
});

const PainelVendas = new JsonDatabase({
    databasePath: "./databases/PainelVendas.json",
});

const giftcards = new JsonDatabase({
    databasePath: "./databases/giftcards.json",
});

const drops = new JsonDatabase({
    databasePath: "./databases/drops.json",
});

const usuariosinfo = new JsonDatabase({
    databasePath: "./databases/usuariosinfo.json",
});

const estatisticasgeral = new JsonDatabase({
    databasePath: "./databases/estatisticas.json",
});

const sugerir = new JsonDatabase({
    databasePath: "./databases/sugerir.json",
});

const invite = new JsonDatabase({
    databasePath: "./databases/invites.json",
});

const blacklist = new JsonDatabase({
    databasePath: "./databases/blacklist.json",
});

const entradas = new JsonDatabase({
    databasePath: "./databases/entradas.json",
});

module.exports = {
    Mensagens,
    drops,
    giftcards,
    General,
    PagamentosSaldos,
    Keys,
    produtos,
    estatisticas,
    DefaultMessages,
    Carrinho,
    Pagamentos,
    Cupom,
    StatusCompras,
    RoleTime,
    PainelVendas,
    usuariosinfo,
    estatisticasgeral,
    sugerir,
    invite,
    blacklist,
    entradas,
};
