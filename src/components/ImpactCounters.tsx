import React from 'react';
import { Users, Car, CheckCircle, Bell } from 'lucide-react';

interface Counter {
  icon: typeof Users;
  value: number;
  label: string;
  color: string;
  increment: number;
}

export default function ImpactCounters() {
  const [counters, setCounters] = React.useState<Counter[]>([
    {
      icon: Users,
      value: 15789,
      label: 'Usuários Ativos',
      color: 'text-blue-600',
      increment: 1
    },
    {
      icon: CheckCircle,
      value: 1234,
      label: 'Casos Resolvidos',
      color: 'text-green-600',
      increment: 1
    },
    {
      icon: Bell,
      value: 567,
      label: 'Casos Ativos',
      color: 'text-yellow-600',
      increment: 1
    },
    {
      icon: Car,
      value: 890,
      label: 'Veículos Recuperados',
      color: 'text-purple-600',
      increment: 1
    }
  ]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCounters(current =>
        current.map(counter => ({
          ...counter,
          value: counter.value + counter.increment
        }))
      );
    }, 10000); // Increment every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {counters.map((counter, index) => {
        const Icon = counter.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform"
          >
            <Icon className={`h-8 w-8 mx-auto mb-4 ${counter.color}`} />
            <div className={`text-3xl font-bold mb-2 ${counter.color}`}>
              {counter.value.toLocaleString()}
            </div>
            <div className="text-gray-600">{counter.label}</div>
          </div>
        );
      })}
    </div>
  );
}