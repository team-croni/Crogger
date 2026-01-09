'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronsUpDown } from 'lucide-react';
import Portal from '@components/ui/portal';
import { useLayoutEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  borderless?: boolean;
  icon?: 'chevron' | 'chevrons';
  usePortal?: boolean;
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className = '',
  triggerClassName = '',
  borderless = false,
  icon = 'chevron',
  usePortal = false,
  position = 'bottom-start'
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isOpen && usePortal && menuRef.current && dropdownRef.current) {
      const triggerRect = dropdownRef.current.getBoundingClientRect();
      const menu = menuRef.current;

      let top = 0
      let left = 0;

      switch (position) {
        case 'top-start':
          top = triggerRect.top - menu.offsetHeight;
          left = triggerRect.left;
          break;
        case 'top-end':
          top = triggerRect.top - menu.offsetHeight;
          left = triggerRect.right - menu.offsetWidth;
          break;
        case 'bottom-end':
          top = triggerRect.bottom;
          left = triggerRect.right - menu.offsetWidth;
          break;
        case 'bottom-start':
        default:
          top = triggerRect.bottom;
          left = triggerRect.left;
          break;
      }

      // Apply the calculated position
      menu.style.position = 'fixed';
      menu.style.top = `${top}px`;
      menu.style.left = `${left}px`;
      menu.style.minWidth = `${triggerRect.width}px`;
    }
  }, [isOpen, usePortal, position]);

  const selectedOption = options.find(option => option.value === value);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const getIcon = () => {
    const iconClass = `transition-transform ${icon === 'chevrons' ? 'w-4 h-4 ml-3' : 'w-3.5 h-3.5'} ${(icon !== 'chevrons' && isOpen) ? 'rotate-180' : ''} ${disabled ? 'text-muted-foreground/50' : 'text-muted-foreground'}`;

    if (icon === 'chevrons') {
      return <ChevronsUpDown className={iconClass} />;
    }

    return <ChevronDown className={iconClass} />;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm
          ${triggerClassName}
          ${borderless ? 'border-0 hover:bg-muted-foreground/5' : `bg-input border ${disabled ? 'border-input-border/50' : 'border-input-border not-focus:hover:border-muted-foreground/50'}`} 
          rounded-lg focus:outline-none focus:ring-1 focus:ring-primary
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {getIcon()}
      </button>

      {usePortal ? (
        <Portal selector="body">
          <div
            ref={menuRef}
            className={`fixed z-50 p-1.5 mt-1.5 bg-input border border-input-border rounded-xl shadow-xl/8 dark:shadow-xl/30 overflow-hidden transition-all ${(isOpen && !disabled) ? '' : 'translate-y-1.5 opacity-0 pointer-events-none'}`}
          >
            <div className="max-h-60 overflow-y-auto space-y-1">
              {options.length > 0 ? (
                options.map((option) => (
                  <div
                    key={option.value}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option);
                    }}
                    className={`
                          px-3 pr-6 py-2 text-sm cursor-pointer rounded whitespace-nowrap
                          ${option.value === value ? 'bg-primary dark:bg-muted-foreground/10 text-primary-foreground' : 'text-foreground hover:bg-primary/8 dark:hover:bg-muted-foreground/10'}
                        `}
                  >
                    {option.label}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  옵션이 없습니다
                </div>
              )}
            </div>
          </div>
        </Portal>
      ) : (
        <div className={`absolute z-50 p-1.5 mt-1.5 bg-input border border-input-border rounded-xl shadow-xl/8 dark:shadow-xl/30 overflow-hidden transition-all ${(isOpen && !disabled) ? '' : 'translate-y-1.5 opacity-0 pointer-events-none'}`}>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {options.length > 0 ? (
              options.map((option) => (
                <div
                  key={option.value}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  className={`
                        px-3 pr-6 py-2 text-sm cursor-pointer rounded whitespace-nowrap
                        ${option.value === value ? 'bg-primary dark:bg-muted-foreground/10 text-primary-foreground' : 'text-foreground hover:bg-primary/8 dark:hover:bg-muted-foreground/10'}
                      `}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                옵션이 없습니다
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;