/**
 * ============================================================================
 *  WORKER DE TREINAMENTO E RECOMENDAÇÃO — TensorFlow.js
 * ============================================================================
 *
 *  O QUE ESTE ARQUIVO FAZ (visão macro)
 *  ------------------------------------
 *  Recomenda produtos a um cliente. Ele aprende, a partir do histórico de
 *  compras, a dar uma NOTA (0 a 1) para cada par (cliente, produto):
 *  quanto maior a nota, maior a chance de o cliente querer aquele produto.
 *
 *  Ele roda dentro de um Web Worker (uma thread separada), para que o
 *  treinamento não trave a tela.
 *
 *  O CAMINHO DOS DADOS (pipeline)
 *  ------------------------------
 *
 *   products.json + usuários (com compras)
 *            │
 *            ▼
 *   ETAPA 1  Contexto ............ calcula mínimos/máximos e índices
 *            │                     (para converter texto em número)
 *            ▼
 *   ETAPA 2  Codificação ......... transforma produto e usuário em VETORES
 *            │                     (listas de números que a rede entende)
 *            ▼
 *   ETAPA 3  Dados de treino ..... monta linhas [usuário + produto] → comprou?
 *            │
 *            ▼
 *   ETAPA 4  Rede neural ......... cria a rede e treina (model.fit)
 *            │
 *            ▼
 *   ETAPA 5  Orquestração ........ trainModel(): liga as etapas 1 a 4
 *            │
 *            ▼
 *   ETAPA 6  Recomendação ........ recommend(): usa a rede treinada
 *            │
 *            ▼
 *   ETAPA 7  Comunicação ......... recebe/envia mensagens da página
 *
 *  ORDEM DE LEITURA
 *  ----------------
 *  Este arquivo foi reorganizado para ser lido de cima para baixo, na ordem
 *  do pipeline. No original, as funções das etapas 2 a 4 ficavam no final.
 *  Isso funcionava porque `function` é "içada" (hoisting) pelo JavaScript,
 *  mas dificultava a leitura.
 *
 *  LEGENDA DOS MARCADORES
 *  ----------------------
 *   Nome sugerido ... sugestão de nome mais descritivo (em português).
 *                     Os nomes originais foram MANTIDOS no código.
 *   🔧 CORREÇÃO ..... bug corrigido em relação ao arquivo original.
 *   💡 MELHORIA ..... ponto de evolução que NÃO foi aplicado ao código.
 * ============================================================================
 */


/* ============================================================================
 * ETAPA 0 — CONFIGURAÇÃO INICIAL E ESTADO GLOBAL
 * ============================================================================ */

// Carrega o TensorFlow.js pela CDN. Depois deste import, o objeto global `tf`
// fica disponível dentro do worker.
import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';

// Nomes das mensagens trocadas entre a página e o worker (ex.: "treinar", "recomendar").
import { workerEvents } from '../events/constants.js';

console.log('Model training worker initialized');

// Nome sugerido: _contextoGlobal
// Guarda o "contexto de codificação" (mínimos, máximos, índices, vetores dos produtos)
// calculado no treino. A recomendação precisa DO MESMO contexto para codificar o
// usuário exatamente como a rede viu durante o treino.
let _globalCtx = {};

// Nome sugerido: _modeloTreinado
// A rede neural já treinada. Fica null até o treino terminar.
let _model = null;

// Nome sugerido: PESOS_DAS_CARACTERISTICAS
// Importância de cada característica do produto na recomendação.
//
// Como funciona: cada característica é multiplicada pelo seu peso ao ser codificada.
// Uma categoria "ativa" vale 0.4 e uma cor "ativa" vale 0.3, então a categoria
// pesa mais no vetor que a rede recebe. É um jeito manual de dizer à rede:
// "categoria importa mais do que cor, que importa mais do que preço, que importa
// mais do que idade".
//
// Observação: somar 1 é só uma convenção para facilitar a leitura. Não é uma
// exigência matemática.
const WEIGHTS = {
    category: 0.4,
    color: 0.3,
    price: 0.2,
    age: 0.1
}


