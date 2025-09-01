-- CreateTable
CREATE TABLE "public"."forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fields" JSONB[],
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submissions" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "form_id" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "forms_created_at_idx" ON "public"."forms"("created_at" DESC);

-- CreateIndex
CREATE INDEX "submissions_form_id_submitted_at_idx" ON "public"."submissions"("form_id", "submitted_at" DESC);

-- AddForeignKey
ALTER TABLE "public"."submissions" ADD CONSTRAINT "submissions_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
