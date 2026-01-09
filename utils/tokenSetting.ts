/**
 * 토큰 문자열을 마스킹하여 안전하게 표시하는 함수입니다.
 * 처음 4자리와 마지막 12자리는 그대로 표시하고, 중간 부분은 마스킹 처리합니다.
 *
 * @param {string} token - 마스킹할 토큰 문자열
 * @returns {string} 마스킹된 토큰 문자열
 */
export const renderMaskedToken = (token: string) => {
  let maskedPart = '';
  for (let i = 0; i < token.length; i++) {
    const char = token[i];
    // 처음 4자리, 마지막 12자리 또는 하이픈(-)은 보여주고, 나머지는 마스킹
    if (i < 4 || i >= token.length - 12 || char === '-') {
      maskedPart += char;
    } else {
      maskedPart += '⁕';
    }
  }
  return maskedPart;
};