/* ============================================================================
 * ETAPA 1 — PREPARAÇÃO DO CONTEXTO (estatísticas e índices do catálogo)
 * ----------------------------------------------------------------------------
 * Redes neurais só entendem números. Antes de converter produtos e usuários em
 * vetores, é preciso saber:
 *   - qual é o menor e o maior preço/idade (para normalizar);
 *   - quais são as cores e categorias existentes (para numerar cada uma).
 * ============================================================================ */

// Nome sugerido: normalizarParaEscalaDe0a1   (técnica "normalização min-max")
//
// Converte um valor para a escala de 0 a 1.
// Fórmula: (valor - mínimo) / (máximo - mínimo)
//
// Exemplo (preço): 129,99 com mínimo 39,99 e máximo 199,99
//                  → (129,99 - 39,99) / 160 = 0,5625
// Exemplo (idade): 30 com mínimo 20 e máximo 60
//                  → (30 - 20) / 40 = 0,25
//
// Por quê? Preço vai de 40 a 200 e idade de 20 a 60. Sem normalizar, os números
// maiores (preço) dominariam o treino. Na mesma escala, todos competem de forma justa.
//
// O `|| 1` evita divisão por zero. Se todos os valores forem iguais (ex.: todos os
// usuários com a mesma idade), máximo - mínimo = 0, e o `|| 1` troca o divisor por 1.
const normalize = (value, min, max) => (value - min) / ((max - min) || 1);


// Nome sugerido: construirContextoDeCodificacao
//
// Varre os produtos e os usuários UMA vez e calcula tudo o que a codificação
// vai precisar depois. Devolve um objeto "contexto".
//
// Exemplo com 3 categorias (roupa, calçado, acessório) e 3 cores (azul, preto, branco):
//   dimentions = 2 (preço + idade) + 3 + 3 = 8 posições por vetor de produto.
function makeContext(products, users) {

    // 1. Menor e maior idade e preço. Alimentam o normalize().
    const ages = users.map(u => u.age)
    const prices = products.map(p => p.price)

    const minAge = Math.min(...ages)
    const maxAge = Math.max(...ages)

    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // 2. Cores e categorias ÚNICAS do catálogo.
    // O Set remove repetidos. Com 100 produtos e só 4 cores, `colors` fica com 4 itens.
    // O spread [...] converte o Set de volta em array, para poder numerar os itens.
    const colors = [...new Set(products.map(p => p.color))]
    const categories = [...new Set(products.map(p => p.category))]

    // 3. Dicionários "nome → posição". Servem para o one-hot encoding (Etapa 2).
    // Object.fromEntries transforma pares [chave, valor] em objeto:
    //   [['azul', 0], ['preto', 1]]  →  { azul: 0, preto: 1 }
    const colorsIndex = Object.fromEntries(
        colors.map((color, index) => {
            return [color, index]
        })
    )

    const categoriesIndex = Object.fromEntries(
        categories.map((category, index) => {
            return [category, index]
        })
    )

    // Idade do "meio" da faixa. Será o valor neutro para produtos que ninguém comprou.
    const midAge = (minAge + maxAge) / 2
    const ageSums = {}
    const ageCounts = {}

    // 4. Para cada produto, soma a idade de quem o comprou e conta as compras.
    // Para cada usuário, percorre as compras e acumula:
    //   ageSums[produto]  += idade do comprador
    //   ageCounts[produto] += 1
    // Observação: usa `p.name` como chave. Isso pressupõe que o nome do produto é único.
    users.forEach(user => {
        user.purchases.forEach(p => {
            ageSums[p.name] = (ageSums[p.name] || 0) + user.age
            ageCounts[p.name] = (ageCounts[p.name] || 0) + 1
        })
    })

    // 5. Idade MÉDIA dos compradores de cada produto, já normalizada (0 a 1).
    // Se ninguém comprou o produto, usa a idade do meio (midAge) como valor neutro.
    // Na prática, responde: "este produto é mais comprado por jovens ou por mais velhos?"
    //   0 = comprado pelos mais novos | 1 = comprado pelos mais velhos
    const productAvgAgeNorm = Object.fromEntries(
        products.map(product => {
            const avg = ageCounts[product.name] ? ageSums[product.name] / ageCounts[product.name] : midAge

            return [product.name, normalize(avg, minAge, maxAge)]
        })
    )

    return {
        products,
        users,
        colorsIndex,              // { azul: 0, preto: 1, ... }
        categoriesIndex,          // { roupa: 0, calcado: 1, ... }
        minAge,
        maxAge,
        minPrice,
        maxPrice,
        numCategories: categories.length,
        numColors: colors.length,
        // Nome sugerido: dimensoesDoVetor   ("dimentions" é um erro de grafia de "dimensions";
        // funciona porque está escrito igual em todos os lugares).
        // Tamanho do vetor de UM produto (ou de UM perfil de usuário):
        // preço (1) + idade (1) + categorias + cores
        dimentions: 2 + categories.length + colors.length,
        productAvgAgeNorm
    }
}


