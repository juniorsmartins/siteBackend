// Editorias disponíveis no sistema
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
