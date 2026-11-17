
export class NewsCreateService {

    public async criar(dadosNoticia: any): Promise<any> {

        const { chapeu, titulo, linhaFina, conteudo, autor, imagemUrl, imagemLegenda, 
            linkOriginal, destaquePrincipal, destaqueSecundario, editoria } = dadosNoticia;
        console.log(dadosNoticia);

        return { mensagem: 'Notícia criada com sucesso' };
    }
}