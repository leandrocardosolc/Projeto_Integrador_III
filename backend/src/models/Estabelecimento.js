const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true, min: 0 },
  imagem: { type: String }
}, { _id: true });

const estabelecimentoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    descricao: { type: String, default: '' },
    cardapio: [itemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Estabelecimento', estabelecimentoSchema);