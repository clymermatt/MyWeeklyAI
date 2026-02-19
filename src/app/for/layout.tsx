import SiteNav from "@/components/site-nav";

export default function ForLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />
      <main>{children}</main>
    </div>
  );
}
