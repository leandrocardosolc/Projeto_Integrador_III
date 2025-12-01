const Estabelecimento = require('../models/Estabelecimento');

// CREATE (admin)
exports.create = async (req, res) => {
  try {
    const { nome, categoria, descricao } = req.body;
    if (!nome || !categoria) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, categoria.' });
    }
    const est = await Estabelecimento.create({
      nome,
      categoria,
      descricao: descricao || '',
      cardapio: []
    });
    return res.status(201).json({ message: 'Estabelecimento criado.', estabelecimento: est });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar estabelecimento.' });
  }
};

// LIST
exports.list = async (_req, res) => {
  try {
    const ests = await Estabelecimento.find().select('nome categoria descricao cardapio');
    return res.status(200).json(ests);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar estabelecimentos.' });
  }
};

// GET by id
exports.get = async (req, res) => {
  try {
    const est = await Estabelecimento.findById(req.params.id);
    if (!est) return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
    return res.status(200).json(est);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao obter estabelecimento.' });
  }
};

// ADD item ao cardápio (admin)
exports.addItemCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, imagem } = req.body;
    if (!nome || preco == null) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, preco.' });
    }

    const est = await Estabelecimento.findById(id);
    if (!est) return res.status(404).json({ error: 'Estabelecimento não encontrado.' });

    est.cardapio.push({
      nome,
      descricao: descricao || '',
      preco: Number(preco),
      imagem: imagem || null
    });

    await est.save();
    return res.status(201).json({ message: 'Item adicionado ao cardápio.', estabelecimento: est });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar item ao cardápio.' });
  }
};