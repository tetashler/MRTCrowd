import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface AlertMessage {
  Content: string;
}

interface TrainServiceAlert {
  Status: number;
  AffectedSegments: unknown[];
  Message: AlertMessage[];
}

export const DisruptionBanner = () => {
  const [alerts, setAlerts] = useState<TrainServiceAlert | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`/api/lta?endpoint=PCDRealTime&TrainLine=${lineCode}`);
        const data = await response.json();
        // data.value is an object, not an array
        setAlerts(data.value || null);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!alerts) return null;

  const hasDisruption =
    alerts.Status !== 1 || (alerts.Message && alerts.Message.length > 0);

  if (!hasDisruption) return null;

  return (
    <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {alerts.Message.map((msg, idx) => (
            <p key={idx} className="text-red-200 text-sm leading-relaxed">
              {msg.Content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
