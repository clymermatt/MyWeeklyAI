import Link from "next/link";

const roleLinks = [
  { label: "Software Engineers", slug: "software-engineers" },
  { label: "Product Managers", slug: "product-managers" },
  { label: "Data Scientists", slug: "data-scientists" },
  { label: "Engineering Managers", slug: "engineering-managers" },
  { label: "CTOs & VPs", slug: "cto-vp-engineering" },
  { label: "CEOs & Founders", slug: "ceo-founders" },
  { label: "UX Designers", slug: "ux-designers" },
  { label: "Marketing Managers", slug: "marketing-managers" },
];

const industryLinks = [
  { label: "SaaS & Software", slug: "saas-software" },
  { label: "Fintech", slug: "fintech" },
  { label: "Healthcare", slug: "healthcare" },
  { label: "Cybersecurity", slug: "cybersecurity" },
  { label: "E-commerce & Retail", slug: "ecommerce-retail" },
  { label: "Legal & LegalTech", slug: "legal-legaltech" },
  { label: "Media & Entertainment", slug: "media-entertainment" },
  { label: "Education & EdTech", slug: "education-edtech" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Browse by Role
            </h3>
            <ul className="mt-4 space-y-2">
              {roleLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/for/${link.slug}`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Browse by Industry
            </h3>
            <ul className="mt-4 space-y-2">
              {industryLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={`/for/${link.slug}`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">My Weekly AI</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/briefings"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  My Briefings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/saved"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  My Saved Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          Powered by My Weekly AI
        </div>
      </div>
    </footer>
  );
}
