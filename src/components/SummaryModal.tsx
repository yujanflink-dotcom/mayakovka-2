'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Youtube, AlertCircle } from 'lucide-react';

interface SummaryModalProps {
  videoId: string;
  videoTitle: string;
  onClose: () => void;
}

export function SummaryModal({ videoId, videoTitle, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/summarize?videoId=${videoId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al generar resumen');
      } else {
        setSummary(data.summary);
      }
    } catch {
      setError('Error de conexion al generar resumen');
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const openVideo = () => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full md:max-w-lg md:mx-4 bg-gray-900 border border-gray-800
                   rounded-t-2xl md:rounded-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col
                   animate-slide-up shadow-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={18} className="text-yellow-400 shrink-0" />
            <h2 className="text-base font-bold truncate text-white">
              Resumen IA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl
                       active:bg-gray-800 transition-colors text-gray-400"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{videoTitle}</p>

          {loading ? (
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                <span>Generando resumen...</span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Gemini esta viendo el video para extraer los puntos clave.
                Puede tardar unos segundos si el video es extenso.
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {summary?.split('\n').filter((l) => l.trim()).map((line, i) => {
                const bullet = line.replace(/^[-*•]\s*/, '');
                return (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-200 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button
            onClick={openVideo}
            className="w-full flex items-center justify-center gap-2 min-h-[48px] px-4 py-3
                       bg-red-600 active:bg-red-500 rounded-xl text-sm font-semibold text-white
                       transition-colors"
          >
            <Youtube size={18} />
            Ver video completo en YouTube
          </button>
        </div>
      </div>
    </div>
  );
}
