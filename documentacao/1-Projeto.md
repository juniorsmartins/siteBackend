# PROJETO

## NODE 

### Conceitos relevantes

- Tensorflow.js: é uma biblioteca JavaScript para treinamento e implantação de modelos de aprendizado de máquina no navegador da Web e no Node.js.


### Criar projeto

```bash
# cria projeto Node (npm init -y / para criar sem fazer perguntas interativas)
npm init 

# instala a biblioteca do TensorFlow (pode precisar ter dependência aprovada no allowScripts do package.json)
npm install @tensorflow/tfjs-node
npm install @tensorflow/tfjs-node@4.22

```

### Comandos úteis

```bash
# lista versões do Node instaladas no notebook
nvm ls

# lista versões LTS disponíveis no repositório remoto para serem instaladas no notebook
nvm ls-remote --lts

# Vê qual versão do Node está ativa no notebook
node -v

# instala a versão do Node
nvm install <versão>
nvm install v22.23.5

# ativa a versão do Node. A troca vale só para o terminal atual, a não ser que você use nvm alias default.
nvm use 22

# define qual versão do Node estará ativa por padrão/default
nvm alias default 22
´´´

