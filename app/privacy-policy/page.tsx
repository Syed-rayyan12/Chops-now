"use client"

import { Header } from '@/components/customer-panel-components/header'
import { Footer } from '@/components/customer-panel-components/footer'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Banner Section - same as About Hero */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img
          src="/boo.png"
          alt="Privacy Policy Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img
            src="/lines.svg"
            alt="Lines"
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50"
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-secondary">
            Privacy <span className='text-white'>Policy</span>
          </h1>

          <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
            We keep your information safe, secure, and confidential.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-foreground font-ubuntu">

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Effective from: 1st December 2025</h2>
            <p className="leading-relaxed">
              This Privacy Policy explains how ChopNow (“we”, “us”, “our”) collects, uses, shares and protects
              personal data when you use our website, mobile apps, delivery platform and related services (the
              “Service”). It also explains your rights and how to contact us about your data.
            </p>

            <p>If you have questions about this policy or how we use your data, contact our Data Protection Officer at:
              hello@chopnow.co.uk.</p>



            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Who We Are and Scope</h2>
            <p className="leading-relaxed">
              ChopNow operates a digital marketplace connecting customers with restaurants and registered home
              cooks offering African and Caribbean cuisine, plus a network of couriers who deliver. This policy covers
              personal data we collect about:
            </p>

            <ul>
              <li>
                <p className="ml-4 mt-1">
                  Customers (people who order food)
                </p>
              </li>
              <li>
                <p className="ml-4 mt-1">
                  Visitors to our website and apps
                </p>
              </li>
              <li>
                <p className="ml-4 mt-1">
                  Restaurant and home-cook partners (prospective and active)
                </p>
              </li>
              <li>
                <p className="ml-4 mt-1">
                  Couriers and delivery agents (including contractors)
                </p>
              </li>
              <li>
                <p className="ml-4 mt-1">
                  Job applicants, employees and contractors (where relevant)
                </p>
              </li>

            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">What Personal Data We Collect</h2>
            <p className="leading-relaxed">
              We collect only what we need to run the Service and meet our legal obligations. Types of personal data
              include:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account and identity data</strong> — name, email, phone number, date of birth (where required), username, password and profile photo.</li>

              <li><strong>Contact and delivery data</strong> — delivery addresses, billing address, contact phone, delivery instructions, recipient name.</li>

              <li><strong>Order and transaction data</strong> — order details (items, special requests, dietary notes), payment and transaction records (payment provider reference, billing totals), refunds and receipts.</li>

              <li><strong>Device and technical data</strong> — IP address, device identifiers, browser type, app/device logs and crash reports, cookie identifiers and geolocation when you use the app or request location-based delivery.</li>

              <li><strong>Verification and compliance data</strong> — government ID or business documentation, food hygiene registration, proof of insurance, DBS or background checks for couriers where required.</li>

              <li><strong>Communications and support</strong> — messages, chat logs, emails, complaints, recorded calls (only where we notify you).</li>

              <li><strong>Marketing and preference data</strong> — marketing consents, interests, activity history and communication preferences.</li>

              <li><strong>Special categories and sensitive data</strong> — we do not generally process special category personal data (racial or health data) except where necessary and lawful (for example, limited dietary allergy information you provide). If we process any special category data, we will do so only with explicit lawful basis and additional safeguards.</li>
            </ul>

            <p>We collect personal data directly from you and from third parties such as payment processors, mapping
              services, identity verification providers, and public sources. We may also collect data from partner
              restaurants, couriers and other users (for example, reviews).</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">How and Why We Use Personal Data (Purposes & Lawful Bases)</h2>
            <p className="leading-relaxed">
              We use personal data for clear operational and legal reasons. For each purpose we list the likely lawful
              basis under UK GDPR (Article 6) and any additional basis for special category data (Article 9) where
              relevant.
            </p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>To Provide the Service and Manage Orders</strong><br />
                Create accounts, process orders, accept payments, arrange delivery and provide receipts.<br />
                <em>Lawful basis:</em> Contract (processing necessary to perform the contract between you and the partner).
              </li>

              <li>
                <strong>To Communicate With You</strong><br />
                Confirmations, delivery updates, account messages and customer service.<br />
                <em>Lawful basis:</em> Contract and Legitimate Interests (operational communications necessary to run the service).
              </li>

              <li>
                <strong>To Process Payments and Prevent Fraud</strong><br />
                Payment authorisation, refunds, chargebacks, and fraud checks.<br />
                <strong>Lawful basis:</strong> Contract and Legal Obligation (financial record keeping). We use trusted PCI-compliant payment processors and do not store raw card numbers.
              </li>

              <li>
                <strong>To verify partners and couriers</strong><br />
                Identity checks, background checks, business documents and hygiene registrations.<br />
                <strong className='mt-4'>Lawful basis:</strong> Legal Obligation and Legitimate Interests (safety, fraud prevention and regulatory
                compliance).
              </li>
            </ul>


            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">To Provide Personalised Recommendations and Marketing (With Consent Where Required)</h2>
            <p className="leading-relaxed">
              Show relevant menus, offers and promotions.
            </p>
            <p><strong>Lawful basis:</strong> Consent (for direct marketing where required by law) and Legitimate Interests for
              personalised experiences where you have not opted out.</p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>To Improve and Secure The Service</strong><br />
                App diagnostics, analytics, testing and research to enhance stability and performance.<br />
                <strong>Lawful basis:</strong> Legitimate Interests (service improvement and security)

              </li>

              <li>
                <strong>To Meet Legal and Regulatory Obligations</strong><br />
                Tax, accounting, dispute resolution, and law enforcement requests.
                <br />
                <strong>Lawful basis:</strong>  Legal Obligation.
              </li>

              <li>
                <strong>To Maintain Safety and Quality</strong><br />
                Incident reporting, complaint handling, food safety investigations and recalls.
                Lawful basis: Legitimate Interests and Legal Obligation (food safety law). We draw on Food Standards
                Agency guidance and local authority requirements when handling food-safety related data.
                <p>If we rely on legitimate interests we will balance those interests against your rights and freedoms and
                  document that assessment.</p>
              </li>


            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Cookies and Similar Technologies</h2>
            <p>We use cookies and similar technologies (including in-app identifiers) to operate the Service, remember
              preferences, measure performance and show relevant marketing. Under PECR we will obtain consent
              for non-essential cookies and provide clear information about cookie purposes. You can withdraw
              consent or change preferences via our cookie banner or browser settings. For detailed guidance we
              follow ICO and PECR recommendations.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Sharing and Disclosure of Data</h2>
            <p>We share personal data only where necessary and with appropriate safeguards:</p>

            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Service Providers and Processors</strong><br />
                Payment processors, cloud hosting, analytics, email and messaging providers, identity verification
                and background-check vendors (contractual data processing agreements in place).
              </li>

              <li>
                <strong>Restaurant Partners and Couriers</strong><br />
                We share order details and delivery information necessary for fulfilment; partners receive customer
                name, address and order details.
              </li>

              <li>
                <strong>Legal and Regulatory Bodies</strong><br />
                When required by law, court order or to prevent fraud or harm.
              </li>

              <li>
                <strong>Business Transfers</strong><br />
                If we merge, are acquired, or sell assets, we may share personal data with prospective buyers and the
                new owners, subject to contractual protections.
              </li>

              <li>
                <strong>Aggregated or Anonymised Data</strong><br />
                We may publish non-identifying, aggregated insights (for example, order volumes by city) for
                analytics and reporting.
              </li>

              <li>
                <strong className="">We do not sell personal data to third parties.</strong><br />
                When we use third-party processors outside the UK, we ensure adequate safeguards (standard
                contractual clauses, UK adequacy decisions or other appropriate measures) are in place, following
                ICO guidance on international transfers.
              </li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Retention: How Long We Keep Personal Data</h2>

            <p>We retain personal data only for as long as necessary to fulfil the purposes described, for legal
              obligations (e.g., tax records), and to resolve disputes. Typical retention periods (examples — replace
              with your actual policy)</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Account and order history: retained for the lifetime of the account plus 6 years for accounting/tax purposes.</li>
              <li>Payment and transaction records: 6 years (tax and accounting).</li>
              <li>Support and communications: 2–6 years depending on the nature of the enquiry.</li>
              <li>Recruitment records: 6 months to 6 years depending on legal requirements.</li>
              <li>CCTV or delivery dashcam footage: limited retention, typically 30–90 days unless required for an incident investigation.</li>

            </ul>

            <p>We anonymise or delete data when no longer needed. Specific retention rules will depend on the
              category of data and legal obligations.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Security and Data Protection Measures</h2>

            <p>We implement appropriate technical and organisational measures to protect personal data against
              unauthorised access, loss, alteration or disclosure. Controls include encryption in transit (TLS), access
              controls, regular security testing, staff training, audit logs and processor contractual requirements.
              Payment data processing relies on certified PCI-compliant providers.</p>

            <p>Despite these measures, no system is perfectly secure. If we identify a personal data breach that risks
              your rights and freedoms, we will follow UK GDPR breach notification rules and notify the ICO and
              affected individuals where required.</p>


            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Your Rights and How to Exercise Them</h2>
            <p>Under UK GDPR you have several rights. To help us respond, contact hello@chopnow.co.uk</p>

            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Right to access</strong> — request a copy of your personal data.</li>
              <li><strong>Right to rectification</strong> — correct inaccurate or incomplete data.</li>
              <li><strong>Right to erasure</strong> — request deletion where lawful (subject to retention obligations).</li>
              <li><strong>Right to restrict processing</strong> — limit how we use your data in certain circumstances.</li>
              <li><strong>Right to data portability</strong> — receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests or direct marketing.</li>
              <li><strong>Right to withdraw consent</strong> — where we process based on consent, you can withdraw it at any time.</li>
              <li><strong>Right to complain</strong> — to the ICO if you believe we have breached data protection law.</li>
            </ul>



            <p>We will respond to valid requests within one month, or sooner where required; complex requests may
              take longer and we will keep you informed.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Children and Age-Restricted Services</h2>
            <p>Our Service is intended for adults (18+). We do not knowingly collect personal data from children for
              ordering. If we discover a child under 18 has created an account, we will take steps to remove the
              account and delete the child’s data, subject to legal obligations.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Data We Collect About Partners and Couriers</h2>
            <p>We collect business and identity information necessary to verify partners and couriers, including
              business registration, food hygiene registration, DBS or background checks where required, proof of
              insurance and bank details for payments. We process this information for onboarding, fraud prevention
              and legal compliance. Lawful bases include Contract, Legal Obligation and Legitimate Interests (safety
              and platform integrity).</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">International Transfers</h2>
            <p>Some of our processors or service providers may transfer or store data outside the UK. When we do,
              we ensure legal safeguards are in place (UK adequacy, standard contractual clauses or other ICOapproved mechanisms) and document those transfers. You may request details of transfers and
              safeguards from our DPO.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Automated Decision-Making and Profiling</h2>
            <p>We use automated systems to personalise recommendations and offers (profiling). These systems do
              not make legal or similarly significant decisions about you. Where profiling significantly affects you, you
              have rights to obtain human review, express your point of view, and challenge the decision. If you wish
              to exercise these rights contact hello@chopnow.co.uk.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Marketing Communications and Your Choices</h2>
            <p>We will only send marketing messages where you have consented or where legitimate interests apply
              and you have not opted out. Every marketing message includes an easy way to opt out. You can
              manage your preferences via account settings or by contacting hello@chopnow.co.uk.</p>
            <p>For email, you can also use standard “unsubscribe” links. For app push notifications, change
              preferences in the app or device settings.</p>



            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Third-Party Services and Links
            </h2>
            <p>Our Service may contain links to third-party websites or services (e.g., social networks, third-party
              payment options). This policy does not cover their practices. We recommend reviewing their privacy
              policies before sharing personal data.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Data Protection Impact Assessments and Governance
            </h2>
            <p>For higher-risk processing (e.g., large-scale profiling, new products involving sensitive data), we
              conduct Data Protection Impact Assessments (DPIAs). We maintain records of processing activities and
              have appointed a DPO (or the contact point for data protection queries) to oversee compliance.</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Complaints, Questions and Contact Detail</h2>

            <p>If you have questions or want to exercise your rights, contact:<br />Data Protection Officer<br /> ChopNow Ltd</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Changes to This Policy</h2>
            <p>We may update this Privacy Policy to reflect changes in our Service, legal obligations, or best practice.
              We will publish the updated policy with a new “Last updated” date and notify account holders of
              material changes.</p>

              

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
