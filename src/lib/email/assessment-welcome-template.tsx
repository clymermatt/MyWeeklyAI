import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface AssessmentWelcomeEmailProps {
  userName?: string;
  rolePlural: string;
  compositeScore: number;
  tierLabel: string;
  resultUrl: string;
  dashboardUrl: string;
  unsubscribeUrl?: string;
}

export default function AssessmentWelcomeEmail({
  userName,
  rolePlural,
  compositeScore,
  tierLabel,
  resultUrl,
  dashboardUrl,
  unsubscribeUrl,
}: AssessmentWelcomeEmailProps) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";

  return (
    <Html>
      <Head />
      <Preview>{`Your AI Job Risk Report is ready — score ${compositeScore}/100, ${tierLabel}`}</Preview>
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
          <Img
            src={`${appUrl}/logos/nav-logo.png`}
            alt="myweeklyai"
            width="160"
            height="37"
            style={{ marginBottom: "16px" }}
          />

          <Heading
            style={{
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            Your AI Job Risk Report is ready
          </Heading>
          <Text style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 16px" }}>
            {userName ? `Hi ${userName} — ` : ""}your assessment is complete. Your
            score: <strong>{compositeScore}/100 — {tierLabel}</strong>.
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "20px 0" }}>
            <Link
              href={resultUrl}
              style={{
                backgroundColor: "#9333ea",
                color: "#ffffff",
                padding: "12px 32px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View your full report &rarr;
            </Link>
          </Section>

          <Text
            style={{
              color: "#374151",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "16px 0 0",
            }}
          >
            We&apos;ve attached a PDF version you can save or share.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#1f2937", fontSize: "16px", marginBottom: "8px" }}
          >
            What&apos;s next
          </Heading>
          <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
            You&apos;re now subscribed to My Weekly AI for {rolePlural} — a
            5-minute weekly brief with the AI news that matters for your work.
            Your first issue arrives this Sunday.
          </Text>
          <Text
            style={{
              color: "#374151",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: "12px 0 0",
            }}
          >
            We&apos;ve personalized your newsletter automatically based on your
            assessment — your role, industry, tools, and focus topics are
            already configured. Tune anything you like in your dashboard.
          </Text>

          <Section style={{ textAlign: "center" as const, margin: "20px 0" }}>
            <Link
              href={dashboardUrl}
              style={{
                color: "#9333ea",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Access your dashboard &rarr;
            </Link>
          </Section>

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
            <Link
              href={`${appUrl}/privacy`}
              style={{ color: "#d1d5db", textDecoration: "underline" }}
            >
              Privacy Policy
            </Link>
            {" "}&middot;{" "}
            <Link
              href={`${appUrl}/terms`}
              style={{ color: "#d1d5db", textDecoration: "underline" }}
            >
              Terms of Service
            </Link>
            {unsubscribeUrl && (
              <>
                {" "}&middot;{" "}
                <Link
                  href={unsubscribeUrl}
                  style={{ color: "#d1d5db", textDecoration: "underline" }}
                >
                  Unsubscribe
                </Link>
              </>
            )}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
