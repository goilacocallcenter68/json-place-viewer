import React from 'react';
import {
  FileJson,
  Upload,
  RotateCcw,
  Download,
  Store,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  placesCount: number;
  sourceName: string;
  isCustomData: boolean;
  onOpenImportModal: () => void;
  onResetDefault: () => void;
  onExportJson: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  placesCount,
  sourceName,
  isCustomData,
  onOpenImportModal,
  onResetDefault,
  onExportJson,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                JSON Place Viewer
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                {placesCount} địa điểm
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
              Nguồn: <span className="font-medium text-slate-700">{sourceName}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset button - highlighted if data has been modified / custom */}
          <button
            id="reset-default-btn"
            onClick={onResetDefault}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isCustomData
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Khôi phục lại dữ liệu mặc định ban đầu"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isCustomData ? 'text-amber-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Đặt lại mặc định</span>
            <span className="sm:hidden">Reset</span>
          </button>

          {/* Export JSON button */}
          <button
            id="export-json-btn"
            onClick={onExportJson}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            title="Tải về file JSON hiện tại"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất JSON</span>
          </button>

          {/* Upload JSON file button */}
          <button
            id="import-json-btn"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập file JSON</span>
          </button>
        </div>
      </div>
    </header>
  );
};
