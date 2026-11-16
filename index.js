import tf from '@tensorflow/tfjs-node';

// Função para treinar o modelo com os dados de entrada (inputXs) e saída (outputYs). 
// Quanto mais dados de treino, melhor o modelo tende a aprender.
// A função precisa ser assíncrona (async), ou seja, esperar o treinamento terminar antes de continuar.
// Por isso a função é async e usamos await ao chamá-la.
// Retorna o modelo treinado.
async function trainModel(inputXs, outputYs) {

    // Cria um modelo em que as camadas ficam empilhadas em ordem: a saída de uma camada vira a entrada 
    // da próxima. É o tipo mais simples e comum de rede.
    const model = tf.sequential(); 

    // 1. Primeira camada densa com 7 posições de entrada (inputShape: [7]). 
    // Uma camada densa (fully connected) é aquela em que cada neurônio se conecta a todas as entradas.
    // 2. 80 neurônios ( units: 80): mais neurônios permitem aprender padrões mais complexos, mas exigem mais
    // processamento e aumentam o risco de overfitting (decorar os dados), principalmente com poucos dados 
    // de treino.
    // 3. Função de ativação ReLU ( activation: 'relu') = ReLU (Rectified Linear Unit). 
    // Aplica a regra a cada neurônio: f(x) = max(0, x), se o valor for negativo, vira 0; se for positivo, continua igual.
    model.add(tf.layers.dense({ inputShape: [7], units: 80, activation: 'relu' }))

    // Camada de saída com 3 neurônios (uma para cada classe) e ativação softmax.
    // A função de ativação softmax transforma os valores de saída em probabilidades, 
    // garantindo que a soma das saídas seja 1.
    model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); 

    // Compila o modelo com o optimizer Adam (Adaptive Moment Estimation)
    // O otimizador é o algoritmo que ajusta os pesos com base no erro. O Adam é o mais usado porque:
    // ajusta a taxa de aprendizado de cada peso automaticamente;
    // usa o histórico dos gradientes (momento), o que acelera e estabiliza o treino;
    // funciona bem sem muito ajuste manual.
    // Loss = função de perda categoricalCrossentropy, usada para classificação multiclasse.
    // Metrics = métricas a serem monitoradas durante o treinamento (accuracy = acurácia).
    // A acurácia é a porcentagem de previsões corretas. Não influencia o treino, serve só para você acompanhar.
    model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] })

    // Treinamento do modelo
    await model.fit(
        inputXs, 
        outputYs, 
        {
            verbose: 0, // desabilita log interno. Não exibe detalhes do treinamento no console
            epochs: 100, // quantidade de vezes que o modelo percorre o conjunto de dados de treino completo
            shuffle: true, // embaralha os dados a cada época, para que a rede não aprenda pela ordem dos exemplos. Evita que a rede aprenda a ordem dos dados (viés ou bias dos neurônios)
            callbacks: { // callback chamado no final de cada época - aqui estamos apenas logando a perda (loss) no console
                onEpochEnd: (epoch, log) => 
                    console.log(`Epoch ${epoch}: loss = ${log.loss.toFixed(4)}, acc = ${log.acc.toFixed(4)}`)
            }
        }
    )

    return model;
}

async function predictPessoa(model, pessoaNormalizada) {

    // 1. Transformar a pessoa normalizada em tensor
    const tfInput = tf.tensor2d(pessoaNormalizada);

    // 2. Fazer a previsão usando o modelo treinado
    const prediction = model.predict(tfInput);
    const predArray = await prediction.array();

    return predArray[0].map((prob, index) => ({ prob, index }))
}

const tensorPessoasNormalizado = [
    [0.33, 1, 0, 0, 1, 0, 0], 
    [0, 0, 1, 0, 0, 1, 0], 
    [1, 0, 0, 1, 0, 0, 1], 
]

const labelsNomes = ["premium", "medium", "basic"];
const tensorLabels = [
    [1, 0, 0], // premium
    [0, 1, 0], // medium
    [0, 0, 1] // basic
]

const inputXs = tf.tensor2d(tensorPessoasNormalizado);
const outputYs = tf.tensor2d(tensorLabels);

const model = await trainModel(inputXs, outputYs);

const pessoa = { nome: "Zé", idade: 28, cor: "verde", localizacao: "São Paulo" }
const pessoaNormalizada = [
    [0.2, 0, 0, 1, 1, 0, 0]
]

const predictions = await predictPessoa(model, pessoaNormalizada);
const results = predictions.sort((a, b) => b.prob - a.prob)
    .map(p => `${labelsNomes[p.index]} (${(p.prob * 100).toFixed(2)}%)`)
    .join('\n');

console.log(results);