/* ============================================================================
 * ETAPA 2 — CODIFICAÇÃO (feature engineering)
 * ----------------------------------------------------------------------------
 * Transforma produtos e usuários em VETORES numéricos. Todo vetor de produto
 * e de usuário segue o mesmo layout:
 *
 *   posição:  0       1       2 ... (2+nCat-1)     (2+nCat) ... fim
 *   conteúdo: preço   idade   categoria (one-hot)  cor (one-hot)
 *             ×0.2    ×0.1    ×0.4                 ×0.3
 *
 * Exemplo de produto "Camiseta" (roupa, azul, o mais barato, comprada pelos mais jovens),
 * com 3 categorias e 3 cores:
 *   [0, 0, 0.4, 0, 0, 0.3, 0, 0]
 *    │  │  └──┬──┘  └──┬──┘
 *    │  │  categoria   cor
 *    │  idade
 *    preço
 * ============================================================================ */

// Nome sugerido: criarVetorOneHotPonderado
//
// One-hot encoding: representa uma categoria como um vetor com um único "1".
// Exemplo (comprimento 4, posição 1): "azul" → [0, 1, 0, 0].
// Aqui o "1" é multiplicado pelo peso, então vira [0, 0.3, 0, 0] (se o peso for 0.3).
//
// Por que não usar só um número (azul = 1, preto = 2, branco = 3)? Porque isso diria
// à rede que "branco é maior que azul", o que não faz sentido. Com one-hot, cada
// opção tem a sua própria posição, sem ordem entre elas.
//
// Parâmetros: index = posição do "1" | length = tamanho do vetor | weight = peso.
const oneHotWeighted = (index, length, weight) => tf.oneHot(index, length).cast('float32').mul(weight)


// Nome sugerido: codificarProdutoEmVetor
//
// Converte UM produto em um vetor de números, seguindo o layout descrito acima.
// Devolve um tensor 1D com `dimentions` posições.
function encodeProduct(product, context) {

    // Preço normalizado (0 a 1) × peso do preço.
    const price = tf.tensor1d([
        normalize(product.price, context.minPrice, context.maxPrice) * WEIGHTS.price
    ])

    // Idade MÉDIA DOS COMPRADORES deste produto (e não a idade de quem está vendo),
    // normalizada × peso da idade. Se o produto não estiver no mapa, usa 0.5 (neutro).
    const age = tf.tensor1d([
        (context.productAvgAgeNorm[product.name] ?? 0.5) * WEIGHTS.age
    ])

    // Categoria em one-hot, ponderada.
    const category = oneHotWeighted(
        context.categoriesIndex[product.category],
        context.numCategories,
        WEIGHTS.category
    )

    // Cor em one-hot, ponderada.
    const color = oneHotWeighted(
        context.colorsIndex[product.color],
        context.numColors,
        WEIGHTS.color
    )

    // Junta as quatro partes em um único vetor: [preço, idade, ...categoria, ...cor]
    return tf.concat1d([price, age, category, color])
}


