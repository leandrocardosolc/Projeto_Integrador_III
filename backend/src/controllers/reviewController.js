const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  const { estabelecimento, rating, comment } = req.body;
  try {
    if (!estabelecimento || !rating) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
    const review = await Review.create({
      user: req.user.id,
      estabelecimento,
      rating,
      comment
    });
    return res.status(201).json({ message: 'Avaliação criada.', review });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar avaliação.' });
  }
};

exports.getReviews = async (_req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email role')
      .populate('estabelecimento', 'nome categoria');
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar avaliações.' });
  }
};

exports.getReviewsByEstabelecimento = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ estabelecimento: id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar avaliações.' });
  }
};