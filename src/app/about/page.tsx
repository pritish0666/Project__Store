export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">About Project Hub</h1>
        <p className="text-muted-foreground text-lg">
          Project Hub is a community-driven platform to showcase, discover, and
          review personal projects. Our goal is to help developers get feedback,
          learn from each other, and find inspiration.
        </p>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">What you can do</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Browse projects by category, tech stack, and popularity.</li>
            <li>Submit your own projects and share updates over time.</li>
            <li>Rate and review projects to help creators improve.</li>
          </ul>
        </div>
        <p className="text-muted-foreground">
          Have questions or suggestions? Reach out via the Contact link in the
          footer. We’d love to hear from you.
        </p>
      </div>
    </div>
  );
}


