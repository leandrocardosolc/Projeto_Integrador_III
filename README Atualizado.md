Aboa Backend

API Node.js + Express com MongoDB (Não Relacional) para usuários, estabelecimentos, cardápio, avaliações, pedidos e recomendações.

## Características de Banco de Dados
- Não Relacional: MongoDB (documento-orientado, esquema flexível) via Mongoose.
- Paralelo e Distribuído: Compatível com Replica Set (alta disponibilidade) e Sharding (escala horizontal por chave). Use MongoDB Atlas ou docker-compose para demonstrar.
- Data Warehouse & Mineração de Dados:
  - Pipelines de agregação para KPIs (média de avaliações, receita por período, frequência por usuário).
  - Esquema estrela natural: Fatos (Order, Review), Dimensões (Usuario, Estabelecimento).
  - Integração com Data Lake (S3/Azure Blob) e análise com Spark/Databricks/BigQuery (opcional).
- Segurança:
  - Credenciais e segredos via .env (MONGODB_URI, JWT_SECRET).
  - TLS/SSL, IP allowlist, roles mínimas no banco.
  - Senhas com bcrypt, JWT para acesso à API.
  - Backups/Auditoria via Atlas (recomendado).

## Modelos Principais
- Usuario: { name, email, passwordHash, role }
- Estabelecimento: { nome, categoria, descricao, cardapio[] }
- Review: { user, estabelecimento, rating, comment }
- Order: { user, estabelecimento, items[{ item, quantity }], total }

## Endpoints Principais (prefixo /api)
- Auth
  - POST /auth/register — cria usuário (role: user por padrão)
  - POST /auth/login — retorna JWT
- Usuários
  - GET /usuarios/me — precisa JWT
- Estabelecimentos
  - POST /estabelecimentos — admin, cria estabelecimento
  - GET /estabelecimentos — lista
  - GET /estabelecimentos/:id — detalha
  - POST /estabelecimentos/:id/cardapio — admin, adiciona item
- Reviews
  - POST /reviews — cria (JWT)
  - GET /reviews — lista
  - GET /estabelecimentos/:id/reviews — lista por estabelecimento
- Orders
  - POST /orders — cria (JWT)
  - GET /orders/me — lista do usuário (JWT)
  - GET /estabelecimentos/:id/orders — admin, pedidos do estabelecimento
- Recomendações
  - GET /recommendations — recomendações (JWT)
- Upload
  - POST /upload — upload de imagem (JWT), campo image

## Instalação
1. Requisitos: Node.js 18+; MongoDB (local ou Atlas)
2. Configurar .env na pasta backend:
```
MONGODB_URI=mongodb://localhost:27017/aboa
JWT_SECRET=uma_chave_segura_grande
PORT=3000
```
3. Instalar dependências:
```
npm install
```
4. Executar:
```
node src/server.js
```

## Swagger
- Documentação disponível em src/swagger.json. Configure app.js para servir em /api-docs (caso deseje UI):
```
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## Distribuição (Replica Set / Sharding)
- Atlas: criar cluster com replica set (padrão) e habilitar sharding se necessário.
- Local (opcional): usar docker-compose para 3 nós e configurar rs.initiate(); sharding via mongos. Aponte MONGODB_URI para o SRV/URI do cluster.

## Segurança e Boas Práticas
- Nunca commitar .env.
- Valide payloads; limite tamanho de upload (multer configurado para 5MB, formatos png/jpg/webp).
- Índices em campos de busca/relacionamento (ex.: user, estabelecimento, items.item).
- Monitoramento/alertas (Atlas Metrics) e backups automáticos.

## Teste Rápido
1. Registrar e logar para obter JWT.
2. Criar estabelecimento (role admin).
3. Adicionar item no cardápio.
4. Criar pedido e listar orders/me.
5. Criar avaliação e consultar por estabelecimento.

## Notificações (Socket.io)
- src/server.js inicia Socket.io e permite salas por estabelecimento. Opcionalmente use notifyNewOrder(estabelecimentoId, order) após criar pedido.

## Próximos Passos
- Adicionar analyticsController com KPIs via agregação.
- Docker Compose para cluster Mongo local.
- Melhorar validações e rate-limit por IP/token.