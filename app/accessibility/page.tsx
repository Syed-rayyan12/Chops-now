"use client"

import { Header } from '@/components/customer-panel-components/header'
import { Footer } from '@/components/customer-panel-components/footer'

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Banner Section */}
      <div className="relative w-full flex items-center justify-center h-[89vh] bg-gradient-to-r from-orange-100 to-orange-200 py-22">
        <img
          src="/boo.png"
          alt="Accessibility Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <img
            src="/lines.svg"
            alt="Lines"
            className="w-80 mx-auto pointer-events-none mb-10 select-none max-sm:w-50"
          />
          <h1 className="font-fredoka-one font-bold max-lg:text-4xl max-md:text-5xl lg:text-5xl mb-5 max-sm:text-3xl max-sm:mb-2 text-white">
            Accessibility
          </h1>

          <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
            We're committed to making our platform accessible to everyone.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
          <div className="max-w-4xl mx-auto space-y-6 text-foreground font-ubuntu">

            <p>Effective from: 1st December 2025</p>
            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Statement of Intent</h2>

            <p className="leading-relaxed">
              ChopNow is committed to making our website, mobile apps and services accessible to everyone,
              including people with disabilities. We aim to meet WCAG 2.1/2.2 Level AA standards where practical,
              remove barriers, and offer reasonable adjustments for customers, partners and couriers. We follow the
              Equality Act 2010 duty to make reasonable adjustments and work to ICO guidance on accessible online
              services.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Scope</h2>
            <p className="leading-relaxed">
              This policy covers: the ChopNow website and web apps, Android and iOS apps, marketing emails,
              downloadable documents (PDFs), partner dashboards, and customer support channels (phone, chat,
              email). It also covers physical aspects of our service where relevant (for example, delivery procedures
              and partner premises accessibility)
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Standards and Legal Framework</h2>
            <p className="leading-relaxed">
              We design and test our digital services against the Web Content Accessibility Guidelines (WCAG) 2.1 and
              the newer WCAG 2.2 success criteria, aiming for Level AA conformance. We also recognise the Equality
              Act 2010 requirement to make reasonable adjustments for disabled customers and staff, and we follow
              ICO guidance on accessibility and data handling. Public sector accessibility regulations are noted as best
              practice where applicable.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">What We Do Now — Practical Measures</h2>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Design and development:</strong> our digital products are built with semantic HTML, ARIA where needed, keyboard navigation, logical heading structure, and scalable text.</li>
              <li><strong>Visual accessibility:</strong> we check colour contrast, allow text resizing, and avoid using colour as the only means of conveying information.</li>
              <li><strong>Media:</strong> videos have captions and audio descriptions where feasible; images include meaningful alt text; transcripts are available on request.</li>
              <li><strong>Forms and checkout:</strong> form fields include visible labels, clear error messages, and support for assistive technologies.</li>
              <li><strong>Mobile apps:</strong> we follow platform accessibility guidelines (Android Accessibility, iOS VoiceOver) and expose content to screen readers.</li>
              <li><strong>Documents:</strong> PDFs and downloadable guides are produced in tagged, accessible formats when published. If a PDF is not accessible, we will supply an accessible alternative on request.</li>
              <li><strong>Testing:</strong> we combine automated scanning tools with manual testing (keyboard-only navigation, screen readers such as NVDA and VoiceOver), and real-user testing with people who have lived experience of disability. We log issues and prioritise fixes.</li>
              <li><strong>Training:</strong> product, support and partner onboarding teams receive accessibility training focused on practical adjustments and inclusive language.</li>
              <li><strong>Partner and courier onboarding:</strong> partners and couriers receive guidance on accessible order fulfilment (clear packaging labels, delivery arrival procedures, and communication methods for customers with access needs).</li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Known Limitations and Planned Fixes</h2>
            <p className="leading-relaxed">
              We aim for continuous improvement. Where parts of the site or app fall short of WCAG AA, we publish
              an accessibility statement listing known issues and estimated remediation timelines. Major issues are
              prioritised and typically scheduled for fix within our next two release cycles; critical accessibility defects
              are escalated and resolved more quickly.
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Alternatives and Reasonable Adjustments</h2>
            <p className="leading-relaxed">
              If you cannot use any part of our site or app, we will help you complete your task by providing
              alternative ways to access our service: phone ordering, email orders, or assisted ordering via our
              support team. We will also accept delivery instructions to help couriers provide safe, dignified drop-offs
              (for example, leave-with neighbour details, audible knock preference, or doorstep placement
              guidance).
            </p>

            <p>Phone support and accessible ordering: call +44 20 7946 0123 or email hello@chopnow.co.uk for
              assistance, alternative formats, or to request reasonable adjustments. We will respond within two
              business days and, where urgent, sooner</p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Accessibility Testing and Governance</h2>
            <p className="leading-relaxed">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Regular audit cycle:</strong> automated scans run weekly; manual audits run quarterly.</li>
              <li><strong>User testing:</strong> we recruit users with a range of access needs for feature testing before major releases.</li>
              <li><strong>Reporting and tracking:</strong> all accessibility issues are logged in our product backlog with clear owners and SLAs.</li>
              <li><strong>Oversight:</strong> our product lead and DPO review accessibility performance monthly and present updates to leadership.</li>
            </ul>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Third Parties and Partner Content</h2>
            <p className="leading-relaxed">
              ChopNow uses third-party services (payment gateways, analytics, maps, ad networks). We require
              vendors to meet accessibility and data protection standards and evaluate their accessibility practices
              during procurement. We cannot control the content or accessibility of partner restaurant websites or
              third-party pages linked from our service; where partner pages are necessary to complete a task we
              offer alternative support and will encourage partners to improve accessibility

            </p>


            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Accessibility ff Documents, Emails and Marketing</h2>
            <p className="leading-relaxed">
              All public documents published by ChopNow are produced with accessibility in mind. Marketing emails
              follow accessible templates (clear subject lines, structured headings, and readable fonts). If you receive
              inaccessible material, request an alternative format at hello@chopnow.co.uk and we will provide it
            </p>

            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Confidentiality, Privacy And Accessibility Requests</h2>
            <p className="leading-relaxed">
              When you ask for assistance or reasonable adjustments we will only collect the minimum personal data
              needed to provide the support. Requests are handled in line with our Privacy Policy and UK GDPR. You
              may request anonymised or pseudonymised records where appropriate.
            </p>


            <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">How To Give Feedback or Make a Complaint</h2>
            <p className="leading-relaxed">
              We welcome feedback about accessibility. Email hello@chopnow.co.uk or call +44 20 7946 0123. Tell
              us: which page or feature, what you were trying to do, the device and browser or app version, and any
              screenshots if possible. We will acknowledge receipt within two business days and outline the next
              steps. If you remain dissatisfied, you may contact the Equality Advisory and Support Service or the ICO.
            </p>

             <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Review and Updates</h2>
            <p className="leading-relaxed">
            This policy is reviewed at least annually or after significant product changes, legal updates, or major 
user feedback. We keep a public record of major accessibility improvements and publish an accessibility 
statement summarising conformance and outstanding issues.
            </p>

             <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Contact Details</h2>
             <p>For accessibility enquiries, support or to request alternative formats:</p>
            <p><strong>Email:</strong> hello@chopnow.co.uk</p>
            <p className='pt-4'><strong>Phone:</strong> +44 20 7946 0123</p>
             <p>ChopNow Ltd</p>

            
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
