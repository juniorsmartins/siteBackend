import { NewsInputData } from "../schemas/news-schema";

export function newsFactory(override: Partial<NewsInputData> = {}): NewsInputData {
    return {
        "chapeu": "Chapéu Teste", 
        "titulo": "Título para testar validação mínima e máxima", 
        "linhaFina": "Linha Fina teste abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia", 
        "conteudo": "Conteúdo teste abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm", 
        "autor": "Autor teste", 
        "imagemUrl": "URL teste", 
        "imagemLegenda": "Legenda teste",
        "linkOriginal": "Link teste", 
        "destaquePrincipal": false, 
        "destaqueSecundario": false, 
        "editoria": "geral",
        ...override // Sobrescreve os valores padrão com os fornecidos no override
    }
}