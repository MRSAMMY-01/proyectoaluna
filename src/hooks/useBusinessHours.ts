import { useState, useEffect } from 'react';

const getSantiagoTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());

  const map = parts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {} as Record<string, string>);

  const day = map.weekday;
  let hour = parseInt(map.hour, 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(map.minute, 10);

  return { day, hour, minute };
};

const calculateBusinessHours = () => {
  const { day, hour, minute } = getSantiagoTime();
  
  const isSunday = day === 'Sun';
  const timeInMinutes = hour * 60 + minute;
  const openTime = 10 * 60 + 30; // 10:30
  const closeTime = 18 * 60 + 30; // 18:30

  if (isSunday) {
    return { isOpen: false, nextOpenLabel: 'Abrimos mañana a las 10:30', closingTimeLabel: '18:30' };
  }

  if (timeInMinutes < openTime) {
    return { isOpen: false, nextOpenLabel: 'Abrimos hoy a las 10:30', closingTimeLabel: '18:30' };
  }

  if (timeInMinutes >= closeTime) {
    if (day === 'Sat') {
      return { isOpen: false, nextOpenLabel: 'Abrimos el lunes a las 10:30', closingTimeLabel: '18:30' };
    }
    return { isOpen: false, nextOpenLabel: 'Abrimos mañana a las 10:30', closingTimeLabel: '18:30' };
  }

  return { isOpen: true, nextOpenLabel: '', closingTimeLabel: '18:30' };
};

export function useBusinessHours() {
  const [status, setStatus] = useState(calculateBusinessHours());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatus(calculateBusinessHours());
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return status;
}
