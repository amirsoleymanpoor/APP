import { useState, useCallback, useEffect } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { InspectionResultView } from './components/InspectionResult';
import { HistoryView } from './components/HistoryView';
import { useInspection } from './hooks/useInspection';
import { InspectionResult } from './types';
import { Settings, History, Loader2, ScanLine, Sparkles } from 'lucide-react';

type Tab = 'inspect' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inspect');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [componentType, setComponentType] = useState('برد الکترونیکی PCB');
  const [sensitivity, setSensitivity] = useState('medium');
  const [instructions, setInstructions] = useState('');
  const [history, setHistory] = useState<InspectionResult[]>(() => {
    const saved = localStorage.getItem('qc_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedHistory, setSelectedHistory] = useState<InspectionResult | null>(null);

  const { result, loading, error, inspect, clear } = useInspection();

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('qc_history', JSON.stringify(history));
  }, [history]);

  const handleImageCapture = useCallback((base64: string) => {
    setCapturedImage(base64);
    setSelectedHistory(null);
    clear();
  }, [clear]);

  const handleClearImage = useCallback(() => {
    setCapturedImage(null);
    setSelectedHistory(null);
    clear();
  }, [clear]);

  const handleInspect = useCallback(async () => {
    if (!capturedImage) return;
    await inspect(capturedImage, 'image/jpeg', componentType, sensitivity, instructions);
  }, [capturedImage, componentType, sensitivity, instructions, inspect]);

  // Add to history when result arrives
  useEffect(() => {
    if (result && !history.find(h => h.id === result.id)) {
      const resultWithImage = { ...result, imageUrl: capturedImage || '' };
      setHistory(prev => [resultWithImage, ...prev].slice(0, 50)); // Keep last 50
    }
  }, [result, capturedImage, history]);

  const handleSelectHistory = useCallback((item: InspectionResult) => {
    setSelectedHistory(item);
    setActiveTab('inspect');
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('qc_history');
  }, []);

  const displayResult = selectedHistory || result;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <ScanLine size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">بازرسی قطعات</h1>
              <p className="text-xs text-blue-100">هوش مصنوعی تشخیص عیوب</p>
            </div>
          </div>
          <div className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-medium">
            v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto pb-24">
        {activeTab === 'inspect' && (
          <div className="space-y-4">
            {/* Camera Section */}
            <CameraCapture 
              onImageCapture={handleImageCapture}
              onClear={handleClearImage}
              capturedImage={capturedImage}
            />

            {/* Settings Panel */}
            {capturedImage && !displayResult && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Settings size={16} className="text-slate-500" />
                  تنظیمات بازرسی
                </h3>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">نوع قطعه</label>
                  <select 
                    value={componentType}
                    onChange={(e) => setComponentType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>برد الکترونیکی PCB</option>
                    <option>خازن الکتریکی</option>
                    <option>مقاومت</option>
                    <option>ترانزیستور / آی‌سی</option>
                    <option>کانکتور و سوکت</option>
                    <option>برد تغذیه PSU</option>
                    <option>سایر</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">حساسیت تشخیص</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'low', label: 'پایین', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                      { value: 'medium', label: 'متوسط', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                      { value: 'high', label: 'بالا', color: 'bg-red-100 text-red-700 border-red-200' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSensitivity(opt.value)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                          sensitivity === opt.value ? opt.color + ' ring-2 ring-offset-1' : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">توضیحات تکمیلی (اختیاری)</label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="مثلاً: به پایه‌های IC دقت کن"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                  />
                </div>

                <button
                  onClick={handleInspect}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      در حال آنالیز تصویر...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      شروع بازرسی هوشمند
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm animate-in fade-in">
                <p className="font-bold mb-1">خطا در بازرسی</p>
                <p>{error}</p>
              </div>
            )}

            {/* Result Display */}
            {displayResult && (
              <InspectionResultView result={displayResult} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView 
            history={history} 
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800">درباره اپلیکیشن</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>این اپلیکیشن با استفاده از هوش مصنوعی Gemini 2.0 Flash، تصاویر قطعات الکترونیکی را تحلیل کرده و عیوبی مانند سوختگی، قطعه پریدگی و لحیم‌کاری معیوب را تشخیص می‌دهد.</p>
              <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">نسخه</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">موتور AI</span>
                  <span className="font-medium">Gemini 2.0 Flash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">پلتفرم</span>
                  <span className="font-medium">Android (Capacitor)</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">توجه: برای عملکرد صحیح، دستگاه باید به اینترنت متصل باشد.</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 px-6 py-2 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setActiveTab('inspect')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${activeTab === 'inspect' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
          >
            <ScanLine size={22} />
            <span className="text-[10px] font-medium">بازرسی</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${activeTab === 'history' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
          >
            <History size={22} />
            <span className="text-[10px] font-medium">تاریخچه</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
          >
            <Settings size={22} />
            <span className="text-[10px] font-medium">تنظیمات</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
