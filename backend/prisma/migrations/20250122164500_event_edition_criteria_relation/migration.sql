-- DropForeignKey
ALTER TABLE "guidance" DROP CONSTRAINT "guidance_event_edition_id_fkey";

-- AddForeignKey
ALTER TABLE "evaluation_criteria" ADD CONSTRAINT "evaluation_criteria_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guidance" ADD CONSTRAINT "guidance_event_edition_id_fkey" FOREIGN KEY ("event_edition_id") REFERENCES "event_edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
