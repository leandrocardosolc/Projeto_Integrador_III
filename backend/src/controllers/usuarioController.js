const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha, endereco } = req.body;
    const usuario = new Usuario({ nome, email, senha, endereco });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar usuários
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate('favoritos avaliacoes.restauranteId');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;