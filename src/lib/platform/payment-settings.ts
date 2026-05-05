type PaymentChannel = {
  label: string;
  detail: string;
  referenceHint: string;
  configured: boolean;
};

function readOptionalEnv(key: string) {
  const value = process.env[key]?.trim();
  return value ? value : null;
}

export function getPaymentChannels() {
  const mtnNumber = readOptionalEnv("RUGUNA_MTN_MOMO_NUMBER");
  const airtelNumber = readOptionalEnv("RUGUNA_AIRTEL_MONEY_NUMBER");
  const bankName = readOptionalEnv("RUGUNA_BANK_NAME");
  const bankAccountName = readOptionalEnv("RUGUNA_BANK_ACCOUNT_NAME");
  const bankAccountNumber = readOptionalEnv("RUGUNA_BANK_ACCOUNT_NUMBER");
  const bankBranch = readOptionalEnv("RUGUNA_BANK_BRANCH");
  const provider = readOptionalEnv("RUGUNA_PAYMENT_PROVIDER");

  const channels: PaymentChannel[] = [
    {
      label: "MTN Mobile Money",
      detail: mtnNumber ? `Pay to ${mtnNumber}` : "Confirm the official MTN payment line with finance before paying.",
      referenceHint: "Use the MoMo transaction ID.",
      configured: Boolean(mtnNumber),
    },
    {
      label: "Airtel Money",
      detail: airtelNumber ? `Pay to ${airtelNumber}` : "Confirm the official Airtel payment line with finance before paying.",
      referenceHint: "Use the Airtel transaction ID.",
      configured: Boolean(airtelNumber),
    },
    {
      label: "Bank transfer",
      detail:
        bankName && bankAccountName && bankAccountNumber
          ? `${bankName} · ${bankAccountName} · ${bankAccountNumber}${bankBranch ? ` · ${bankBranch}` : ""}`
          : "Finance can add bank account details through deployment environment settings.",
      referenceHint: "Use the bank receipt, deposit slip, or transfer reference.",
      configured: Boolean(bankName && bankAccountName && bankAccountNumber),
    },
    {
      label: "Card or virtual card",
      detail: provider
        ? `Online checkout provider: ${provider}.`
        : "Finance can activate a gateway for Visa, Mastercard, and supported virtual cards.",
      referenceHint: "Use the checkout receipt or card payment reference.",
      configured: Boolean(provider),
    },
  ];

  return channels;
}
