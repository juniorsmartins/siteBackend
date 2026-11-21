import { NewsCreateData } from "../schemas/news-schema";

export function newsCreateFactory(): NewsCreateData {
    return {
        "chapeu": "Chapéu Teste", 
        "titulo": "Título para testar validação mínima e máxima", 
        "linhaFina": "Linha Fina teste abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia", 
        "conteudo": "Conteúdo teste abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlmndaslhadoia abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm abcdefghijlm", 
        "autor": "Autor teste", 
        "imagemUrl": "URL teste", 
        "imagemLegenda": "Legenda teste",
        "linkOriginal": "Link teste", 
        "destaquePrincipal": false, 
        "destaqueSecundario": false, 
        "editoria": "geral"
    }
}