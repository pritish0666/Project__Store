export default function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">
          These terms govern your use of Project Hub. By using the site, you
          agree to these terms.
        </p>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Use of the Service</h2>
          <p className="text-muted-foreground">
            Don’t abuse the platform, spam, or submit illegal content. We may
            suspend accounts that violate these terms.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Content</h2>
          <p className="text-muted-foreground">
            You retain rights to the content you submit. You grant us a license
            to display your content on the platform.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Disclaimer</h2>
          <p className="text-muted-foreground">
            The service is provided “as is” without warranties. Liability is
            limited to the maximum extent permitted by law.
          </p>
        </section>
        <p className="text-sm text-muted-foreground">
          This is a product demo. Replace with your legal terms before going
          live.
        </p>
      </div>
    </div>
  );
}


