import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const formatString = 'YYYY-MM-DD HH:mm:ss';

export default function useRealTime(){
  const [realTime, setRealTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(dayjs().format(formatString));
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [])

  return {realTime};
}