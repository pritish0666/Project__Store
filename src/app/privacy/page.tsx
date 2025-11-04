export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">
          This policy explains what data Project Hub collects, why we collect it,
          and how we handle it.
        </p>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p className="text-muted-foreground">
            Account details (name, email) and content you submit (projects,
            reviews). We also collect basic analytics and error logs to improve
            the service.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">How We Use Information</h2>
          <p className="text-muted-foreground">
            To operate the platform, personalize content, moderate abuse, and
            improve performance.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Your Choices</h2>
          <p className="text-muted-foreground">
            You can request export or deletion of your account data by
            contacting us via the email in the footer.
          </p>
        </section>
        <p className="text-sm text-muted-foreground">
          This is a product demo. Replace with your organization’s official
          policy before going live.
        </p>
      </div>
    </div>
  );
}


