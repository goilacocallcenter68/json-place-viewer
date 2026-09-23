import React, { useState } from 'react';
import { Star, MapPin, Search, ChevronRight, Store, Banknote } from 'lucide-react';
import { PlaceItem } from '../types';

interface PlaceSelectorProps {
  places: PlaceItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  places,
  selectedIndex,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (places.length <= 1) {
    return null;
  }

  const filtered = places.map((place, index) => ({ place, index })).filter(({ place }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = place.title?.toLowerCase().includes(q);
    const catMatch = place.category?.toLowerCase().includes(q);
    const addrMatch = place.address?.toLowerCase().includes(q);
    return titleMatch || catMatch || addrMatch;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Danh sách địa điểm trong file ({places.length})
          </h2>
        </div>

        {places.length > 3 && (
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc loại hình..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {/* Place item cards/tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(({ place, index }) => {
          const isSelected = index === selectedIndex;
          const thumb = place.photos?.[0];

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={place.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-400 font-bold">
                  <Store className="w-6 h-6" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {place.category && (
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                      {place.category}
                    </span>
                  )}
                  {isSelected && (
                    <span className="ml-auto text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                      Đang xem
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                  {place.title}
                </h3>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  {place.rating && (
                    <span className="flex items-center gap-0.5 font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {place.rating.toFixed(1)}
                    </span>
                  )}
                  {place.reviews_count && (
                    <span>({place.reviews_count.toLocaleString('vi-VN')} đánh giá)</span>
                  )}
                  {place.price_range && (
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      <Banknote className="w-2.5 h-2.5 text-emerald-600" />
                      {place.price_range}
                    </span>
                  )}
                </div>

                {place.address && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {place.address}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
