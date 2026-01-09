'use client'

import { useInfoModalStore } from "@stores/infoModalStore";
import { Info } from "lucide-react";

const InfoButton = () => {
  const { openModal } = useInfoModalStore();
  return (
    <button
      onClick={openModal}
      className="flex items-center justify-center bg-input w-9 h-9 border border-input-border hover:border-muted-foreground/50 text-foreground rounded-full"
      aria-label="정보"
    >
      <Info className="w-4 h-4" />
    </button>
  )
};

export default InfoButton;
