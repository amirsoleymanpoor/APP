import { InspectionResult } from './types';
import { History, Trash2, ChevronLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  history: InspectionResult[];
  onSelect: (item: InspectionResult) => void;
  onClear: () => void;
}

export function HistoryView({ history, onSelect, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <History size={40} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">تاریخچه بازرسی خالی است</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2"><History size={18} className="text-slate-500" /> تاریخچه ({history.length})</h3>
        <button onClick={onClear}
          className="text-red-500 text-xs flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"><Trash2 size={14} /> پاک کردن</button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)}
            className="w-full bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors text-right">
            {item.overallStatus === 'PASSED' ? <CheckCircle size={20} className="text-emerald-500 shrink-0" />
              : item.overallStatus === 'DEFECTIVE' ? <XCircle size={20} className="text-red-500 shrink-0" />
              : <AlertTriangle size={20} className="text-orange-500 shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 text-sm truncate">{item.componentName}</p>
              <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleDateString('fa-IR')} · امتیاز {item.qualityScore}</p>
            </div>
            <ChevronLeft size={16} className="text-slate-300 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
