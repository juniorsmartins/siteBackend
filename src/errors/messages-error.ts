import { NEWS_RULES } from "../configs/constants-config.ts"; 

export const MESSAGES_ERROR = Object.freeze({

    GENERAL: {
        DATA_VALIDATION_ERRORS: "Erros de validação de dados.",
        INVALID_ID: "ID em formato inválido.",
        INTERNAL_ERROR: "Ocorreu um erro interno no servidor. Tente novamente mais tarde."
    },

    PAGINATION: {
        NUM_PAGE_MUST_BE_INTEGER: "numPage deve ser número inteiro.",
        NUM_PAGE_MUST_BE_GREATER_THAN_ZERO: "numPage deve ser um número maior que 0.",
        NUM_PAGE_MAX: (max = NEWS_RULES.PAGINATION.NUM_PAGE_MAX) => `numPage deve ser no máximo ${max}.`,
        
        NUM_LIMIT_ITEMS_PER_PAGE_MUST_BE_INTEGER: "numLimitItemsPerPage deve ser número inteiro.",
        NUM_LIMIT_ITEMS_PER_PAGE_MUST_BE_GREATER_THAN_ZERO: "numLimitItemsPerPage deve ser um número maior que 0.",
        NUM_LIMIT_ITEMS_PER_PAGE_MAX: (max = NEWS_RULES.PAGINATION.NUM_LIMIT_ITEMS_PER_PAGE_MAX) => `numLimitItemsPerPage deve ser no máximo ${max}.`
    },

    NEWS: {
        NOT_FOUND: "Notícia não encontrada.", 
        FIELD_HAT_MIN_CARACTERES: (min = NEWS_RULES.HAT.MIN) => `O chapéu deve ter no mínimo ${min} caracteres.`,
        FIELD_HAT_MAX_CARACTERES: (max = NEWS_RULES.HAT.MAX) => `O chapéu deve ter no máximo ${max} caracteres.`,
        FIELD_TITLE_MIN_CARACTERES: (min = NEWS_RULES.TITLE.MIN) => `O título deve ter no mínimo ${min} caracteres.`,
        FIELD_TITLE_MAX_CARACTERES: (max = NEWS_RULES.TITLE.MAX) => `O título deve ter no máximo ${max} caracteres.`,
        FIELD_SUBHEADLINE_MIN_CARACTERES: (min = NEWS_RULES.SUBHEADLINE.MIN) => `O subtítulo deve ter no mínimo ${min} caracteres.`,
        FIELD_SUBHEADLINE_MAX_CARACTERES: (max = NEWS_RULES.SUBHEADLINE.MAX) => `O subtítulo deve ter no máximo ${max} caracteres.`,
        FIELD_CONTENT_MIN_CARACTERES: (min = NEWS_RULES.CONTENT.MIN) => `O conteúdo deve ter no mínimo ${min} caracteres.`,
        FIELD_CONTENT_MAX_CARACTERES: (max = NEWS_RULES.CONTENT.MAX) => `O conteúdo deve ter no máximo ${max} caracteres.`,
        FIELD_AUTHOR_MIN_CARACTERES: (min = NEWS_RULES.AUTHOR.MIN) => `O autor deve ter no mínimo ${min} caracteres.`,
        FIELD_AUTHOR_MAX_CARACTERES: (max = NEWS_RULES.AUTHOR.MAX) => `O autor deve ter no máximo ${max} caracteres.`,
        FIELD_IMAGE_URL_MIN_CARACTERES: (min = NEWS_RULES.IMAGE_URL.MIN) => `A URL da imagem deve ter no mínimo ${min} caracteres.`,
        FIELD_IMAGE_CAPTION_MIN_CARACTERES: (min = NEWS_RULES.IMAGE_CAPTION.MIN) => `A legenda da imagem deve ter no mínimo ${min} caracteres.`,
        FIELD_IMAGE_CAPTION_MAX_CARACTERES: (max = NEWS_RULES.IMAGE_CAPTION.MAX) => `A legenda da imagem deve ter no máximo ${max} caracteres.`,
        FIELD_LINK_ORIGINAL_MIN_CARACTERES: (min = NEWS_RULES.LINK_ORIGINAL.MIN) => `O link original deve ter no mínimo ${min} caracteres.`,
        FIELD_SECTION_MIN_CARACTERES: (min = NEWS_RULES.SECTION.MIN) => `A editoria deve ter no mínimo ${min} caracteres.`,
        FIELD_SECTION_MAX_CARACTERES: (max = NEWS_RULES.SECTION.MAX) => `A editoria deve ter no máximo ${max} caracteres.`
    }
});

