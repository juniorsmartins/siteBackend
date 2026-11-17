import express from "express";
import { myMiddleware } from "./middlewares/my-middleware.ts";
import { router } from "./routes/index.ts";
import { errorHandler } from "./error/error-handler.ts";
import { connectToMongoDB } from "./configs/connect-to-mongodb.ts";

const PORT = process.env.PORT || 3333;

const app = express(); /* Cria uma instância do aplicativo Express */

/* Middlewares Globais */
app.use(express.json()); /* Habilita o parsing de JSON no corpo das requisições */
app.use(myMiddleware); /* Aplica o middleware globalmente */

app.use(async (req, res, next) => {
    try {
        await connectToMongoDB(); // Conecta ao MongoDB antes de processar a requisição
        console.log("Conexão com o MongoDB estabelecida com sucesso.");
        next(); // Chama o próximo middleware ou rota após a conexão com o MongoDB ser estabelecida com sucesso

    } catch (error) {
        console.error("Erro na conexão com o MongoDB: ", error);
        res.status(500).json({ error: "Erro na conexão com o MongoDB" });
    }
})

/* Rotas */
app.use(router);

/* Middlewares Globais - tratamento de erros */
// Deve ser registrado após todas as rotas e outros middlewares.
app.use(errorHandler); 

/* Inicializa o servidor */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
