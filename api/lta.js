const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { endpoint, ...rest } = req.query;
    const queryString = new URLSearchParams(rest).toString();
    const url = `${LTA_API_BASE}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(url, {
            headers: {
                'AccountKey': process.env.LTA_API_KEY,
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from LTA' });
    }
}