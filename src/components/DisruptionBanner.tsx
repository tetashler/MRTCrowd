import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AlertMessage {
  Content: string;
}

interface TrainAlert {
  status: number;
  messages: AlertMessage[];
}

export const DisruptionBanner = () => {
  const [alert, setAlert] = useState<TrainAlert | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from('train_alerts')
        .select('status, messages')
        .single();

      if (error) {
        console.error('Failed to fetch alerts:', error);
        return;
      }

      setAlert(data);
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10 * 60 * 1000); // re-fetch every 10 min
    return () => clearInterval(interval);
  }, []);

  if (!alert) return null;

  const hasDisruption = alert.status !== 1 || alert.messages?.length > 0;

  if (!hasDisruption) return null;

  return (
    <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {alert.messages.map((msg, idx) => (
            <p key={idx} className="text-red-400 text-sm leading-relaxed">
              {msg.Content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};