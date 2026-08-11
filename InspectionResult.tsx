import { InspectionResult as ResultType } from '../types';
import { CheckCircle, AlertTriangle, XCircle, Shield, Wrench, MapPin, Zap } from 'lucide-react';

interface Props {
  result: ResultType;
}

const gradeColors = {
  A: 'bg-emerald-500',
  B: 'bg-blue-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  F: 'bg-red-500',
};

const severityIcons = {
  high: <XCircle size={16} className="text-red-500" />,
  medium: <AlertTriangle size={16} className="text-orange-500" />,
  low: <AlertTriangle size={16} className="text-yellow-500" />,
};

const categoryLabels: Record<string, string> = {
  burn: 'سوختگی/حرارتی',
  missing: 'قطعه پریدگی',
  damage: 'آسیب ظاهری',
  solder: 'لحیم‌کاری',
  other: 'سایر',
};

export function InspectionResultView({ result }: Props) {
  const isPassed = result.overallStatus === 'PASSED';
  const isDefective = result.overallStatus === 'DEFECTIVE';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className={`rounded-2xl p-5 text-white shadow-lg ${isPassed ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' : isDefective ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-yellow-500 to-orange-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPassed ? <CheckCircle size={28} /> : isDefective ? <XCircle size={28} /> : <AlertTriangle size={28} />}
            <div>
              <h3 className="text-lg font-bold">{isPassed ? 'قطعه سالم' : isDefective ? 'قطعه معیوب' : 'نیاز به بررسی'}</h3>
              <p className="text-sm opacity-90">{result.componentName}</p>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-inner ${gradeColors[result.qualityGrade] || 'bg-gray-500'}`}>
            {result.qualityGrade}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">امتیاز: {result.qualityScore}/100</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{result.detectedIssues.length} ایراد</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Shield size={18} className="text-blue-600" />
          خلاصه بازرسی
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* Healthy Areas */}
      {result.healthyAreas.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2 text-sm">
            <CheckCircle size={16} />
            بخش‌های سالم
          </h4>
          <ul className="space-y-1">
            {result.healthyAreas.map((area, i) => (
              <li key={i} className="text-emerald-700 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues List */}
      {result.detectedIssues.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <Zap size={18} className="text-orange-600" />
            عیوب شناسایی شده
          </h4>
          {result.detectedIssues.map((issue) => (
            <div key={issue.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 border-r-4 border-r-red-400">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {severityIcons[issue.severity]}
                  <span className="font-bold text-slate-800 text-sm">{issue.title}</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {categoryLabels[issue.category] || issue.category}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-2 leading-relaxed">{issue.description}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                <MapPin size={12} />
                {issue.location}
              </div>
              <div className="bg-blue-50 rounded-lg p-2.5 flex items-start gap-2">
                <Wrench size={14} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-blue-800 text-xs font-medium">{issue.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
