import { createClient } from '@supabase/supabase-js';

const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';
const LINES = ['NSL', 'EWL', 'NEL', 'CCL', 'DTL', 'TEL'];

export default async function handler(req, res) {
    // Block non-cron calls in production
    if (process.env.NODE_ENV === 'production' &&
        req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 1. Fetch crowd data from LTA for each line
        const results = await Promise.all(LINES.map(line =>
            fetch(`${LTA_API_BASE}/PCDRealTime?TrainLine=${line}`, {
                headers: {
                    'AccountKey': process.env.LTA_API_KEY,
                    'Accept': 'application/json',
                },
            }).then(r => r.json())
        ));

        const stations = results.flatMap(r => r.value || []);

        // 2. Upsert into Supabase
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const rows = stations.map((s) => ({
            station_code: s.Station,
            crowd_level: s.CrowdLevel,
            updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase
            .from('mrt_crowd')
            .upsert(rows, { onConflict: 'station_code' });

        if (error) throw error;

        res.status(200).json({ ok: true, synced: rows.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}