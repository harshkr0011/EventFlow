
'use client';

import * as React from 'react';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const calculateTimeLeft = (date: string): TimeLeft | null => {
  const difference = +new Date(date) - +new Date();
  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

const CountdownUnit = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-4xl md:text-6xl font-bold tracking-tighter">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-xs md:text-sm uppercase tracking-widest text-white/70">
      {label}
    </span>
  </div>
);

export function CountdownTimer({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft | null>(null);

  React.useEffect(() => {
    // Set initial value to avoid layout shift, then update on client
    setTimeLeft(calculateTimeLeft(date));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);

    return () => clearInterval(timer);
  }, [date]);

  if (!timeLeft) {
    return <div className="text-2xl font-bold text-primary mt-4">Event has started!</div>;
  }

  return (
    <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <p className="mb-4 text-lg font-semibold tracking-wider">GOA SUNBURN FESTIVAL STARTS IN:</p>
      <div className="flex justify-center gap-4 md:gap-8">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
        <CountdownUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}
