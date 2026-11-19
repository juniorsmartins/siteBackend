import mongoose from 'mongoose';
import type { InferSchemaType, Types } from 'mongoose';
import { EDITORIAS } from '../configs/constants-config.ts';

const noticiaSchema = new mongoose.Schema(
    {
        chapeu: { type: String, required: true },
        titulo: { type: String, required: true },
        linhaFina: { type: String, required: true },
        conteudo: { type: String, required: true },
        autor: { type: String, required: true },
        imagemUrl: { type: String, required: true },
        imagemLegenda: { type: String, default: "" },
        linkOriginal: { type: String, default: "" },
        destaquePrincipal: { type: Boolean, default: false },
        destaqueSecundario: { type: Boolean, default: false },
        editoria: { 
            type: String, 
            required: true, 
            enum: {
                values: EDITORIAS,
                message: '{VALUE} não é uma editoria válida.'
            }
        }
    },
    { timestamps: true } /* Habilita timestamps automáticos para createdAt e updatedAt */
);

noticiaSchema.index({ destaquePrincipal: -1, createdAt: -1 }); 
noticiaSchema.index({ destaqueSecundario: -1, createdAt: -1 });
noticiaSchema.index({ editoria: 1, createdAt: -1 });
noticiaSchema.index({ createdAt: -1 });
noticiaSchema.index({ linkOriginal: 1 });
noticiaSchema.index({ titulo: 1 });

export type NewsSchemaType = InferSchemaType<typeof noticiaSchema>;
export type NewsLean = NewsSchemaType & { _id: Types.ObjectId };
export type NewsCreateData =
    Pick<NewsSchemaType, 'chapeu' | 'titulo' | 'linhaFina' | 'conteudo' | 'autor' | 'imagemUrl' | 'editoria'> &
    Partial<Pick<NewsSchemaType, 'imagemLegenda' | 'linkOriginal' | 'destaquePrincipal' | 'destaqueSecundario'>>;

// Cria o modelo de notícia a partir do schema
const News = mongoose.model("Noticia", noticiaSchema);

export { News };