// Nome sugerido: codificarPerfilDoUsuarioEmVetor
//
// Converte UM usuário em um vetor com o MESMO layout do vetor de produto.
// Isso é essencial: assim a rede compara "o gosto do usuário" com "o produto"
// na mesma linguagem.
//
// Dois casos:
//  A) Usuário COM compras: o perfil é a MÉDIA dos vetores dos produtos que ele comprou.
//     Ex.: comprou uma camiseta azul e um boné preto → o perfil mistura roupa/acessório
//     e azul/preto. Retorna um tensor de formato [1, dimentions].
//  B) Usuário SEM compras (cold start): não há histórico. Só se sabe a idade, então o
//     vetor traz apenas a idade; preço, categorias e cores ficam zerados ("ignorados").
function encodeUser(user, context) {
    if (user.purchases.length) {
        return tf.stack(
            user.purchases.map(product => encodeProduct(product, context))
        ).mean(0)
        .reshape([1, context.dimentions])
    }

    return tf.concat1d([
        tf.zeros([1]), // preço ignorado

        // 🔧 CORREÇÃO: o original era
        //     tf.zeros([normalize(user.age, ...) * WEIGHTS.age])
        // Isso cria um tensor de ZEROS cujo TAMANHO é o valor da idade normalizada
        // (um número fracionário como 0.028), o que é inválido e lançava o erro
        // "Tensor must have a shape comprised of positive integers".
        // A intenção era criar um tensor de 1 posição CONTENDO o valor da idade.
        tf.tensor1d([normalize(user.age, context.minAge, context.maxAge) * WEIGHTS.age]),

        tf.zeros([context.numCategories]), // categorias ignoradas
        tf.zeros([context.numColors]),     // cores ignoradas
    ]).reshape([1, context.dimentions])
}


/* ============================================================================
 * ETAPA 3 — MONTAGEM DOS DADOS DE TREINO
 * ----------------------------------------------------------------------------
 * A rede aprende com exemplos de "pergunta → resposta certa".
 *   Pergunta: este usuário + este produto
 *   Resposta: o usuário comprou? (1 = sim, 0 = não)
 * ============================================================================ */

// Nome sugerido: montarDadosDeTreinoUsuarioProduto
//
// Gera UMA linha de treino para cada combinação (usuário × produto), apenas para
// usuários que têm compras. Cada linha é:
//
//   entrada (xs): [ vetor do usuário (dimentions) + vetor do produto (dimentions) ]
//   resposta (ys): 1 se o usuário comprou o produto, 0 se não comprou
//
// Exemplo: 4 usuários com compras × 6 produtos = 24 linhas.
// Com dimentions = 8, cada entrada tem 16 números (8 do usuário + 8 do produto).
function createTrainingData(context) {
    const inputs = []
    const labels = []

    context.users
        .filter(user => user.purchases.length)
        .forEach(user => {
            // Calculado uma vez por usuário (é igual para todos os produtos).
            const userVector = encodeUser(user, context).dataSync()

            context.products.forEach(product => {
                const productVector = encodeProduct(product, context).dataSync()

                // 🔧 CORREÇÃO: o original era
                //     user.purchases.some(purchase => purchase.name === product.name ? 1 : 0)
                // O "? 1 : 0" estava DENTRO do callback do some(), que só olha se o
                // retorno é verdadeiro ou falso. O resultado era um booleano (true/false)
                // e os rótulos viravam um tensor de tipo "bool" em vez de números.
                // Funcionava por acaso (o TensorFlow converte), mas o correto é converter
                // o resultado do some() em 1 ou 0.
                const label = user.purchases.some(
                    purchase => purchase.name === product.name
                ) ? 1 : 0

                inputs.push([...userVector, ...productVector])
                labels.push(label)
            })
        });

    return {
        xs: tf.tensor2d(inputs),                     // formato [linhas, dimentions * 2]
        ys: tf.tensor2d(labels, [labels.length, 1]), // formato [linhas, 1]
        // Nome sugerido: dimensaoDeEntrada
        // ×2 porque cada entrada junta o vetor do usuário com o vetor do produto.
        inputDimention: context.dimentions * 2
    }
}


