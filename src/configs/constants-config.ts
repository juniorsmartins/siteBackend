export const EDITORIAS = [
    "geral",
    "política", 
    "esportes", 
    "entretenimento", 
    "tecnologia", 
    "saúde", 
    "economia", 
    "opinião", 
    "editorial", 
    "turismo", 
    "cultura",
    "polícia",
    "meio ambiente", 
    "internacional"
] as const;

export type Editoria = (typeof EDITORIAS)[number];

export const NEWS_RULES = Object.freeze({
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT_ITEMS_PER_PAGE: 20
    },
    HAT: {
        MIN: 2,
        MAX: 20
    },
    TITLE: {
        MIN: 30,
        MAX: 100
    },
    SUBHEADLINE: {
        MIN: 100,
        MAX: 200
    },
    CONTENT: {
        MIN: 500,
        MAX: 3000
    },
    AUTHOR: {
        MIN: 2,
        MAX: 50
    },
    IMAGE_URL: {
        MIN: 5
    },
    IMAGE_CAPTION: {
        MIN: 5,
        MAX: 80
    },
    LINK_ORIGINAL: {
        MIN: 5
    },
    SECTION: {
        MIN: 2,
        MAX: 20
    }
});

export const SITE_CONFIG = Object.freeze ({
    NOME: "Kortex News",
    SLOGAN: "Jornalismo tecnológico da nova era",
    FUNDADOR: "Junior Martins",
    CARGO_FUNDADOR: "Fundador & Diretor Geral",
    EMAIL_REDACAO: "gajeiro.jor@gmail.com",
    LOCALIZACAO_PADRAO: "Cuiabá - Mato Grosso, Brasil",
    HORARIO_ATENDIMENTO: "Segunda a Sexta, das 08h às 17h"
});
