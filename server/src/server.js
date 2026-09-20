import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';

import { initSocket } from './services/socket.js';
import leadsRouter from './routes/leads.js';
import webhookRouter from './routes/webhook.js';
import { startPoller } from './services/poller.js';

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer);

app.use(cors());
app.use(express.json());

app.use('/api', leadsRouter);
app.use('/', webhookRouter);

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  startPoller();
});
