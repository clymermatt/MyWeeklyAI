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

interface WelcomeEmailProps {
  userName?: string;
}

export default function WelcomeEmail({ userName }: WelcomeEmailProps) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.myweekly.ai";

  return (
    <Html>
      <Head />
      <Preview>
        Welcome to My Weekly AI — your personalized AI briefing starts here
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

          <Text style={{ color: "#374151", fontSize: "16px", lineHeight: "1.6" }}>
            {userName ? `${userName}, welcome` : "Welcome"} to My Weekly AI!
          </Text>

          <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
            Every week, we cut through the noise and bring you the AI news that
            actually matters — tailored to your role, industry, and goals.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Section>
            <Heading
              as="h2"
              style={{ color: "#111827", fontSize: "18px", marginBottom: "8px" }}
            >
              Get your first briefing now
            </Heading>
            <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
              Complete your context profile so we know what to focus on. Once you
              do, we&apos;ll generate your first briefing right away — no need to
              wait until Sunday.
            </Text>
            <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
              After that, expect your briefing in your inbox every Sunday morning.
            </Text>
          </Section>

          <Section style={{ textAlign: "center" as const, margin: "24px 0" }}>
            <Link
              href={`${appUrl}/dashboard/profile`}
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
              Complete my profile &rarr;
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
            Powered by My Weekly AI &middot; Curated by AI
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
