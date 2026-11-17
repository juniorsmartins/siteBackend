export class NewsGetService {

    public async buscarPorId(id: string): Promise<{ id: string }> {
        // Aqui você pode adicionar a lógica para buscar a notícia pelo ID no banco de dados
        console.log("Buscando notícia pelo ID: ", id);

        if (id == "10") {
            throw new Error("Notícia não encontrada");
        }

        return { id: id };
    }
}