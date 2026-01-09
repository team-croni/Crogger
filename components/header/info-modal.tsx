'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import LogoSymbolSvg from "@svgs/logo.svg";
import { useInfoModalStore } from '@stores/infoModalStore';
import { copyright } from '@constants/copyrights';
import { version } from '@constants/version';

const InfoModal = () => {
  const { isOpen, closeModal } = useInfoModalStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs fade-in"
      onClick={closeModal}
    >
      <div
        className="bg-background rounded-2xl border shadow-lg w-full max-w-md overflow-hidden flex flex-col slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <LogoSymbolSvg className='h-6 w-6 mr-2 text-primary pointer-events-none select-none' />
              <h2 className="text-xl font-semibold text-foreground">Crogger Info.</h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 -mr-2 -mt-2 text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 text-sm text-muted-foreground/80">
            <div className="pt-2">
              <h3 className="font-medium text-muted-foreground mb-2">버전 정보</h3>
              <div className="flex items-center px-3 py-2 bg-muted-foreground/4 dark:bg-inverse/20 rounded-lg text-muted-foreground">
                <span className="font-medium">Version:</span>
                <span className="ml-2 text-foreground/90">{version}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-muted-foreground mb-2">서비스 설명</h3>
              <p className="px-3 py-2 bg-muted-foreground/4 dark:bg-inverse/20 rounded-lg text-foreground">
                Crogger는 Axiom 로그 분석을 위한 대시보드입니다. 실시간 로그 모니터링, 필터링, 시각화를 제공합니다.
              </p>
            </div>

            <div className="pt-5 border-t">
              <p className="text-center text-foreground/50 text-xs">
                {copyright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;