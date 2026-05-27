/**
 * GET /api/ai-job-risk/pdf/[resultId] — stream the user's report as a PDF.
 *
 * Authenticated owner only. Generates on-demand from the cached reportContent
 * so the work is fast (~1s) — no Vercel Blob caching for v1; can be added if
 * download volume warrants it.
 */

import { renderToBuffer } from "@react-pdf/renderer";

import { auth } from "@/lib/auth";
import { ReportPDF, pdfFilename } from "@/lib/ai-job-risk/pdf";
import { getRoleConfig } from "@/lib/ai-job-risk/roles";
import {
  ensureReportContent,
  getAssessmentResult,
} from "@/lib/ai-job-risk/persist";
import type { SelectedPivotPath } from "@/lib/ai-job-risk/types";

export const maxDuration = 30;

interface RouteParams {
  params: Promise<{ resultId: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { resultId } = await params;

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await getAssessmentResult(resultId);
  if (!result) return new Response("Not found", { status: 404 });
  if (result.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  const roleConfig = getRoleConfig(result.roleAssessed);
  if (!roleConfig) return new Response("Role not found", { status: 404 });

  const reportContent = await ensureReportContent(resultId, roleConfig);
  if (!reportContent) {
    return new Response("Report not available", { status: 500 });
  }

  const selectedPivots = (result.selectedPivotPaths ??
    []) as unknown as SelectedPivotPath[];

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(
      <ReportPDF
        compositeScore={result.compositeScore}
        tier={result.tier}
        factorBreakdown={{
          taskAutomatability: result.taskAutomatability,
          adoptionVelocity: result.adoptionVelocity,
          skillDifferentiationRaw: result.skillDifferentiationRaw,
          careerPortabilityRaw: result.careerPortabilityRaw,
          timeToImpactUrgency: result.timeToImpactUrgency,
        }}
        selectedPivots={selectedPivots}
        pivotPaths={roleConfig.pivotPaths}
        taskLibrary={roleConfig.taskLibrary}
        rolePlural={roleConfig.pluralLabel}
        report={reportContent}
        date={result.createdAt}
        userEmail={session.user.email}
      />,
    );
  } catch (err) {
    console.error(`PDF render failed for ${resultId}:`, err);
    return new Response("PDF generation failed", { status: 500 });
  }

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${pdfFilename(roleConfig.pluralLabel, result.createdAt)}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
