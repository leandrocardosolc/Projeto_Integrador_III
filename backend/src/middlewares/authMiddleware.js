const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token não fornecido.' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Formato de autorização inválido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

exports.authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso negado.' });
  }
  next();
};