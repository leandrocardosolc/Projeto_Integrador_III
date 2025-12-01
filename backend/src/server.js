const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Canal simples de notificação
io.on('connection', socket => {
  // Opcional: autenticação de socket via token em query
  console.log('Cliente conectado:', socket.id);

  socket.on('subscribeEstabelecimento', estabelecimentoId => {
    socket.join(`est_${estabelecimentoId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Função utilitária para enviar notificação de novo pedido
function notifyNewOrder(estabelecimentoId, order) {
  io.to(`est_${estabelecimentoId}`).emit('newOrder', order);
}

// Exportar para uso em controllers (ex: quando criar pedido)
module.exports = { server, notifyNewOrder };

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});