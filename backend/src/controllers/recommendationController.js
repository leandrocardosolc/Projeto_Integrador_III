const Estabelecimento = require('../models/Estabelecimento');
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.getRecommendations = async (req, res) => {
  try {
    // Estratégia simples: estabelecimentos com mais avaliações + limite
    const reviewsAgg = await Review.aggregate([
      { $group: { _id: '$estabelecimento', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 5 }
    ]);

    const ids = reviewsAgg.map(r => r._id);
    let estabelecimentos = await Estabelecimento.find({ _id: { $in: ids } })
      .select('nome categoria cardapio');

    // Se faltou preencher 5, complementar com recentes
    if (estabelecimentos.length < 5) {
      const complemento = await Estabelecimento.find({ _id: { $nin: ids } })
        .limit(5 - estabelecimentos.length)
        .select('nome categoria cardapio');
      estabelecimentos = [...estabelecimentos, ...complemento];
    }

    return res.status(200).json({ recommendations: estabelecimentos });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar recomendações.' });
  }
};