export function StatsBand() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          {
            number: "80%",
            text: "of U.S. medical bills contain at least one billing error.",
            source: "Medical Billing Advocates of America",
            url: "https://www.medicalbillingadvocates.com/",
          },
          {
            number: "$220B+",
            text: "in medical debt is held by Americans.",
            source: "KFF, 2020 SIPP analysis",
            url: "https://www.kff.org/health-costs/issue-brief/the-burden-of-medical-debt-in-the-united-states/",
          },
          {
            number: "~$1,300",
            text: "average overcharge on hospital bills over $10,000.",
            source: "Medical billing industry analyses, 2024\u20132025",
            url: "https://www.medicalbillingadvocates.com/",
          },
          {
            number: "~100M",
            text: "Americans have some form of healthcare debt.",
            source: 'KFF Health News "Diagnosis: Debt"',
            url: "https://kffhealthnews.org/diagnosis-debt/",
          },
        ].map((stat, i) => (
          <div key={i}>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-teal)]">
              {stat.number}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {stat.text}
            </p>
            <a
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-teal)]/70 hover:text-[var(--color-teal)] mt-1 inline-block"
            >
              {stat.source}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