/* ============================================================================
 * ETAPA 4 — CONSTRUÇÃO E TREINAMENTO DA REDE NEURAL
 * ============================================================================ */

// Nome sugerido: criarETreinarRedeNeural
// (Faz duas coisas. Poderia ser separada em construirRedeNeural() e treinarRedeNeural().)
//
// ARQUITETURA (com dimensão de entrada 16, como no exemplo acima):
//
//   entrada (16) → 128 neurônios → 64 → 32 → 1 neurônio (nota de 0 a 1)
//                    ReLU          ReLU  ReLU    sigmoid
//
// Cada camada densa tem a forma (entradas × neurônios) + neurônios (bias):
//   16×128+128 = 2.176   |   128×64+64 = 8.256   |   64×32+32 = 2.080   |   32×1+1 = 33
//   Total: 12.545 parâmetros que o treino vai ajustar.
async function configureNeuralNetAndTrain(trainData) {

    const model = tf.sequential();

    // Camada de entrada + 1ª camada oculta
    // - inputShape: quantos números cada exemplo tem (usuário + produto juntos).
    // - units: 128 neurônios, cada um detecta um padrão diferente na combinação.
    // - activation 'relu': f(x) = max(0, x). Introduz não-linearidade, permitindo que
    //   a rede aprenda relações que não são linhas retas.
    model.add(
        tf.layers.dense({
            inputShape: [trainData.inputDimention],
            units: 128,
            activation: 'relu'
        })
    )

    // 2ª camada oculta: 64 neurônios. Menos que a anterior, para combinar os padrões
    // simples em padrões mais abstratos.
    model.add(
        tf.layers.dense({
            units: 64,
            activation: 'relu'
        })
    )

    // 3ª camada oculta: 32 neurônios. Continua condensando a informação.
    model.add(
        tf.layers.dense({
            units: 32,
            activation: 'relu'
        })
    )

    // Camada de saída
    // - units: 1 neurônio → UMA nota por par (usuário, produto).
    // - activation 'sigmoid': comprime o resultado para o intervalo de 0 a 1.
    //   Ex.: 0.9 = recomendação forte | 0.1 = recomendação fraca.
    model.add(
        tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
        })
    )

    // Compilação: define COMO a rede vai aprender.
    // - optimizer adam(0.01): algoritmo que ajusta os pesos. 0.01 é a taxa de aprendizado
    //   (tamanho de cada passo). Maior aprende mais rápido, mas pode "pular" o ponto ideal.
    // - loss 'binaryCrossentropy': mede o erro quando a resposta é sim/não (1 ou 0).
    //   Pune com força a rede que está confiante e errada.
    // - metrics 'accuracy': porcentagem de acertos. Só para acompanhar, não influencia o treino.
    model.compile({
        optimizer: tf.train.adam(0.01),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    })

    // Treinamento
    // - epochs 100: a rede percorre TODAS as linhas de treino 100 vezes.
    // - batchSize 32: atualiza os pesos a cada 32 linhas.
    // - shuffle: embaralha as linhas a cada época para a rede não decorar a ordem.
    // - onEpochEnd: ao fim de cada época, envia loss e acurácia para a página
    //   (útil para desenhar um gráfico de progresso).
    await model.fit(trainData.xs, trainData.ys, {
        epochs: 100,
        batchSize: 32,
        shuffle: true,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                postMessage({
                    type: workerEvents.trainingLog,
                    epoch: epoch,
                    loss: logs.loss,
                    accuracy: logs.acc // no TensorFlow.js a métrica 'accuracy' aparece como "acc"
                });
            }
        }
    })

    return model;
}


