'use client';

import { useAuthStore } from '@stores/authStore';

const RememberCheckbox = () => {
  const {
    remember,
    toggleRemember,
  } = useAuthStore();
  return (
    <div className="flex items-center pt-2 mt-2 slide-up">
      <input
        id="remember"
        type="checkbox"
        checked={remember}
        onChange={toggleRemember}
      />
      <label htmlFor="remember" className="ml-2 text-sm text-foreground cursor-pointer">
        정보 기억하기
      </label>
    </div>
  );
}

export default RememberCheckbox;