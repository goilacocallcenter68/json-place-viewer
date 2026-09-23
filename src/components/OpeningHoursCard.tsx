import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Banknote } from 'lucide-react';

interface OpeningHoursProps {
  hours?: Record<string, string>;
  priceRange?: string | null;
}

export const OpeningHoursCard: React.FC<OpeningHoursProps> = ({ hours, priceRange }) => {
  if (!hours || Object.keys(hours).length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 text-slate-800 font-semibold">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Giờ hoạt động</span>
          </div>
          <p className="text-sm text-slate-500 italic">Chưa có thông tin giờ mở cửa cụ thể cho địa điểm này.</p>
        </div>

        {priceRange && (
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              Mức giá tham khảo
            </span>
            <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {priceRange}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Vietnamese day mapping from JS getDay()
  // 0: Chủ Nhật, 1: Thứ Hai, 2: Thứ Ba, 3: Thứ Tư, 4: Thứ Năm, 5: Thứ Sáu, 6: Thứ Bảy
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const todayName = dayNames[new Date().getDay()];

  // Standard ordered days starting from Thứ Hai to Chủ Nhật
  const orderedDays = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
  
  // Find current day entry
  const todayHours = hours[todayName];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Clock className="w-5 h-5 text-rose-600" />
          <span>Giờ mở cửa</span>
        </div>
        {todayHours ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Hôm nay: {todayHours}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            <AlertCircle className="w-3.5 h-3.5" />
            Không rõ lịch hôm nay
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {orderedDays.map((day) => {
          const time = hours[day];
          if (!time) return null;
          const isToday = day === todayName;

          return (
            <div
              key={day}
              className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm transition-colors ${
                isToday
                  ? 'bg-rose-50/80 text-rose-950 font-semibold border border-rose-100'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{day}</span>
                {isToday && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-600 text-white">
                    Hôm nay
                  </span>
                )}
              </div>
              <span className={`font-mono ${isToday ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                {time}
              </span>
            </div>
          );
        })}
      </div>

      {priceRange && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-emerald-600" />
            Mức giá tham khảo
          </span>
          <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {priceRange}
          </span>
        </div>
      )}
    </div>
  );
};
