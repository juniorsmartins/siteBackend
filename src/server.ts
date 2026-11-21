import express from "express";
import { router } from "./routes/index.ts";
import { errorHandler } from "./error/handler-error.ts";
import { createDatabaseConnectionMiddleware } from "./middlewares/database-connection-middleware.ts";
import { connectMongoDB } from "./configs/connect-mongodb-config.ts";

const PORT = process.env.PORT || 3333;

const app = express(); /* Cria uma instância do aplicativo Express */

/* Middlewares Globais */
app.use(express.json()); /* Habilita o parsing de JSON no corpo das requisições */
app.use(createDatabaseConnectionMiddleware(connectMongoDB)); // Aplica o middleware de conexão com o banco de dados globalmente

/* Rotas */
app.use(router);

/* Middlewares Globais - tratamento de erros */
// Deve ser registrado após todas as rotas e outros middlewares.
app.use(errorHandler); 

/* Inicializa o servidor */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
