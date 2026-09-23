import React, { useState, useRef } from 'react';
import { Upload, FileJson, AlertCircle, CheckCircle2, X, Clipboard, ArrowRight } from 'lucide-react';
import { PlaceItem } from '../types';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (places: PlaceItem[], sourceName?: string) => void;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [jsonText, setJsonText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateAndImport = (parsed: any, sourceName: string) => {
    try {
      let placesArray: PlaceItem[] = [];
      if (Array.isArray(parsed)) {
        placesArray = parsed;
      } else if (parsed && typeof parsed === 'object') {
        placesArray = [parsed];
      } else {
        throw new Error('Định dạng JSON không hợp lệ: Phải là một mảng danh sách [ { ... } ] hoặc đối tượng địa điểm { ... }');
      }

      if (placesArray.length === 0) {
        throw new Error('File JSON không chứa địa điểm nào.');
      }

      // Check if at least one object has title
      const validPlaces = placesArray.filter((p) => p && typeof p === 'object' && (p.title || p.place_id || p.address));
      if (validPlaces.length === 0) {
        throw new Error('Dữ liệu không khớp định dạng thông tin địa điểm (thiếu các trường cơ bản như title, address, place_id).');
      }

      onImport(placesArray, sourceName);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi xử lý định dạng dữ liệu.');
    }
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMessage('Vui lòng chọn một file có định dạng .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        validateAndImport(parsed, file.name);
      } catch (err: any) {
        setErrorMessage(`Lỗi phân tích cú pháp JSON: ${err.message}`);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Không thể đọc file đã chọn.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    setErrorMessage(null);
    if (!jsonText.trim()) {
      setErrorMessage('Vui lòng dán nội dung JSON vào ô bên dưới.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      validateAndImport(parsed, 'Dữ liệu dán trực tiếp');
    } catch (err: any) {
      setErrorMessage(`Cú pháp JSON không hợp lệ: ${err.message}`);
    }
  };

  return (
    <div
      id="json-import-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
      onClick={onClose}
    >
      <div
        id="json-import-modal-card"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Nhập file JSON địa điểm</h3>
              <p className="text-xs text-slate-500">Tải lên file hoặc dán trực tiếp mã JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          <button
            onClick={() => { setActiveTab('upload'); setErrorMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-rose-600 text-rose-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Tải lên từ máy (.json)
          </button>
          <button
            onClick={() => { setActiveTab('paste'); setErrorMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'paste'
                ? 'border-rose-600 text-rose-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clipboard className="w-3.5 h-3.5" />
            Dán mã JSON
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-rose-500 bg-rose-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Kéo thả file JSON vào đây hoặc <span className="text-rose-600 underline">chọn từ thiết bị</span>
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hỗ trợ file cấu trúc Google Maps place scraper: danh sách nhà hàng, địa chỉ, hình ảnh, bài đánh giá và tiện ích.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder="Dán mảng JSON [ { &quot;title&quot;: &quot;...&quot;, &quot;rating&quot;: 4.9, ... } ] vào đây..."
                  rows={8}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Hỗ trợ cả mảng [ ... ] hoặc đối tượng đơn {`{ ... }`}</span>
                <button
                  type="button"
                  onClick={() => setJsonText('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  Xóa nội dung
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Hủy
          </button>
          {activeTab === 'paste' && (
            <button
              onClick={handlePasteSubmit}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Phân tích & Hiển thị</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
