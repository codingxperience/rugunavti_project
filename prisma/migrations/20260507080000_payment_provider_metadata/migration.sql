ALTER TABLE "Payment"
ADD COLUMN "provider" TEXT,
ADD COLUMN "providerReference" TEXT,
ADD COLUMN "providerStatus" TEXT,
ADD COLUMN "checkoutUrl" TEXT,
ADD COLUMN "failureReason" TEXT,
ADD COLUMN "rawPayload" JSONB,
ADD COLUMN "verifiedAt" TIMESTAMP(3);

CREATE INDEX "Payment_provider_providerReference_idx" ON "Payment"("provider", "providerReference");
