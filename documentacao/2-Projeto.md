# PROJETO

**Descrição**: projeto de backend para site de notícias.


## NODE E EXPRESS

- **Node Package Manager (NPM)**: é o gerenciador do Node.js. É usado para instalar bibliotecas externas, gerenciar dependências, criar e rodar scripts e organizar projetos Node.js.

- **node_modules**: é o nome da pasta onde ficam armazenadas todas as bibliotecas e dependências instaladas pelo NPM. É criada após o "npm install" e contém todo o código das bibliotecas e pode ter subpastas internas (dependências das dependências). Essa pasta não deve ser enviada para o repositório remoto (avisar no gitignore).

- **Express.js**: é um framework minimalista e flexível para Node.js, que serve para criar servidores web, APIs e gerenciar rotas e requisições HTTP de forma rápida e organizada.


### Bibliotecas

- **Tensorflow.js**: é uma biblioteca JavaScript para treinamento e implantação de modelos de aprendizado de máquina no navegador da Web e no Node.js.

- **Zod**: biblioteca de validação. Pode definir esquemas para validar dados. Funciona em Node.js.

- ** **:


### Criar projeto

```bash
# cria projeto Node (npm init -y / para criar sem fazer perguntas interativas)
npm init 

# instala a biblioteca do TensorFlow (pode precisar ter dependência aprovada no allowScripts do package.json)
npm install @tensorflow/tfjs-node
npm install @tensorflow/tfjs-node@4.22

# instala o typescript na versão 6.0.3 e o types/node na versão 22 mais atual. Tudo como dependência dev (-D)
npm install typescript@6.0.3 @types/node@22 -D

# instala Express.js para rotas e requisições
npm install express

# instala types/express para o Typescript entender o código express
npm install -D @types/express 

# instala o Zod para Schema Validation
npm install zod

```


### Comandos úteis

´´´bash
# lista versões do Node instaladas no notebook
nvm ls

# lista versões LTS disponíveis no repositório remoto para serem instaladas no notebook
nvm ls-remote --lts

# Vê qual versão do Node está ativa no notebook
node -v

# instala a versão do Node
nvm install versão
nvm install v22.23.5

# ativa a versão do Node. A troca vale só para o terminal atual, a não ser que você use nvm alias default.
nvm use 22

# define qual versão do Node estará ativa por padrão/default
nvm alias default 22

# verifica qual é a versão estável mais recente do typescript
npm view typescript dist-tags

# verifica qual versão do Node é compatível com essa versão do typescript
npm view typescript@7.0.2 engines

# verifica quais as versões mais recentes do Typescript 6
npm view typescript@6 version

# verifica qual versão do types/node 22 será instalada (a última da lista - mais autual)
npm view @types/node@22 version

# verifica qual versão do typescript está instalada
npx tsc -v

# verifica qual versão do types/node está instalada
npm ls @types/node

# converte arquivo Typescript para Javascript
npx tsc src/server.ts

# gera arquivo de configuração do Typescript (tsconfig.json)
npx tsc --init





npm i tsx@4.16.2 -D
´´´


### Tratamento Global de Erros
´´´bash
# Tratador
error-handler.ts

# invólucro de erros
app-error.ts
´´´
