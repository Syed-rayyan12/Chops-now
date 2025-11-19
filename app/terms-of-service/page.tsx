"use client"

import { Header } from '@/components/customer-panel-components/header'
import { Footer } from '@/components/customer-panel-components/footer'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Banner Section */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img
          src="/boo.png"
          alt="Terms of Service Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img
            src="/lines.svg"
            alt="Lines"
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50"
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            Terms of <span className='text-secondary'>Service</span>
          </h1>

          <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
            Understanding our terms helps you enjoy our services with confidence.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-foreground font-ubuntu">

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Effective from: 1st December 2025s</h2>
            <p className="leading-relaxed">
              Welcome to ChopNow. These Terms of Service (“Terms”) set out the agreement between you and
              ChopNow (“we”, “us”, “our”) for the use of our website, mobile apps and platform (collectively, the
              “Service”). By using the Service you accept and agree to these Terms. If you do not agree, do not use
              the Service.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">About the Service</h2>
            <p className="leading-relaxed">
              ChopNow is a UK-based digital marketplace connecting customers with restaurants and registered
              home cooks offering African and Caribbean food, and a network of delivery couriers who fulfil orders.
              We provide the platform to place orders, accept payments, manage menus, and arrange delivery. We
              do not cook the food ourselves; food preparation, hygiene and allergen control are the responsibility of
              our restaurant and home-cook partners unless we expressly state otherwise.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Definitions</h2>
            <ul>
              <li>“Customer” — any person who places an order through the Service.</li>
              <li>“Partner” — a registered restaurant or home cook listing food on our Service.</li>
              <li>“Courier” — a person or business delivering orders on behalf of the Service</li>
              <li>“Order” — a request for food placed by a Customer and accepted by a Partner.</li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Placing Orders
            </h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>How orders work</strong>
                <p className="ml-4 mt-1">
                  Customers submit orders via the website. Orders are accepted when a Partner confirms them.
                  Estimated delivery times are provided as a guide only.
                </p>
              </li>

              <li>
                <strong>Availability</strong>
                <p className="ml-4 mt-1">
                  Menus, prices and delivery areas are subject to change. A confirmed Order creates a contract
                  only between you and the Partner that accepts the Order, except where we explicitly state
                  otherwise.
                </p>
              </li>

              <li>
                <strong>Special requests and allergies</strong>
                <p className="ml-4 mt-1">
                  If you have allergies or dietary requirements, you must notify the Partner at the time of
                  ordering. We publish allergen information supplied by Partners but cannot guarantee the absence
                  of cross-contamination. Partners must follow legal allergen information rules and keep their
                  information accurate. Customers should not rely solely on the platform for allergy safety.
                </p>
              </li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Pricing and Payment
            </h2>

            <p className="leading-relaxed">
              Prices shown include VAT where applicable. Payment is taken at the point of ordering unless a
              Partner accepts payment on delivery. We use third-party payment processors; we do not store full
              card details. Partners set menu prices; we may add delivery fees, service fees or surge pricing
              which will be shown before checkout. We comply with applicable payment industry standards. For
              payment-card security we require our payment providers to follow standards such as PCI DSS.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Delivery
            </h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>Delivery service</strong>
                <p className="ml-4 mt-1">
                  Couriers contracted to deliver Orders are independent contractors unless otherwise stated.
                  Delivery times are estimates; actual times may vary due to traffic, weather or operational issues.
                </p>
              </li>

              <li>
                <strong>Receipt of order</strong>
                <p className="ml-4 mt-1">
                  A Customer or an authorised recipient must be available to accept delivery. Risk in the food passes
                  to the Customer on delivery to the agreed delivery address. If an Order is returned to a Partner
                  because no one was present, the Partner’s cancellation and refund policy applies.
                </p>
              </li>
            </ul>
            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Cancellations, Refunds and Faulty Food
            </h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>Cancellation by Customer</strong>
                <p className="ml-4 mt-1">
                  Orders may be cancelled before a Partner accepts them; once accepted, cancellation may be possible
                  depending on the Partner’s policy. Refunds (full or partial) are issued at our or the Partner’s discretion
                  where cancellation is permitted.
                </p>
              </li>

              <li>
                <strong>Faulty or unsafe food</strong>
                <p className="ml-4 mt-1">
                  If an Order is unsafe, contaminated, or not as described, contact us immediately. We will investigate
                  and may arrange a refund, replacement, or credit. Consumers in the UK have statutory rights under the
                  Consumer Rights Act 2015 and related regulations; where applicable these rights apply in addition to
                  these Terms.
                </p>
              </li>

              <li>
                <strong>Distance-selling and cancellation rights</strong>
                <p className="ml-4 mt-1">
                  For online purchases, the Consumer Contracts (Information, Cancellation and Additional Charges)
                  Regulations 2013 set out information and cancellation rules for certain contracts; some food delivery
                  Orders that are fulfilled immediately may fall outside cancellation rights — we will explain your rights at
                  checkout where applicable
                </p>
              </li>
            </ul>


            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Food Safety, Hygiene and Allergen Information
            </h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>Partner responsibilities</strong>
                <p className="ml-4 mt-1">
                  Each Partner is responsible for complying with the Food Safety Act 1990 and all local authority food
                  law, including safe food handling, hygiene, labelling and allergen information. Partners must hold any
                  required food business registrations and provide accurate allergen and ingredient information to
                  Customers. We require Partners to maintain appropriate food hygiene standards and to cooperate with
                  inspections.
                </p>
              </li>

              <li>
                <strong>Hygiene ratings</strong>
                <p className="ml-4 mt-1">
                  Partners are encouraged to display their local food-hygiene rating where appropriate and to keep
                  public information accurate. We may surface hygiene ratings provided by local authorities.
                </p>
              </li>

              <li>
                <strong>Allergens</strong>
                <p className="ml-4 mt-1">
                  Partners must record and disclose mandatory allergen information for prepacked or non-prepacked
                  foods as required by law. Customers with severe allergies should contact Partners directly before
                  ordering. We provide guidance and signposting but cannot guarantee the absence of unintended
                  allergens.
                </p>
              </li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">
              Partners and Couriers — Obligations
            </h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>Registration and verification</strong>
                <p className="ml-4 mt-1">
                  Partners and Couriers must register, provide truthful information, and submit required documents
                  (e.g., food registration, insurance). We may perform identity checks and background checks.
                </p>
              </li>

              <li>
                <strong>Standards</strong>
                <p className="ml-4 mt-1">
                  Partners must ensure food safety, accurate menus, lawful pricing, clear allergen details and valid
                  licences. Couriers must hold any required licences and follow food-safe delivery practices.
                </p>
              </li>

              <li>
                <strong>Independent status</strong>
                <p className="ml-4 mt-1">
                  Unless specifically contracted otherwise, Couriers are independent contractors; they are responsible
                  for their taxes, insurance and legal obligations. We will provide guidance; customers and Partners
                  should not assume employment status. We will respond to government guidance and may adjust
                  operational terms to comply with UK tax and employment rules.
                </p>
              </li>


            </ul>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Reviews, Ratings and User Content</h2>
            <p className="ml-4 mt-1">
              Customers may leave reviews. Reviews must be honest and lawful. We may moderate, edit or remove
              content that breaches our policies or the law. By posting you grant us a licence to use the content for
              promotion and operation of the Service.
            </p>


            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Intellectual Property</h2>
            <p className="ml-4 mt-1">
              We process personal data to operate the Service, provide orders, handle payments and for marketing
              where permitted. We are committed to compliance with UK data protection law (UK GDPR and Data
              Protection Act 2018). We provide a separate Privacy Policy describing how we collect, use and protect
              your data, your rights, retention periods, and contact details for our Data Protection Officer (DPO). For
              guidance on data protection obligations, see the Information Commissioner’s Office
            </p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Privacy and Data Protection</h2>
            <p className="ml-4 mt-1">
              We process personal data to operate the Service, provide orders, handle payments and for marketing
              where permitted. We are committed to compliance with UK data protection law (UK GDPR and Data
              Protection Act 2018). We provide a separate Privacy Policy describing how we collect, use and protect
              your data, your rights, retention periods, and contact details for our Data Protection Officer (DPO). For
              guidance on data protection obligations, see the Information Commissioner’s Office.
            </p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Security</h2>
            <p className="ml-4 mt-1">
              We implement reasonable technical and organisational measures to protect data and the platform.
              Where payment-card data processing is required, we rely on PCI-compliant processors. No online
              system is perfect; you must keep account passwords secure.
            </p>


            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Liability and Indemnity</h2>

            <ul className="list-disc ml-6 space-y-2 leading-relaxed">
              <li>
                <strong>Our liability</strong>
                <p className="ml-4 mt-1">
                  We act as an intermediary platform. To the fullest extent permitted by law, our liability to you for losses
                  arising from use of the Service is limited to the amount paid by you for the relevant Order. Nothing in
                  these Terms excludes liability for death or personal injury caused by our negligence or for fraud.
                </p>
              </li>

              <li>
                <strong>Partners’ liability</strong>
                <p className="ml-4 mt-1">
                  Partners are responsible for the quality, safety and description of food, and for meeting legal
                  obligations. If food causes personal injury or illness, the Partner’s liability applies.
                </p>
              </li>

              <li>
                <strong>Indemnity</strong>
                <p className="ml-4 mt-1">
                  You agree to indemnify and hold us harmless from any claims, losses or damages arising from your
                  breach of these Terms, unlawful actions, or incorrect information you provide.
                </p>
              </li>
            </ul>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Complaints, Refunds and Dispute Resolution</h2>
            <p>If you have a complaint about an Order, Partner, or Courier, please follow our complaints process
              [contact details below]. We will investigate and respond promptly. Consumers retain statutory rights
              under UK law. If disputes remain unresolved, you and ChopNow agree to attempt amicable resolution;
              if that fails, disputes will be governed by the courts of England and Wales (unless otherwise required by
              local law).</p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Termination and Suspension</h2>
            <p>

              We may suspend or terminate accounts or remove listings that breach these Terms, pose health risks,
              or for operational reasons. On termination, outstanding obligations survive, including payments,
              refunds, indemnities and disclaimers.
            </p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Changes to These Terms</h2>
            <p>We may change these Terms occasionally (for legal, operational or commercial reasons). We will publish
              updated Terms on the Service with a new “last updated” date. Material changes will be notified to
              registered users by email or in-app notice where practicable. Continued use of the Service after
              changes constitutes acceptance.</p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Third-Party Services and Links</h2>
            <p>The Service may use third-party services (payment processors, mapping services). Your relationship
              with those third parties is governed by their terms. We are not responsible for their practices.</p>


            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Promotions, Loyalty and Gift Cards</h2>
            <p>Promotions are subject to specific terms. Loyalty points, discounts or gift cards may have expiry dates
              and restrictions. We reserve the right to modify or cancel promotions in line with fair practice.</p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Marketing and Communications</h2>
            <p>By creating an account you consent to receive transactional communications. Separate opt-in is
              required for marketing messages; you can withdraw consent any time. We comply with electronic
              communications law and the Privacy and Electronic Communications Regulations (PECR)</p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Accessibility</h2>
            <p>We strive to make our Service accessible. If you need help using the Service or require reasonable
              adjustments, contact our support team and we will assist.</p>

            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Legal Notices and Contact</h2>
            <p>If you need to contact us about these Terms, complaints or data protection matters, use the contact
              information provided on our website. For legal notices, send to the company address listed on the site.
              For data protection queries, contact our DPO.</p>


            <h2 className='font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4'>Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the
              exclusive jurisdiction of the courts of England and Wales unless statutory rights require otherwise.</p>


          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
