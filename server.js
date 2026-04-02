import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';
const LTA_API_KEY = process.env.LTA_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/api/lta/*path', async (req, res) => {
  try {
    const endpoint = req.params['path'];
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${LTA_API_BASE}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'AccountKey': LTA_API_KEY,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch data from LTA' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
