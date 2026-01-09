'use client';

import { RememberCheckbox, TokenHistoryList, TokenInputField } from "@components/auth";

const TokenInputForm = () => {
  return (
    <>
      <TokenInputField />
      <TokenHistoryList />
      <RememberCheckbox />
    </>
  );
}

export default TokenInputForm;