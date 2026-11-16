import express from "express";
import { myMiddleware } from "./middlewares/my-middleware.ts";
import { router } from "./routes/index.ts";

const PORT = process.env.PORT || 3333;

const app = express(); /* Cria uma instância do aplicativo Express */

/* Middlewares Globais */
app.use(express.json()); /* Habilita o parsing de JSON no corpo das requisições */
app.use(myMiddleware); /* Aplica o middleware globalmente */

/* Rotas */
app.use(router);

/* Inicializa o servidor */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});

function sum(a: number, b: number): number {
    return a + b;
}

const result = sum(2, 3);
console.log(result);