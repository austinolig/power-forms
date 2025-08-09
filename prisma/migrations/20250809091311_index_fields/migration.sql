-- CreateIndex
CREATE INDEX "forms_created_at_idx" ON "public"."forms"("created_at" DESC);

-- CreateIndex
CREATE INDEX "submissions_form_id_submitted_at_idx" ON "public"."submissions"("form_id", "submitted_at" DESC);
