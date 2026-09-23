import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';

interface PhotoLightboxProps {
  photos: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      id="photo-lightbox-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
            {currentIndex + 1} / {photos.length}
          </span>
          {title && (
            <span className="text-sm font-medium text-slate-300 truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={currentPhoto}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Mở ảnh gốc trong tab mới"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            id="close-lightbox-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-colors"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {currentIndex > 0 && (
          <button
            id="prev-photo-btn"
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105"
            title="Ảnh trước (Mũi tên trái)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentPhoto}
          alt={`Photo ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl select-none"
        />

        {currentIndex < photos.length - 1 && (
          <button
            id="next-photo-btn"
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all hover:scale-105"
            title="Ảnh tiếp theo (Mũi tên phải)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails rail */}
      <div
        className="overflow-x-auto py-2 flex items-center justify-center gap-2 max-w-4xl mx-auto px-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {photos.slice(Math.max(0, currentIndex - 5), currentIndex + 6).map((img, idx) => {
          const actualIndex = Math.max(0, currentIndex - 5) + idx;
          return (
            <button
              key={actualIndex}
              onClick={() => onNavigate(actualIndex)}
              className={`relative h-14 w-20 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                actualIndex === currentIndex
                  ? 'border-rose-500 scale-105 shadow-md'
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${actualIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
