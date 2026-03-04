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
  Img,
  Preview,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName?: string;
  unsubscribeUrl?: string;
}

export default function WelcomeEmail({ userName, unsubscribeUrl }: WelcomeEmailProps) {
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
            {userName ? `${userName}, welcome!` : "Welcome!"}
          </Heading>
          <Text
            style={{
              color: "#6b7280",
              fontSize: "14px",
              margin: "0 0 16px",
            }}
          >
            The week&apos;s biggest AI stories, personalized to your job.
          </Text>

          <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
            Every week, we cut through the noise and bring you the AI news that
            actually matters — tailored to your role, industry, and goals.
          </Text>

          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            as="h2"
            style={{ color: "#1f2937", fontSize: "18px", marginBottom: "8px" }}
          >
            Get your first briefing now
          </Heading>
          <Text style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
            Complete your context profile so we know what to focus on. Once you
            do, we&apos;ll generate your first briefing right away — no need to
            wait until Sunday.
          </Text>

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
