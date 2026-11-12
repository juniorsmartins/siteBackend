import tf from '@tensorflow/tfjs-node';

// const pessoas = [
//     {nome: 'Junior', idade: 45, cor: 'azul', localizacao: 'Brasil'},
//     {nome: 'Mário', idade: 20, cor: 'branca', localizacao: 'EUA'},
//     {nome: 'Bruno', idade: 32, cor: 'verde', localizacao: 'Uruguai'},
//     {nome: 'Mariana', idade: 29, cor: 'preto', localizacao: 'México'}
// ];

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

inputXs.print();
outputYs.print();
