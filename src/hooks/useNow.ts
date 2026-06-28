import { useEffect, useState } from 'react';

const CLOCK_INTERVAL_MS = 1000;

export const useNow = (): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), CLOCK_INTERVAL_MS);

    return () => window.clearInterval(timerId);
  }, []);

  return now;
};
