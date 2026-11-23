# IA Aplicada

**Descrição**:

## Conceitos

**LLMs (Large Language Model)**:

**GPT (Generative Pre-Trained Transformer)**:

    **Generative (gerador)**: gera texto token por token.
    **Pre-trained (pré-treinado)**: treinado com quantidade enorme de texto para aprender padrões da linguagem. 
    **Transformer**: é a arquitetura famosa por conseguir prestar atenção em partes importantes do texto (attention).

**Tokenização**: 

**Embeddings**: capturam similaridade e relacionamento. Embeddings representam palavras como vetores, e a posição desses vetores é moldada pelo contexto semântico: palavras que aparecem em contextos parecidos, ficam próximas. Os Embeddings colocam palavras/tokens no espaço numérico com semântica. 

**Transformer**: processa contexto. É o cérebro do LLM. Transformer pega os vetores e cria versões contextualizadas.

**Temperature**: controla o grau de aleatoriedade na seleção de tokens. Temperaturas mais altas podem levar a resultados mais aleatórios e temperaturas mais baixas para resultados mais determinísticos (método Greedy - escolhe sempre o token mais provável). O temperature ajusta o grau de aleatoriedade (não pode ser confundido com criatividade humana) ou variação estatística.

**TopK**: limita a quantidade de resultados.

**TopP**: 

**Sampling**: 

**Tensorflow.js**: é uma biblioteca JavaScript para treinamento e implantação de modelos de aprendizado de máquina no navegador da Web e no Node.js.

### Projeto

```bash
# Passo 1 (ter notícias no database) - captura esses dados
# Passo 2 (normalizador) - criar um normalizador dos dados de notícias
# Passo 3 (peso - weight) - definir pesos para critério de avaliação
# Passo 4 (tensorflow) - enviar dados normalizados para o tensor

# Passo 5 (ter usuários cadastrados) - captura esses dados 
# Passo 6 (normalizador) - criar um normalizador dos dados de usuários
# 

```


### Comandos úteis

```bash
# aciona o arquivo tensor
node ./src/ia/inicio-tensorflow.js

# para mudar a versão usada do Node somente no terminal aberto
nvm use 22

# restaura dependências pachage.json/node_modules
npm ci

# rodar a aplicação
npm start
```