/* ============================================================================
 * ETAPA 5 — ORQUESTRAÇÃO DO TREINAMENTO
 * ============================================================================ */

// Nome sugerido: treinarModeloDeRecomendacao
//
// É o "maestro" do treino. Chama as etapas na ordem:
//   buscar produtos → montar contexto → codificar produtos → montar dados → treinar.
// Ao final, guarda o contexto e o modelo nas variáveis globais e avisa a página.
async function trainModel({ users }) {
    console.log('Training model with users:', users)

    // 💡 MELHORIA: este "50%" é fixo e aparece ANTES da parte pesada (buscar dados e
    // treinar). Um progresso mais fiel usaria o número da época no onEpochEnd.
    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 50 } });

    // Busca o catálogo de produtos.
    const products = await (await fetch('/data/products.json')).json()

    // ETAPA 1: estatísticas e índices.
    const context = makeContext(products, users)

    // ETAPA 2: codifica TODOS os produtos uma vez e guarda no contexto.
    // O `recommend` reutiliza esses vetores depois, sem recalcular.
    // dataSync() copia o tensor para um array comum do JavaScript.
    context.productVectors = products.map(product => {
        return {
            name: product.name,
            meta: { ...product },
            vector: encodeProduct(product, context).dataSync()
        }
    })

    _globalCtx = context

    // ETAPA 3 e 4: monta os dados e treina.
    const trainData = createTrainingData(context)
    _model = await configureNeuralNetAndTrain(trainData)

    postMessage({ type: workerEvents.progressUpdate, progress: { progress: 100 } });
    postMessage({ type: workerEvents.trainingComplete });
}


/* ============================================================================
 * ETAPA 6 — RECOMENDAÇÃO (inferência)
 * ============================================================================ */

// Nome sugerido: gerarRecomendacoesParaUsuario
//
// Usa a rede JÁ TREINADA para dar uma nota a cada produto, para um usuário, e
// devolve os produtos ordenados da maior para a menor nota.
//
// Em produção, com milhões de produtos, não se avalia o catálogo inteiro:
// primeiro um banco vetorial (Pinecone, pgvector...) busca os ~200 produtos mais
// próximos do perfil do usuário, e a rede avalia só esses. O arquivo original
// já cita esta ideia nos comentários.
function recommend({ user }) {

    // Sem modelo treinado não há o que recomendar.
    if (!_model) return;
    const context = _globalCtx;

    // 1. Transforma o usuário em vetor, no mesmo formato usado no treino.
    const userVector = encodeUser(user, context).dataSync()

    // 2. Monta um par [usuário + produto] para CADA produto do catálogo.
    // O modelo prevê a "compatibilidade" de cada par.
    const inputs = context.productVectors.map(({ vector }) => {
        return [...userVector, ...vector]
    })

    // 3. Junta todos os pares em um único tensor de formato [numProdutos, inputDim].
    const inputTensor = tf.tensor2d(inputs)

    // 4. Roda a rede em todos os pares de uma vez. Resultado: uma nota (0 a 1) por produto.
    const predictions = _model.predict(inputTensor)

    // 5. Converte as notas para um array comum do JavaScript.
    const scores = predictions.dataSync()

    // 6. Junta cada produto com a sua nota.
    const recommendations = context.productVectors.map((item, index) => {
        return {
            ...item.meta,
            name: item.name,
            score: scores[index] // previsão do modelo para este produto
        }
    })

    // 7. Ordena da maior nota para a menor e envia para a página.
    const sortedItems = recommendations.sort((a, b) => b.score - a.score)

    postMessage({
        type: workerEvents.recommend,
        user,
        recommendations: sortedItems
    });
}


