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

## Projeto

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


### Prompts 

**Recomendação da Anthropic do que ter no prompt**: 

1. Contexto da tarefa (persona): dá uma personalidade para a IA.
2. Contexto do tom: você deve manter um tom amigável de atendimento ao cliente.
3. Dados de antecedentes, documentos e imagens: aqui está documento de orientação de carreira que deve consultar.
4. Descrição detalhada da tarefa e regras: lista as regras (não invente infos. Se não souber, diga que não sabe).
5. Exemplos: dê exemplos de resposta padrão.
6. Histórico de conversa.
7. Descrição ou pedido imediato: a sua pergunta.
8. Pensar passo a passo / respirar fundo: como você responde à pergunta do usuário?
9. Formatação de saída.
10. Resposta pré-preenchida (se houver).

**Técnicas**: formas de estruturar a entrada de dados em um prompt para um LLM.

1. Json Prompt: escrever o prompt inteiro como um objeto JSON, com campos como papel, tarefa, contexto, restrições e formato de saída. Isso força a organização e deixa tudo explícito.

```bash
{
  "papel": "Engenheiro de software fullstack sênior e mentor didático",
  "tarefa": "Explicar como estruturar uma API de notícias em camadas e dizer onde cada responsabilidade deve ficar",
  "contexto": {
    "projeto": "Site de notícias de tecnologia (Kortex News)",
    "stack": ["JavaScript", "TypeScript", "Node.js", "Express.js", "React", "Vite"],
    "nivel_do_usuario": "júnior em transição para pleno"
  },
  "principios": [
    "SOLID", "Clean Code", "Clean Architecture", "KISS", "YAGNI",
    "SoC", "DRY", "TDD", "DDD", "12 Factors", "API de rede", "RESTful"
  ],
  "restricoes": [
    "Responder em português do Brasil",
    "Não inventar bibliotecas nem APIs; se tiver dúvida, dizer que não sabe",
    "Evitar excesso de engenharia: aplicar YAGNI e KISS",
    "Mostrar trade-offs, não só a solução ideal"
  ],
  "formato_da_resposta": {
    "tipo": "json",
    "campos": {
      "resumo": "até 3 frases",
      "estrutura_de_pastas": "lista de caminhos com a responsabilidade de cada um",
      "principios_aplicados": "para cada princípio, onde ele aparece na solução",
      "exemplo_de_codigo": "trecho curto em TypeScript",
      "riscos_e_trade_offs": "lista"
    }
  }
}
```

2. Toon (Token-Oriented Object Notation): formato compacto e legível para representar dados estruturados. 

```bash
Você é um mentor de engenharia de software fullstack.

Abaixo estão os critérios de revisão do meu projeto (formato TOON) e a
arquitetura em camadas. Revise o código que vou enviar na próxima mensagem
e, para cada critério, diga se foi atendido, com uma frase de justificativa.

criterios[12]{principio,pergunta}:
  SOLID,Cada classe tem um unico motivo para mudar?
  Clean Code,Os nomes revelam a intencao?
  Clean Architecture,As dependencias apontam para o dominio?
  KISS,Existe uma solucao mais simples?
  YAGNI,Isso e necessario agora?
  SoC,Cada camada cuida de uma preocupacao?
  DRY,Esta regra existe em um unico lugar?
  TDD,Existe um teste antes do codigo?
  DDD,A linguagem do codigo e a do negocio?
  12 Factors,A configuracao vem do ambiente?
  API de rede,Os contratos e erros estao documentados?
  REST,Recursos e verbos HTTP estao corretos?

camadas[4]{camada,responsabilidade,depende_de}:
  dominio,Entidades e regras de negocio,nada
  aplicacao,Casos de uso,dominio
  infraestrutura,Mongoose e Express,aplicacao
  apresentacao,Rotas e controllers HTTP,aplicacao

stack[6]: JavaScript,TypeScript,Node.js,Express.js,React,Vite
```

3. **XML tags**: também chamada de [XML tagging](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#structure-prompts-with-xml-tags).


```bash
<role>
Você é um engenheiro de software fullstack sênior especializado em stacks JavaScript e TypeScript. Além disso, você é um mentor didático que sempre responde em tom objetivo e prestativo. 
</role>

<contexto_do_projeto>
  <descricao>Site de notícias de tecnologia, chamado Kortex News, em evolução.</descricao>
  <stack>
    <backend>TypeScript, Node.js, Express.js, MongoDB com Mongoose, Tensorflow.js</backend>
    <frontend>TypeScript, React, Vite</frontend>
  </stack>
</contexto_do_projeto>

<codigo_atual>
  <arquivo caminho="src/routes/news.ts">
    [cole aqui o código]
  </arquivo>
  <arquivo caminho="src/controllers/news-controller.ts">
    [cole aqui o código]
  </arquivo>
</codigo_atual>

<regras>
  - Responda em português do Brasil.
  - Quando não souber a resposta, diga que não sabe. 
  - Todo o código gerado deve seguir os princípios e boas práticas de desenvolvimento de software.
  <princípios_e_boas_práticas>
    SOLID, Clean Code, Clean Architecture, KISS, YAGNI, SoC, DRY, TDD, DDD, 12 Factors, APIs de rede e REST.
  </princípios_e_boas_práticas>
</regras>

<exemplos>
  <exemplo>
    <problema>O controller acessa o Mongoose diretamente.</problema>
    <principio>Clean Architecture, SoC</principio>
    <correcao>Mover o acesso ao banco para um repositório e injetá-lo no caso de uso.</correcao>
  </exemplo>
</exemplos>

<formato_da_resposta>
  Escreva a resposta em duas partes:
  <diagnostico>lista de problemas, cada um com os campos do exemplo</diagnostico>
  <plano>até 5 passos ordenados por prioridade, com um trecho curto de código no passo 1</plano>
</formato_da_resposta>

<tarefa>
  Revise o código acima e diga o que mudar para aproximá-lo de uma arquitetura limpa,
  sem exagerar na complexidade.
</tarefa>
```



