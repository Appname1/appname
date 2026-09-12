export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a href="/settings" className="inline-flex items-center gap-1 text-xs font-medium mb-6" style={{ color: 'var(--muted)' }}>
          ← Settings
        </a>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--ink)', fontFamily: 'var(--font-space-grotesk)' }}>
          Terms & Conditions
        </h1>
        <p className="text-xs mb-10" style={{ color: 'var(--muted)' }}>
          Last updated: September 2026
        </p>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>
          <section>
            <h2 className="font-semibold mb-2">1. Who we are</h2>
            <p>
              bornout (&quot;bornout,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is an independent, currently
              unincorporated project based in India. These Terms govern your use of bornout.co.in
              and any related services (the &quot;Service&quot;). By creating an account or using the
              Service, you agree to these Terms. If you don&apos;t agree, please don&apos;t use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">2. What the Service does</h2>
            <p>
              bornout helps you generate portfolio project ideas and guided, step-by-step build
              instructions based on a job description, a chosen role, or your own custom idea, using
              third-party AI models. The Service also offers dataset explanation tools, quizzes, an
              error-help feature, and a portfolio showcase.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">3. Eligibility</h2>
            <p>
              You must be at least 16 years old to use bornout. By using the Service, you represent
              that you meet this requirement. If we learn that an account belongs to someone under 16,
              we may suspend or delete it.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">4. Accounts and authentication</h2>
            <p>
              You sign in using Google OAuth. We do not collect or store a password. You&apos;re
              responsible for maintaining control of the Google account you use to sign in, and for
              all activity that happens under your bornout account.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">5. AI-generated content — no guarantee of accuracy</h2>
            <p>
              Project ideas, code, explanations, quizzes, and other content on bornout are generated
              using third-party large language models. This content may contain errors, inaccuracies,
              outdated information, or code that doesn&apos;t run as-is. bornout does not guarantee the
              accuracy, completeness, fitness for a particular purpose, or job-readiness of any
              AI-generated content. You are responsible for reviewing, testing, and validating anything
              you use, submit, publish, or rely on — including in interviews or job applications.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">6. Your content and ownership</h2>
            <p>
              Code, notes, project descriptions, and other content you create, upload, or generate
              through the Service (&quot;Your Content&quot;) remains yours. By using the Service, you
              grant us a limited license to store, process, and display Your Content back to you as
              needed to operate the Service (for example, saving your project progress or rendering
              your portfolio page). We don&apos;t claim ownership of Your Content and won&apos;t sell it.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">7. Dataset uploads</h2>
            <p>
              When you upload a CSV to generate dataset explanations, only column headers and a small
              sample of rows are processed by our systems and sent to the AI provider — we do not
              upload or store your full dataset file on our servers. You&apos;re responsible for ensuring
              you have the right to use and share any dataset you upload, including respecting any
              license terms of third-party datasets (e.g. from Kaggle).
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">8. Credits and payment</h2>
            <p>
              bornout currently operates on a free credit system while pricing is finalized. We
              reserve the right to introduce paid credit packs or subscription pricing in the future.
              If and when payment is introduced, updated terms covering billing, refunds, and
              cancellation will be provided before any charge is made, and your continued use of the
              Service after that point will be subject to those updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">9. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service to generate, store, or share unlawful, harmful, or infringing content</li>
              <li>Attempt to circumvent rate limits, credit systems, or access controls</li>
              <li>Reverse-engineer, scrape, or resell access to the Service</li>
              <li>Use automated means to create multiple accounts to abuse free credits</li>
              <li>Upload datasets you don&apos;t have the right to use</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold mb-2">10. Third-party services</h2>
            <p>
              The Service relies on third-party providers, including Google (authentication), Supabase
              (database and storage), Groq (AI model inference), Vercel (hosting), and Sentry (error
              monitoring). Your use of the Service is also subject to the availability and terms of
              these providers. We are not responsible for outages or issues caused by third-party
              service providers.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">11. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, with or without
              notice, for conduct that violates these Terms or is otherwise harmful to the Service or
              other users. You may stop using the Service and request account deletion at any time by
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">12. Disclaimer of warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any kind,
              express or implied, including but not limited to warranties of merchantability, fitness
              for a particular purpose, or non-infringement. We do not warrant that the Service will be
              uninterrupted, error-free, or secure.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">13. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, bornout and its operator(s) shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages, or any loss of
              data, revenue, or opportunity (including career or job outcomes) arising from your use of
              the Service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">14. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. If we make material changes, we&apos;ll make
              reasonable efforts to notify users (for example, via email or an in-app notice). Continued
              use of the Service after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">15. Governing law</h2>
            <p>
              These Terms are governed by the laws of India, without regard to conflict-of-law
              principles. Any disputes arising from these Terms or the Service shall be subject to the
              exclusive jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="font-semibold mb-2">16. Contact</h2>
            <p>
              Questions about these Terms? Reach out at{' '}
              <a href="mailto:bornout.co@gmail.com" style={{ color: 'var(--accent)' }}>
                bornout.co@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}