"use client"

import { Header } from '@/components/customer-panel-components/header'
import { Footer } from '@/components/customer-panel-components/footer'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Banner Section */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img
          src="/boo.png"
          alt="Cookie Policy Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img
            src="/lines.svg"
            alt="Lines"
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50"
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            Cookie <span className='text-secondary'>Policy</span>
          </h1>

          <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
            Learn how we use cookies to enhance your experience.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">




          <div className="max-w-4xl mx-auto py-10 px-5 leading-relaxed whitespace-pre-line">
            <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

            <p><strong>Effective from:</strong> 1st December 2025</p>

            <p>
              ChopNow (“we”, “us”, “our”) uses cookies and similar technologies on our website
              and mobile apps to make the service work, improve performance and show
              relevant content. This Cookie Policy explains what cookies are, why we use
              them, how we ask for and record consent, and how you can manage or withdraw
              consent. We follow UK rules under the Privacy and Electronic Communications
              Regulations (PECR) and ICO guidance.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">What Are Cookies and Similar Technologies?</h2>

            <p>
              Cookies are small text files placed on your device (computer, phone, tablet)
              when you visit our sites or use our apps. Similar technologies include local
              storage, tracking pixels, and device identifiers. They may be session cookies
              (deleted when you close your browser) or persistent cookies (remain for a set
              time). Some technologies can collect information about device characteristics
              (fingerprinting); the ICO expects transparency and lawful use for those
              techniques.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Why We Use Cookies</h2>

            <ul className="list-disc ml-6">
              <li>Make the site and app function correctly (essential features).</li>
              <li>Remember your preferences and login session.</li>
              <li>Measure and improve site performance and reliability.</li>
              <li>Personalise content and recommendations (for example, show cuisine suggestions).</li>
              <li>
                Deliver relevant marketing and advertising, where you have consented.
                These uses improve your experience and help us run a secure, reliable service.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Categories of Cookies We Use</h2>

            <p>
              We classify cookies into the following categories. Our cookie banner or
              preference centre will show the exact cookies in use, their purpose and duration.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Strictly Necessary Cookies</h3>
            <p>
              Essential for the site or app to operate. They enable core features like
              account login, basket, checkout and security. We set these without consent
              because they are necessary for the service.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Performance and Analytics Cookies</h3>
            <p>
              Collect anonymous data about how visitors use the site (pages visited, errors,
              load times). We use this information to improve the platform and fix problems.
              Examples: analytics providers and aggregated reporting.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Functionality Cookies</h3>
            <p>
              Remember choices you make (language, delivery location) so we can provide
              a customised experience and avoid asking repeatedly.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Marketing, Advertising and Targeting Cookies</h3>
            <p>
              Used to deliver relevant promotions and advertising on and off our site
              (including remarketing). These cookies may track browsing across sites and
              are set by us or third-party advertising partners. They require your explicit consent.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Third-Party Cookies</h2>

            <p>
              Some cookies are set by third-party services we use (payment providers,
              analytics, social networks, maps, advertising networks). These third parties
              may have their own privacy and cookie policies; we link to those where
              possible. Examples include analytics and ad networks used by other food
              delivery sites.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">How We Obtain Consent</h2>

            <p>
              Under PECR, we ask for your consent to store or access cookies on your
              device unless the cookie is strictly necessary. When you first visit ChopNow
              we show a clear cookie banner and preference centre that:
            </p>

            <ul className="list-disc ml-6">
              <li>Explains cookie categories and purposes.</li>
              <li>Lets you accept all, reject non-essential, or select specific categories.</li>
              <li>Provides a link to this Cookie Policy and to our Privacy Policy.</li>
            </ul>

            <p>
              You can change or withdraw consent at any time via the cookie preference
              link in the footer or your browser/app settings. We record consents for
              audit and compliance.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Managing Cookies — Your Choices</h2>

            <p>You control cookies in three ways:</p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Cookie Preferences / CMP</h3>
            <p>
              Use our cookie preference centre (accessible in the site footer or app
              settings) to change consent choices. Turning off non-essential cookies may
              reduce functionality (for example, personalised recommendations or some offers).
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Browser & Device Settings</h3>
            <p>
              Most browsers let you refuse or delete cookies (Chrome, Safari, Firefox, Edge).
              Blocking cookies can affect how the site works. For in-app settings, adjust
              permissions in your device settings.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">• Opt-Out Links for Advertising</h3>
            <p>
              For third-party advertising cookies you can use industry opt-out tools
              (for example, choices linked from our CMP or advertising partner opt-out
              pages). Note these tools do not stop first-party essential cookies.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Cookie Durations & Examples</h2>

            <p>
              Cookie duration varies by type and provider (session or persistent). We
              publish a cookie table in the cookie preference centre listing each cookie
              name, provider, purpose and expiry. Typical examples: session cookies (end
              with browser close), analytics cookies (30 days to 13 months), advertising
              cookies (varies by partner). Large UK publishers commonly use persistent
              advertising cookies up to 13 months; we follow similar transparency practices.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Special Considerations: Geolocation, Delivery and Payment</h2>

            <p>
              Our apps may request location permissions to provide delivery options and
              estimated times. Location data used for core delivery functions is processed
              under contract necessity and legitimate interests. Payment processors may set
              cookies for fraud prevention and secure checkout; these are subject to strict
              security controls and processor agreements. We never store raw card data on
              our servers — payment cookies relate to authorised processors only.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Cookies and Children</h2>

            <p>
              Our services are aimed at adults. We do not knowingly collect personal data
              from children for ordering. If a parent or guardian believes a child has
              provided personal data on our site without consent, contact us and we will
              take steps to remove the data where lawful.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Data Sharing, Third-Party Providers and Global Transfers</h2>

            <p>
              We use processors (analytics, hosting, payment, advertising). We put
              contractual safeguards in place and only share what’s necessary. If a third
              party transfers data outside the UK, we ensure appropriate safeguards (UK
              adequacy, standard contractual clauses or other ICO-approved mechanisms).
              See our Privacy Policy for full details.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">Cookie Policy Changes and Review</h2>

            <p>
              We will update this Cookie Policy to reflect operational or legal changes.
              Material updates will show a new “Last updated” date and we’ll notify users
              by in-app or email notice where appropriate. We review cookie practice
              regularly to reflect ICO guidance and industry best practice.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-3">How To Contact Us</h2>
            <p>If you have questions about cookies or wish to exercise data rights, contact:</p>
            <p>Data Protection Officer</p>
            <p className='pt-4 pb-4'>ChopNow Ltd</p>
            <p>hello@chopnow.co.uk</p>
            <p>+44 20 7946 0123</p>
          </div>


        </div>
      </section>

      <Footer />
    </div>
  )
}
