import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoleConfig } from "@/lib/ai-job-risk/roles";
import { toQuizContent } from "@/lib/ai-job-risk/quiz-content";
import AssessmentFlow from "@/components/ai-job-risk/assessment-flow";

interface PageProps {
  params: Promise<{ role: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  const config = getRoleConfig(role);
  if (!config) return {};
  return {
    title: `AI Job Risk Assessment — ${config.pluralLabel}`,
    // The quiz itself is not an SEO target; the landing pages are (spec 7.16).
    robots: { index: false, follow: true },
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { role } = await params;
  const config = getRoleConfig(role);
  if (!config) notFound();

  // Nav, <main>, and page background come from src/app/ai-job-risk/layout.tsx.
  return <AssessmentFlow content={toQuizContent(config)} />;
}
