import React, { useState } from 'react';
import {
  Accessibility,
  Building2,
  Utensils,
  Sparkles,
  Award,
  Wine,
  Coffee,
  Wifi,
  Smile,
  Users,
  CalendarCheck,
  CreditCard,
  Baby,
  Car,
  Dog,
  Check,
  Filter,
} from 'lucide-react';

interface AboutSectionProps {
  about?: Record<string, string[]>;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!about || Object.keys(about).length === 0) {
    return null;
  }

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('khuyết tật') || lower.includes('xe lăn')) return <Accessibility className="w-4 h-4 text-sky-600" />;
    if (lower.includes('doanh nghiệp') || lower.includes('sở hữu')) return <Building2 className="w-4 h-4 text-purple-600" />;
    if (lower.includes('tùy chọn') || lower.includes('dịch vụ tại chỗ')) return <Utensils className="w-4 h-4 text-amber-600" />;
    if (lower.includes('nổi bật')) return <Sparkles className="w-4 h-4 text-amber-500" />;
    if (lower.includes('nổi tiếng')) return <Award className="w-4 h-4 text-indigo-600" />;
    if (lower.includes('dịch vụ') || lower.includes('rượu') || lower.includes('bia')) return <Wine className="w-4 h-4 text-rose-600" />;
    if (lower.includes('lựa chọn ăn uống') || lower.includes('bữa')) return <Coffee className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('tiện nghi') || lower.includes('wifi')) return <Wifi className="w-4 h-4 text-blue-600" />;
    if (lower.includes('không khí') || lower.includes('bầu')) return <Smile className="w-4 h-4 text-pink-500" />;
    if (lower.includes('khách hàng') || lower.includes('lgbtq')) return <Users className="w-4 h-4 text-teal-600" />;
    if (lower.includes('kế hoạch') || lower.includes('đặt chỗ')) return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('thanh toán') || lower.includes('thẻ')) return <CreditCard className="w-4 h-4 text-cyan-600" />;
    if (lower.includes('trẻ em') || lower.includes('bé')) return <Baby className="w-4 h-4 text-orange-500" />;
    if (lower.includes('bãi đỗ') || lower.includes('xe')) return <Car className="w-4 h-4 text-slate-600" />;
    if (lower.includes('thú cưng') || lower.includes('chó')) return <Dog className="w-4 h-4 text-amber-700" />;
    return <Sparkles className="w-4 h-4 text-slate-500" />;
  };

  const categories = Object.keys(about);
  const filteredCategories = selectedCategory
    ? categories.filter((c) => c === selectedCategory)
    : categories;

  const totalItemsCount = categories.reduce((sum, cat) => sum + (about[cat]?.length || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Tiện ích & Thông tin chi tiết</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {totalItemsCount} tiêu chí
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp từ Google Maps về dịch vụ, tiện nghi và không gian
          </p>
        </div>

        {/* Quick Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all shrink-0 ${
              selectedCategory === null
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({categories.length})
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((category) => {
          const items = about[category];
          if (!items || items.length === 0) return null;

          return (
            <div
              key={category}
              className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/60 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm mb-3">
                <span className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200/60">
                  {getCategoryIcon(category)}
                </span>
                <span>{category}</span>
                <span className="ml-auto text-[11px] text-slate-400 font-normal">
                  {items.length} mục
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200/70 text-slate-700 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
