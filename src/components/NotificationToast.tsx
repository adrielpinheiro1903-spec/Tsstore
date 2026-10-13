import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const NotificationToast: React.FC = () => {
  const { notifications } = useStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${
            n.type === 'success'
              ? 'bg-zinc-900/95 border-emerald-500/50 text-white'
              : n.type === 'error'
              ? 'bg-zinc-900/95 border-rose-500/50 text-white'
              : 'bg-zinc-900/95 border-[#00F0FF]/50 text-white'
          }`}
        >
          {n.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {n.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          {n.type === 'info' && (
            <Info className="w-5 h-5 text-[#00F0FF] shrink-0" />
          )}
          <p className="text-xs font-medium leading-snug">{n.message}</p>
        </div>
      ))}
    </div>
  );
};
