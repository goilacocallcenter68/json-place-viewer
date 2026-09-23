/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlaceItem } from './types';
import { DEFAULT_PLACES_DATA } from './defaultData';
import { Navbar } from './components/Navbar';
import { PlaceSelector } from './components/PlaceSelector';
import { PlaceDetail } from './components/PlaceDetail';
import { JsonImportModal } from './components/JsonImportModal';
import { PhotoLightbox } from './components/PhotoLightbox';
import {
  Upload,
  RotateCcw,
  CheckCircle2,
  FileJson,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [places, setPlaces] = useState<PlaceItem[]>(DEFAULT_PLACES_DATA);
  const [sourceName, setSourceName] = useState<string>('Dữ liệu mẫu mặc định (2 nhà hàng)');
  const [isCustomData, setIsCustomData] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global drag-and-drop indicator
  const [isWindowDragging, setIsWindowDragging] = useState<boolean>(false);

  // Photo Lightbox state
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    photos: string[];
    currentIndex: number;
    title?: string;
  }>({
    isOpen: false,
    photos: [],
    currentIndex: 0,
    title: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleImport = (newPlaces: PlaceItem[], name = 'File vừa tải lên') => {
    setPlaces(newPlaces);
    setSelectedIndex(0);
    setSourceName(`${name} (${newPlaces.length} địa điểm)`);
    setIsCustomData(true);
    showToast(`Đã tải thành công ${newPlaces.length} địa điểm từ ${name}`);
  };

  const handleResetDefault = () => {
    setPlaces(DEFAULT_PLACES_DATA);
    setSelectedIndex(0);
    setSourceName('Dữ liệu mẫu mặc định (2 nhà hàng)');
    setIsCustomData(false);
    showToast('Đã khôi phục về dữ liệu JSON mẫu ban đầu');
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(places, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `places_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Đã tải xuống file JSON thành công');
  };

  const handleOpenPhotoLightbox = (photoUrl: string) => {
    const currentPlace = places[selectedIndex] || places[0];
    const allPhotos = currentPlace?.photos || [];
    const index = allPhotos.indexOf(photoUrl);
    setLightboxState({
      isOpen: true,
      photos: allPhotos.length > 0 ? allPhotos : [photoUrl],
      currentIndex: index >= 0 ? index : 0,
      title: currentPlace?.title || 'Hình ảnh',
    });
  };

  // Drag & drop onto window handler
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsWindowDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
      if (e.relatedTarget === null) {
        setIsWindowDragging(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsWindowDragging(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.json') || file.type === 'application/json') {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const text = event.target?.result as string;
              const parsed = JSON.parse(text);
              const list = Array.isArray(parsed) ? parsed : [parsed];
              handleImport(list, file.name);
            } catch (err: any) {
              showToast('Lỗi: File JSON không đúng cú pháp.');
            }
          };
          reader.readAsText(file);
        } else {
          showToast('Vui lòng chỉ thả file có định dạng .json');
        }
      }
    };

    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);

    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  const activePlace = places[selectedIndex] || places[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 relative">
      {/* Window Drag Overlay Indicator */}
      {isWindowDragging && (
        <div className="fixed inset-0 z-50 bg-rose-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none p-6 text-center animate-in fade-in duration-150">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white flex items-center justify-center mb-4">
            <Upload className="w-10 h-10 text-white animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold">Thả file JSON vào đây</h2>
          <p className="text-sm text-rose-200 mt-2">
            Ứng dụng sẽ tự động phân tích và hiển thị dữ liệu địa điểm ngay lập tức!
          </p>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        placesCount={places.length}
        sourceName={sourceName}
        isCustomData={isCustomData}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onResetDefault={handleResetDefault}
        onExportJson={handleExportJson}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Quick status banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 mb-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-800">
                  {isCustomData ? 'Đang hiển thị dữ liệu tùy chỉnh' : 'Đang hiển thị dữ liệu mặc định'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600">
                  {places.length} địa điểm
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Bạn có thể kéo thả file .json vào bất kỳ vị trí nào trên màn hình, hoặc nhấn nút Nhập file JSON.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCustomData && (
              <button
                onClick={handleResetDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại file gốc</span>
              </button>
            )}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Đổi file khác</span>
            </button>
          </div>
        </div>

        {/* Place Selector if multiple places */}
        {places.length > 0 && (
          <PlaceSelector
            places={places}
            selectedIndex={selectedIndex}
            onSelect={(idx) => setSelectedIndex(idx)}
          />
        )}

        {/* Place Detail View */}
        {activePlace ? (
          <PlaceDetail
            place={activePlace}
            onOpenPhotoLightbox={handleOpenPhotoLightbox}
          />
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <FileJson className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Không có dữ liệu địa điểm</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              File JSON hiện tại không chứa đối tượng địa điểm hợp lệ nào. Bạn có thể nhấn đặt lại dữ liệu mặc định để tiếp tục.
            </p>
            <button
              onClick={handleResetDefault}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Khôi phục dữ liệu mặc định
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* JSON Import Modal */}
      <JsonImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Fullscreen Photo Lightbox */}
      <PhotoLightbox
        photos={lightboxState.photos}
        currentIndex={lightboxState.currentIndex}
        isOpen={lightboxState.isOpen}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        onNavigate={(newIdx) => setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))}
        title={lightboxState.title}
      />
    </div>
  );
}
