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
}

function ItemList({
  items,
  showRelevance,
}: {
  items: BriefItem[];
  showRelevance?: boolean;
}) {
  return (
    <>
      {items.map((item, i) => (
        <Section key={i} style={{ marginBottom: "16px" }}>
          <Link
            href={item.url}
            style={{
              color: "#1d4ed8",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {item.title}
          </Link>
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
              Why this matters to you: {item.relevanceNote}
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
}: WeeklyBriefEmailProps) {
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
            style={{ color: "#111827", fontSize: "24px", marginBottom: "4px" }}
          >
            ContextBrief
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: "14px", marginTop: "0" }}>
            {userName ? `Hi ${userName}, here's` : "Here's"} your weekly AI
            brief for {periodStart} &ndash; {periodEnd}.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
          >
            What Dropped
          </Heading>
          <ItemList items={brief.whatDropped} />

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
          >
            Relevant To You
          </Heading>
          <ItemList items={brief.relevantToYou} showRelevance />

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
          >
            What To Test This Week
          </Heading>
          <ItemList items={brief.whatToTest} showRelevance />

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#6b7280", fontSize: "16px", marginBottom: "8px" }}
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
            Powered by ContextBrief &middot; Curated by Claude
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
