'use client'

import ThemeToggle from "@components/header/theme-toggle";
import Dropdown from "@components/ui/dropdown";
import { useAuth } from "@hooks/useAuth";
import { useAuthStore } from "@stores/authStore";
import { Ring } from "ldrs/react";
import { LogOut } from "lucide-react";
import LogoSymbolSvg from "@svgs/logo.svg";
import InfoButton from "@components/header/info-button";

const Header = () => {
  const { datasets, selectedDataset } = useAuthStore();
  const { handleTokenReset } = useAuth();

  // 더미 모드 여부 확인
  const isDummyMode = process.env.NEXT_PUBLIC_DUMMY_MODE === 'true';

  // 더미 모드일 경우 실제 서비스와 유사한 더미 데이터셋 사용
  const dummyDatasets = [
    'crogger-production',
    'crogger-staging',
    'crogger-development',
    'crogger-analytics',
    'crogger-payments'
  ];

  const displayDatasets = isDummyMode ? dummyDatasets : datasets;
  const displaySelectedDataset = isDummyMode && !selectedDataset ? 'crogger-production' : selectedDataset;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <LogoSymbolSvg className='h-5 w-5 ml-1 mr-2 text-primary pointer-events-none select-none' />
        <p className={`flex items-center text-xl font-semibold font-baloo tracking-[-0.5px] text-foreground pointer-events-none select-none`}>
          Crogger
        </p>
        <div className="border-l-[1.5px] border h-7 ml-6 mr-3 rotate-15" />
        <div className="-my-2">
          {!displayDatasets.length ? (
            <div className="flex items-center justify-center ml-4">
              <Ring
                size="18"
                speed="2"
                stroke={2}
                color="var(--color-foreground)"
                bgOpacity={0.2}
              />
            </div>
          ) :
            <Dropdown
              options={displayDatasets.map(ds => ({ value: ds, label: ds }))}
              value={displaySelectedDataset || ''}
              onChange={(value) => {
                useAuthStore.getState().setSelectedDataset(value);
              }}
              placeholder={!displayDatasets.length ? '로딩 중...' : '데이터셋 선택'}
              disabled={!displayDatasets.length}
              borderless={true}
              icon="chevrons"
              className="fade-in"
              triggerClassName='w-auto! text-base! font-medium text-foreground/70 hover:text-foreground disabled:cursor-default'
            />
          }
        </div>
      </div>

      <div className="flex items-center gap-3">
        <InfoButton />
        <ThemeToggle />
        <button
          onClick={handleTokenReset}
          className="flex items-center bg-input px-3 py-2 border border-input-border hover:border-muted-foreground/50 text-foreground text-sm rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          토큰 재설정
        </button>

      </div>
    </div>
  );
}

export default Header;