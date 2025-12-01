const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { estabelecimento, items, total } = req.body;
  try {
    if (!estabelecimento || !Array.isArray(items) || !items.length || !total) {
      return res.status(400).json({ error: 'Dados do pedido incompletos.' });
    }
    const order = await Order.create({
      user: req.user.id,
      estabelecimento,
      items,
      total
    });
    return res.status(201).json({ message: 'Pedido criado.', order });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido.' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('estabelecimento', 'nome categoria')
      .populate('items.item', 'nome preco');
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

exports.getOrdersByEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({ estabelecimento: id })
      .populate('user', 'name email')
      .populate('items.item', 'nome preco');
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos do estabelecimento.' });
  }
};

// Garantir que CommonJS retorne as propriedades definidas em exports
module.exports = exports;