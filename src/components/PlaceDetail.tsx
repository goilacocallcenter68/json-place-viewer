import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Utensils,
  CalendarCheck,
  Share2,
  ExternalLink,
  Images,
  MessageSquare,
  Compass,
  FileCode,
  Copy,
  Check,
  ChevronRight,
  Info,
  Banknote,
} from 'lucide-react';
import { PlaceItem } from '../types';
import { OpeningHoursCard } from './OpeningHoursCard';
import { AboutSection } from './AboutSection';
import { ReviewsSection } from './ReviewsSection';
import { MapPreview } from './MapPreview';

interface PlaceDetailProps {
  place: PlaceItem;
  onOpenPhotoLightbox: (photoUrl: string) => void;
}

export const PlaceDetail: React.FC<PlaceDetailProps> = ({
  place,
  onOpenPhotoLightbox,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'reviews' | 'json'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const photos = place.photos || [];
  const reviews = place.reviews || [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.title,
        text: `Xem thông tin về ${place.title} tại ${place.address}`,
        url: place.url || window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(place.url || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(place, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Photo Banner Mosaic */}
      {photos.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 h-64 md:h-80">
            {/* Primary Large Image */}
            <div
              onClick={() => onOpenPhotoLightbox(photos[0])}
              className="md:col-span-2 h-full cursor-pointer relative group overflow-hidden"
            >
              <img
                src={photos[0]}
                alt={place.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-white text-xs font-medium">
                Ảnh đại diện chính
              </div>
            </div>

            {/* Secondary Image Grid */}
            <div className="hidden md:grid grid-cols-2 col-span-2 gap-1.5 h-full">
              {photos.slice(1, 5).map((photo, pIdx) => {
                const isLast = pIdx === 3 && photos.length > 5;
                return (
                  <div
                    key={pIdx}
                    onClick={() => onOpenPhotoLightbox(photo)}
                    className="relative cursor-pointer group overflow-hidden h-full"
                  >
                    <img
                      src={photo}
                      alt={`Photo ${pIdx + 2}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-center p-2">
                        <Images className="w-6 h-6 mb-1 text-rose-300" />
                        <span className="font-bold text-sm">+{photos.length - 4} ảnh khác</span>
                        <span className="text-[11px] text-slate-300">Nhấn để xem toàn bộ</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Photo Counter Badge */}
          <button
            onClick={() => setActiveTab('photos')}
            className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold hover:bg-black/90 transition-all flex items-center gap-1.5 shadow-md border border-white/20"
          >
            <Images className="w-3.5 h-3.5" />
            <span>Xem tất cả ({photos.length}) ảnh</span>
          </button>
        </div>
      )}

      {/* Main Place Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-3xl">
            {/* Category, Price Range, and Place Id */}
            <div className="flex flex-wrap items-center gap-2">
              {place.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/80">
                  {place.category}
                </span>
              )}
              {place.price_range && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{place.price_range}</span>
                </span>
              )}
              {place.place_id && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-slate-100">
                  ID: {place.place_id.slice(0, 14)}...
                </span>
              )}
            </div>

            {/* Restaurant Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {place.title}
            </h1>

            {/* Ratings, reviews, and address */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-600">
              {place.rating !== null && place.rating !== undefined && (
                <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/70">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="text-amber-800">{place.rating.toFixed(1)}</span>
                  {place.reviews_count && (
                    <span className="text-slate-500 font-normal">
                      ({place.reviews_count.toLocaleString('vi-VN')} đánh giá)
                    </span>
                  )}
                </div>
              )}

              {place.address && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="line-clamp-1">{place.address}</span>
                </div>
              )}
            </div>

            {place.description && (
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {place.description}
              </p>
            )}
          </div>

          {/* Share & Quick Maps Button */}
          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
            {place.url && (
              <a
                href={place.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <span>Mở Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã sao chép link' : 'Chia sẻ'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Ribbon */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100">
          {place.phone && (
            <a
              href={`tel:${place.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{place.phone}</span>
            </a>
          )}

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Trang web chính thức</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {place.menu && (
            <a
              href={place.menu}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80 transition-colors"
            >
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>Xem thực đơn</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}

          {place.booking_link && (
            <a
              href={place.booking_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đặt bàn trực tuyến</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
          )}
        </div>
      </div>

      {/* Tabs navigation bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'border-rose-600 text-rose-600 bg-white/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Tổng quan & Tiện ích</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'photos'
              ? 'border-rose-600 text-rose-600 bg-white/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>Hình ảnh ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'reviews'
              ? 'border-rose-600 text-rose-600 bg-white/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Đánh giá ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
            activeTab === 'json'
              ? 'border-rose-600 text-rose-600 bg-white/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Dữ liệu JSON gốc</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <OpeningHoursCard hours={place.opening_hours} priceRange={place.price_range} />
            </div>
            <div className="lg:col-span-2">
              <MapPreview
                coordinates={place.coordinates}
                address={place.address}
                plusCode={place.plus_code}
                googleMapsUrl={place.url}
                title={place.title}
              />
            </div>
          </div>

          <AboutSection about={place.about} />
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bộ sưu tập hình ảnh</h3>
              <p className="text-xs text-slate-500">Toàn bộ {photos.length} ảnh chất lượng cao được ghi nhận</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Nhấp vào ảnh để xem toàn màn hình
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {photos.map((photoUrl, idx) => (
              <button
                key={idx}
                onClick={() => onOpenPhotoLightbox(photoUrl)}
                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <img
                  src={photoUrl}
                  alt={`Photo ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Images className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                </div>
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono opacity-80 group-hover:opacity-100">
                  #{idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <ReviewsSection
          reviews={place.reviews}
          totalCount={place.reviews_count}
          overallRating={place.rating}
          onOpenPhotoLightbox={onOpenPhotoLightbox}
        />
      )}

      {activeTab === 'json' && (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-200">
              <FileCode className="w-5 h-5 text-rose-400" />
              <span className="font-mono text-sm font-bold">Cấu trúc dữ liệu JSON của địa điểm này</span>
            </div>
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Đã sao chép' : 'Sao chép JSON'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/50 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-700">
            {JSON.stringify(place, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
