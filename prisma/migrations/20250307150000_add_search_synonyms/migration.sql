-- CreateTable
CREATE TABLE "search_concept_groups" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100) NOT NULL,

    CONSTRAINT "search_concept_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_concept_terms" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "term" VARCHAR(255) NOT NULL,
    "lang" VARCHAR(5),

    CONSTRAINT "search_concept_terms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "search_concept_groups_code_key" ON "search_concept_groups"("code");

-- CreateIndex
CREATE INDEX "search_concept_terms_term_idx" ON "search_concept_terms"("term");

-- CreateIndex
CREATE UNIQUE INDEX "search_concept_terms_group_id_term_key" ON "search_concept_terms"("group_id", "term");

-- AddForeignKey
ALTER TABLE "search_concept_terms" ADD CONSTRAINT "search_concept_terms_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "search_concept_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
