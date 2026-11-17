import express from "express";
import { myMiddleware } from "./middlewares/my-middleware.ts";
import { router } from "./routes/index.ts";
import { errorHandler } from "./error/error-handler.ts";

const PORT = process.env.PORT || 3333;

const app = express(); /* Cria uma instância do aplicativo Express */

/* Middlewares Globais */
app.use(express.json()); /* Habilita o parsing de JSON no corpo das requisições */
app.use(myMiddleware); /* Aplica o middleware globalmente */

/* Rotas */
app.use(router);

/* Middlewares Globais - tratamento de erros */
// Deve ser registrado após todas as rotas e outros middlewares.
app.use(errorHandler); 

/* Inicializa o servidor */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
