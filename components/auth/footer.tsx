import { copyright } from "@constants/copyrights";

const Footer = () => {
  return (
    <div className='max-w-md mt-auto'>
      <p className="px-2 mb-5 text-xs text-center font-medium text-muted-foreground/70 dark:text-muted-foreground/60 slide-up">
        본 서비스는 입력된 Axiom 토큰을 통해 외부 로그 데이터를 조회하는 뷰어 기능만 제공하며,
        사용자의 개인정보나 로그 데이터를 저장하지 않습니다.
      </p>
      <p className="px-2 mb-4 text-xs text-center font-medium text-muted-foreground/70 dark:text-muted-foreground/60 slide-up">
        {copyright}
      </p>
    </div>
  );
}

export default Footer;