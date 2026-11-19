import { newsRepository } from '../../repositories/news-repository.ts';
import type { NewsLean } from '../../models/news-schema.ts';
import { AppError } from '../../error/app-error.ts';

export class NewsGetService {

    public async buscarPorId(id: string): Promise<NewsLean | null> {
        // Aqui você pode adicionar a lógica para buscar a notícia pelo ID no banco de dados
        console.log("Buscando notícia pelo ID: ", id);

        if (id == "10") {
            throw new Error("Notícia não encontrada");
        }

        const news = await newsRepository.buscarPorId(id);
        if (!news) {
            throw new AppError("Notícia não encontrada.", 404);
        }

        return news;
    }
}