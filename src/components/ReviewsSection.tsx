import React, { useState, useMemo } from 'react';
import { Star, MessageSquare, Reply, ExternalLink, Image as ImageIcon, Search, ThumbsUp, CheckCircle } from 'lucide-react';
import { ReviewItem } from '../types';

interface ReviewsSectionProps {
  reviews?: ReviewItem[];
  totalCount?: number | null;
  overallRating?: number | null;
  onOpenPhotoLightbox?: (photoUrl: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews = [],
  totalCount,
  overallRating,
  onOpenPhotoLightbox,
}) => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [onlyOwnerResponse, setOnlyOwnerResponse] = useState(false);

  // Rating distribution calculation
  const stats = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.floor(r.rating || 5);
      if (counts[star] !== undefined) counts[star]++;
      else counts[5]++;
    });
    return counts;
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (selectedStar !== null && Math.floor(r.rating) !== selectedStar) {
        return false;
      }
      if (onlyWithPhotos && (!r.review_photos || r.review_photos.length === 0)) {
        return false;
      }
      if (onlyOwnerResponse && !r.owner_response) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesContent = r.content?.toLowerCase().includes(query);
        const matchesAuthor = r.author?.toLowerCase().includes(query);
        return matchesContent || matchesAuthor;
      }
      return true;
    });
  }, [reviews, selectedStar, onlyWithPhotos, onlyOwnerResponse, searchTerm]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center py-10">
        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h4 className="text-base font-semibold text-slate-700">Chưa có bài đánh giá chi tiết</h4>
        <p className="text-sm text-slate-500 mt-1">Dữ liệu JSON chưa bao gồm danh sách bình luận cho địa điểm này.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header & Overview Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
          <div className="text-center p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 min-w-28">
            <span className="text-4xl font-extrabold text-amber-700 block tracking-tight">
              {overallRating ? overallRating.toFixed(1) : (reviews[0]?.rating || 5).toFixed(1)}
            </span>
            <div className="flex justify-center mt-1 mb-1">
              {renderStars(overallRating || 5)}
            </div>
            <span className="text-xs text-amber-800 font-medium">
              {totalCount ? `${totalCount.toLocaleString('vi-VN')} đánh giá` : `${reviews.length} đánh giá`}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">Đánh giá từ khách hàng</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Tổng hợp {reviews.length} bài đánh giá mẫu chi tiết kèm hình ảnh thực tế và phản hồi từ quản lý.
            </p>

            <div className="flex items-center gap-2 mt-3 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                Đã đồng bộ từ Google Maps
              </span>
            </div>
          </div>
        </div>

        {/* Star Rating Breakdown Bars */}
        <div className="w-full lg:w-72 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats[star] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <button
                key={star}
                onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                className={`w-full flex items-center gap-2 text-xs py-0.5 px-1.5 rounded transition-colors ${
                  selectedStar === star ? 'bg-amber-100/70 font-semibold' : 'hover:bg-slate-50'
                }`}
              >
                <span className="w-6 text-slate-600 text-right">{star} ★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-slate-400 text-left">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo nội dung hoặc tên người đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Xóa
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Star pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStar(null)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                selectedStar === null
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedStar(selectedStar === star ? null : star)}
                className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedStar === star
                    ? 'bg-white text-amber-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {star}★
              </button>
            ))}
          </div>

          {/* Toggle Photos filter */}
          <button
            onClick={() => setOnlyWithPhotos(!onlyWithPhotos)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              onlyWithPhotos
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Có ảnh
          </button>

          {/* Toggle Owner Response filter */}
          <button
            onClick={() => setOnlyOwnerResponse(!onlyOwnerResponse)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              onlyOwnerResponse
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Reply className="w-3.5 h-3.5" />
            Có phản hồi
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            Không tìm thấy bài đánh giá nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredReviews.map((review, idx) => {
            const authorInitial = review.author ? review.author.trim().charAt(0).toUpperCase() : '?';

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 transition-all shadow-2xs space-y-3.5"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {authorInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {review.author_url ? (
                          <a
                            href={review.author_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm text-slate-900 hover:text-rose-600 transition-colors inline-flex items-center gap-1"
                          >
                            <span>{review.author}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-60 hover:opacity-100" />
                          </a>
                        ) : (
                          <span className="font-bold text-sm text-slate-900">{review.author}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <div className="flex items-center">{renderStars(review.rating)}</div>
                        <span>•</span>
                        <span>{review.publish_date}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {review.rating.toFixed(1)} / 5.0
                  </span>
                </div>

                {/* Content */}
                {review.content && (
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {review.content}
                  </p>
                )}

                {/* Review Photos */}
                {review.review_photos && review.review_photos.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {review.review_photos.map((photoUrl, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => onOpenPhotoLightbox?.(photoUrl)}
                        className="relative h-20 w-24 rounded-lg overflow-hidden border border-slate-200/80 shrink-0 group focus:outline-none focus:ring-2 focus:ring-rose-500"
                      >
                        <img
                          src={photoUrl}
                          alt={`Review photo ${pIdx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Owner response quote box */}
                {review.owner_response && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-50/90 border-l-4 border-rose-500 text-xs text-slate-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Reply className="w-3.5 h-3.5 text-rose-600 rotate-180" />
                      <span>Phản hồi từ chủ nhà hàng:</span>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-slate-600 pl-4 border-l border-slate-200">
                      {review.owner_response}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