/* ============================================================================
 * ETAPA 7 — COMUNICAÇÃO COM A PÁGINA (mensagens)
 * ----------------------------------------------------------------------------
 * Um Web Worker conversa com a página por mensagens:
 *   página → worker: worker.postMessage({ action: 'recommend', user })
 *   worker → página: postMessage({ type: ..., ... })
 * ============================================================================ */

// Nome sugerido: mapaDeAcoes
// Liga o nome de cada ação recebida à função que a trata.
const handlers = {
    [workerEvents.trainModel]: trainModel,

    // 🔧 CORREÇÃO: o original era `d => recommend(d.user, _globalCtx)`.
    // O roteador chama o handler com { user } (a mensagem sem o campo "action").
    // Então `d.user` é o objeto do usuário, e ele era passado para `recommend`, que
    // espera receber { user }. Ao desestruturar, `user` virava undefined e a função
    // quebrava em `user.purchases`. O segundo argumento (_globalCtx) também era
    // ignorado, pois `recommend` lê o contexto global sozinha.
    [workerEvents.recommend]: d => recommend(d),
};

// Nome sugerido: receberMensagemDaPagina
// Ponto de entrada. Toda mensagem da página chega aqui.
// Separa o campo `action` do resto dos dados e chama a função correspondente.
self.onmessage = e => {
    const { action, ...data } = e.data;
    if (handlers[action]) handlers[action](data);
};


/* ============================================================================
 * 💡 MELHORIAS NÃO APLICADAS (para estudo)
 * ============================================================================
 *
 * 1. MEMÓRIA: tensores nunca são liberados.
 *    O TensorFlow.js não libera tensores sozinho. Em um teste com 4 usuários e
 *    6 produtos, restavam ~324 tensores vivos só após montar os dados, e ~373
 *    após o treino. Com um catálogo real e GPU (WebGL), isso consome memória
 *    até travar. Soluções: tf.tidy(() => {...}) e .dispose().
 *    Além disso, createTrainingData recalcula encodeProduct para cada usuário,
 *    mas os vetores já existem em context.productVectors e poderiam ser reusados.
 *
 * 2. RECOMENDA O QUE O USUÁRIO JÁ COMPROU.
 *    O perfil do usuário é a média dos produtos que ele comprou, e esses mesmos
 *    produtos são os rótulos "1" do treino. Em um teste, os produtos que a
 *    cliente já tinha comprado receberam nota 1.00 e todos os outros 0.00.
 *    Em um sistema real, filtre os já comprados antes de exibir.
 *
 * 3. SEM VALIDAÇÃO (decorar x aprender).
 *    Todos os dados são usados no treino, e a perda chega a ~0 com acurácia 100%.
 *    Isso indica que a rede decorou os exemplos. Para medir se ela generaliza,
 *    separe parte dos dados (validationSplit no fit) e compare loss e val_loss.
 *
 * 4. DESBALANCEAMENTO: a maioria das linhas tem rótulo 0 (o usuário compra poucos
 *    produtos entre muitos). A acurácia engana: dizer "ninguém compra nada" já
 *    acerta quase tudo. Considere métricas como precisão/recall e amostragem de
 *    exemplos negativos.
 *
 * 5. COLD START (usuário sem compras) não funciona de verdade.
 *    Usuários sem compras não entram no treino (o filter em createTrainingData),
 *    então a rede nunca viu um vetor "só com idade". Em um teste, todas as notas
 *    de um usuário sem compras ficaram entre 0.00 e 0.04, sem critério útil.
 *    Alternativas: recomendar os mais vendidos, ou os mais comprados pela faixa
 *    etária do usuário (os dados de productAvgAgeNorm já apontam nessa direção).
 *
 * 6. A chave `product.name` pressupõe nomes únicos. Prefira um id.
 * ============================================================================ */