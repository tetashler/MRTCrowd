import { createClient } from '@supabase/supabase-js';

const LTA_API_BASE = 'https://datamall2.mytransport.sg/ltaodataservice';

export default async function handler(req, res) {
    if (process.env.NODE_ENV === 'production' &&
        req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const response = await fetch(`${LTA_API_BASE}/TrainServiceAlerts`, {
            headers: {
                'AccountKey': process.env.LTA_API_KEY,
                'Accept': 'application/json',
            },
        });

        const data = await response.json();
        const alert = Array.isArray(data.value) ? data.value[0] : data.value;

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { error } = await supabase
            .from('train_alerts')
            .upsert({
                id: 1,
                status: alert?.Status ?? 1,
                affected_segments: alert?.AffectedSegments ?? [],
                messages: alert?.Message ?? [],
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

        if (error) throw error;

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}