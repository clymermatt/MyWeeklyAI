import ContextProfileForm from "@/components/context-profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Context Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Tell us about your role, tools, and interests so we can personalize
          your weekly AI brief.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ContextProfileForm />
      </div>
    </div>
  );
}
