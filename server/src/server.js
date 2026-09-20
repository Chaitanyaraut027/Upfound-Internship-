require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const { initSocket } = require('./services/socket');
const { router: leadsRouter } = require('./routes/leads');
const webhookRouter = require('./routes/webhook');

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());
app.use(express.json());

app.use('/api', leadsRouter);
app.use('/', webhookRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
