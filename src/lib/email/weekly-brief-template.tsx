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
import type { BriefOutput, BriefItem, FreeBriefStored } from "@/types/brief";

interface WeeklyBriefEmailProps {
  brief: BriefOutput | FreeBriefStored;
  isFree?: boolean;
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
              Why this matters to you: {item.relevanceNote}
            </Text>
          )}
        </Section>
      ))}
    </>
  );
}

function LockedSection({ title }: { title: string }) {
  return (
    <Section
      style={{
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center" as const,
      }}
    >
      <Heading
        as="h2"
        style={{
          color: "#9ca3af",
          fontSize: "18px",
          marginBottom: "8px",
        }}
      >
        {title}
      </Heading>
      <Text style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 16px" }}>
        This section is personalized for Pro subscribers.
      </Text>
      <Link
        href={`${process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai"}/dashboard`}
        style={{
          backgroundColor: "#9333ea",
          color: "#ffffff",
          padding: "10px 24px",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Upgrade to Pro
      </Link>
    </Section>
  );
}

export default function WeeklyBriefEmail({
  brief,
  isFree = false,
  periodStart,
  periodEnd,
  userName,
}: WeeklyBriefEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {isFree ? "free " : ""}weekly AI brief for {periodStart} -{" "}
        {periodEnd}
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
              marginBottom: "4px",
            }}
          >
            My Weekly AI
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: "14px", marginTop: "0" }}>
            {userName ? `Hi ${userName}, here's` : "Here's"} your{" "}
            {isFree ? "free " : ""}weekly AI brief for {periodStart} &ndash;{" "}
            {periodEnd}.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {isFree && "industryNews" in brief ? (
            <>
              <Heading
                as="h2"
                style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
              >
                Industry News
              </Heading>
              <ItemList items={(brief as FreeBriefStored).industryNews} />

              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

              <Heading
                as="h2"
                style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
              >
                AI Lab Announcements
              </Heading>
              <ItemList items={(brief as FreeBriefStored).labUpdates} />

              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

              <LockedSection title="Relevant To You" />
              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
              <LockedSection title="What To Test This Week" />
            </>
          ) : isFree ? (
            <>
              <Heading
                as="h2"
                style={{ color: "#111827", fontSize: "18px", marginBottom: "12px" }}
              >
                What Dropped
              </Heading>
              <ItemList items={brief.whatDropped} />

              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

              <LockedSection title="Relevant To You" />
              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
              <LockedSection title="What To Test This Week" />
            </>
          ) : (
            <>
              <Heading
                as="h2"
                style={{
                  color: "#111827",
                  fontSize: "18px",
                  marginBottom: "12px",
                }}
              >
                Relevant To You
              </Heading>
              <ItemList items={brief.relevantToYou} showRelevance />

              <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

              <Heading
                as="h2"
                style={{
                  color: "#111827",
                  fontSize: "18px",
                  marginBottom: "12px",
                }}
              >
                What To Test This Week
              </Heading>
              <ItemList items={brief.whatToTest} showRelevance />

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
            </>
          )}

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Text
            style={{
              color: "#9ca3af",
              fontSize: "12px",
              textAlign: "center" as const,
            }}
          >
            Powered by My Weekly AI &middot; Curated by AI
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
