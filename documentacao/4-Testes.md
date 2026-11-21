## TESTES

**vitest**: biblioteca para testes unitários - https://vitest.dev/guide/.

**supertest**: biblioteca pra simular requisições HTTP e validar códigos status, cabeçalhos e respostas JSON.

**mongodb-memory-server**: utilitário para testes de integração com MongoDB/Mongoose. Executa um servidor MongoDB na memória RAM da máquina de testes.


## Testes unitários e de integração

```bash
#instalar biblioteca de testes unitários
npm instal -D vitest

# instalar biblioteca de testes de integração
npm install -D supertest
npm install -D @types/supertest

# instalar banco em memória para testar MongoDB/Mongoose
npm install -D mongodb-memory-server
npm approve-scripts mongodb-memory-server

# levanta o banco de dados
mongodb-in-memory.ts

# gera dados para teste
factories.ts

# testes
news-integration.test.ts

```



