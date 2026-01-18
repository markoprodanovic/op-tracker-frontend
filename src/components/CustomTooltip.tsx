// Simple interface - only type what we actually use
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

export default function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

    // Handle days with no episodes
    if (total === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-300">
            {label}
          </p>
          <p className="text-sm text-gray-500 italic dark:text-gray-400">
            No episodes watched
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-gray-900 p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-gray-300">{label}</p>
        <p className="text-sm text-gray-600 mb-2 dark:text-gray-400">
          Total: {total} episodes
        </p>
        {payload
          .filter((entry) => entry.value > 0)
          .map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} episodes
            </p>
          ))}
      </div>
    );
  }
  return null;
}
