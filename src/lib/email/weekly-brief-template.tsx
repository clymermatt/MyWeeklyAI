import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
  Preview,
} from "@react-email/components";
import type { BriefOutput, BriefItem } from "@/types/brief";

interface WeeklyBriefEmailProps {
  brief: BriefOutput;
  periodStart: string;
  periodEnd: string;
  userName?: string;
  profileTerms?: string[];
  unsubscribeUrl?: string;
}

function highlightTerms(text: string, terms: string[]) {
  if (!terms.length) return text;

  // Expand compound terms into individual words too (e.g. "SaaS & Software" → "SaaS", "Software")
  const allTerms = new Set<string>();
  for (const term of terms) {
    allTerms.add(term);
    for (const part of term.split(/[\s&,/]+/)) {
      if (part.length >= 3) allTerms.add(part);
    }
  }

  // Build regex matching any term (case-insensitive, whole word)
  // Sort longest first so longer matches take priority
  const sorted = [...allTerms].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  const parts = text.split(regex);
  if (parts.length === 1) return text;

  // split with a capture group puts matches at odd indices (1, 3, 5...)
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i} style={{ color: "#9333ea", fontWeight: 600, fontStyle: "normal" }}>
          {part}
        </span>
      );
    }
    return part;
  });
}

function ItemList({
  items,
  showRelevance,
  profileTerms = [],
}: {
  items: BriefItem[];
  showRelevance?: boolean;
  profileTerms?: string[];
}) {
  return (
    <>
      {items.map((item, i) => (
        <Section key={i} style={{ marginBottom: "16px" }}>
          <Link
            href={item.url}
            style={{
              color: "#9333ea",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {item.title}
          </Link>
          {item.source && (
            <Text
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                margin: "2px 0 0",
              }}
            >
              {item.source}
            </Text>
          )}
          <Text style={{ color: "#374151", fontSize: "14px", margin: "4px 0" }}>
            {item.summary}
          </Text>
          {showRelevance && item.relevanceNote && (
            <Text
              style={{
                color: "#6b7280",
                fontSize: "13px",
                fontStyle: "italic",
                margin: "4px 0",
              }}
            >
              <span style={{ fontWeight: 700 }}>Why this matters to you:</span> {highlightTerms(item.relevanceNote, profileTerms)}
            </Text>
          )}
        </Section>
      ))}
    </>
  );
}

export default function WeeklyBriefEmail({
  brief,
  periodStart,
  periodEnd,
  userName,
  profileTerms = [],
  unsubscribeUrl,
}: WeeklyBriefEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";
  return (
    <Html>
      <Head />
      <Preview>
        Your weekly AI brief for {periodStart} - {periodEnd}
      </Preview>
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "32px",
            borderRadius: "8px",
          }}
        >
          <Heading
            style={{
              color: "#9333ea",
              fontSize: "24px",
              marginBottom: "0",
            }}
          >
            My Weekly AI
          </Heading>
          <Text
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: "4px 0 0",
            }}
          >
            {periodStart} to {periodEnd}
          </Text>
          <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", marginTop: "12px" }}>
            No hype, no noise, no one-size-fits-all roundups. Every week we
            surface the AI developments, tools, and ideas that matter to you —
            so you spend less time scrolling and more time applying AI to your
            actual work.
          </Text>
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai"}/dashboard`}
            style={{
              color: "#9333ea",
              fontSize: "14px",
              textDecoration: "underline",
            }}
          >
            Go to my dashboard
          </Link>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Section
            style={{
              backgroundColor: "#faf5ff",
              borderRadius: "8px",
              padding: "20px",
              border: "1px solid #e9d5ff",
            }}
          >
            <Heading
              as="h2"
              style={{
                color: "#581c87",
                fontSize: "18px",
                marginBottom: "12px",
              }}
            >
              News Relevant to You
            </Heading>
            <ItemList items={brief.relevantToYou} showRelevance profileTerms={profileTerms} />

            <Hr style={{ borderColor: "#e9d5ff", margin: "20px 0" }} />

            <Heading
              as="h2"
              style={{
                color: "#581c87",
                fontSize: "18px",
                marginBottom: "12px",
              }}
            >
              What To Test This Week
            </Heading>
            <ItemList items={brief.whatToTest} showRelevance profileTerms={profileTerms} />
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{
              color: "#6b7280",
              fontSize: "16px",
              marginBottom: "8px",
            }}
          >
            What We Filtered Out
          </Heading>
          <Text style={{ color: "#9ca3af", fontSize: "13px" }}>
            {brief.ignoreSummary}
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Text
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              textAlign: "center" as const,
            }}
          >
            Powered by{" "}
            <Link
              href="https://www.myweekly.ai"
              style={{ color: "#9ca3af", textDecoration: "underline" }}
            >
              My Weekly AI
            </Link>
          </Text>
          <Text
            style={{
              color: "#d1d5db",
              fontSize: "11px",
              textAlign: "center" as const,
              margin: "4px 0 0",
            }}
          >
            <Link href={`${appUrl}/privacy`} style={{ color: "#d1d5db", textDecoration: "underline" }}>
              Privacy Policy
            </Link>
            {" "}&middot;{" "}
            <Link href={`${appUrl}/terms`} style={{ color: "#d1d5db", textDecoration: "underline" }}>
              Terms of Service
            </Link>
            {unsubscribeUrl && (
              <>
                {" "}&middot;{" "}
                <Link href={unsubscribeUrl} style={{ color: "#d1d5db", textDecoration: "underline" }}>
                  Unsubscribe
                </Link>
              </>
            )}
          </Text>
          <Text
            style={{
              color: "#d1d5db",
              fontSize: "11px",
              textAlign: "center" as const,
              margin: "4px 0 0",
            }}
          >
            Please do not reply to this email. Emails sent to this address will
            not be answered.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
