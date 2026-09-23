import React, { useState } from 'react';
import { MapPin, Navigation, Copy, Check, ExternalLink, Compass } from 'lucide-react';
import { Coordinates } from '../types';

interface MapPreviewProps {
  coordinates?: Coordinates | null;
  address?: string | null;
  plusCode?: string | null;
  googleMapsUrl?: string | null;
  title: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  coordinates,
  address,
  plusCode,
  googleMapsUrl,
  title,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const hasCoords = coordinates && coordinates.latitude && coordinates.longitude;
  const lat = coordinates?.latitude ?? 21.03309;
  const lng = coordinates?.longitude ?? 105.852458;

  // OpenStreetMap embed URL with marker
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;

  const directionsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || title)}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Vị trí & Bản đồ</h3>
            <p className="text-xs text-slate-500">Tọa độ địa lý và chỉ đường thực tế</p>
          </div>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Mở trên Google Maps</span>
          <ExternalLink className="w-3 h-3 opacity-80" />
        </a>
      </div>

      {/* Address & Meta Chips */}
      <div className="space-y-2.5 text-xs">
        {address && (
          <div className="flex items-start justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block">Địa chỉ chi tiết:</span>
                <span className="text-slate-800 font-medium">{address}</span>
              </div>
            </div>
            <button
              onClick={() => handleCopy(address, 'address')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
              title="Sao chép địa chỉ"
            >
              {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {plusCode && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-slate-500">Plus Code:</span>
                <span className="font-mono font-medium text-slate-800">{plusCode}</span>
              </div>
              <button
                onClick={() => handleCopy(plusCode, 'plusCode')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Sao chép Plus Code"
              >
                {copiedField === 'plusCode' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {hasCoords && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-slate-500">Tọa độ:</span>
                <span className="font-mono font-medium text-slate-800">
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
              </div>
              <button
                onClick={() => handleCopy(`${lat}, ${lng}`, 'coords')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Sao chép tọa độ"
              >
                {copiedField === 'coords' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map iframe */}
      {hasCoords ? (
        <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
          <iframe
            title={`Map for ${title}`}
            src={osmEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
          Không có dữ liệu tọa độ địa lý để hiển thị bản đồ trực tiếp.
        </div>
      )}
    </div>
  );
};
