'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  selector: string;
}

const Portal = ({ children, selector }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const el = typeof window !== 'undefined' ? document.querySelector(selector) : null;

  if (!mounted || !el) return null;

  return createPortal(children, el);
}

export default Portal;