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
                        Modern Slavery Statement
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
                        <p>ChopNow Ltd is committed to preventing modern slavery and human trafficking in all aspects of our
                            business and supply chains. This statement sets out our approach under the UK Modern Slavery Act
                            2015 and describes the steps we take to identify, prevent and remediate any risks connected to our
                            operations, partners and suppliers.</p>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Our Business and Supply Chains</h2>

                        <p className="leading-relaxed">
                            ChopNow operates a UK-based digital marketplace connecting customers with restaurants, registered
                            home cooks and courier partners, and works with food suppliers and logistics providers. Our supply
                            chain therefore includes: partner kitchens, ingredient suppliers, packaging vendors, courier
                            contractors, technology suppliers and third-party service providers both in the UK and internationally.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Risk Assessment and Where We See Risk</h2>
                        <p className="leading-relaxed">
                            We recognise higher risk areas include: informal or casual labour within food production, seasonal or
                            migrant labour in ingredient supply, subcontracted courier services, and a small number of thirdcountry suppliers. Risks can also arise from inexperienced home cooks or unregistered food businesses
                            who may rely on casual labour. We assess risk by country, sector, and business function and update our
                            risk register annually or when we onboard new suppliers.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Policies and Due Diligence</h2>
                        <p className="leading-relaxed">
                            We require all business partners to adhere to our Supplier Code Of Conduct, which explicitly prohibits
                            forced labour, bonded labour, child labour, withholding of wages, excessive working hours and abusive
                            treatment. Our onboarding checks for partners include: identity and right-to-work verification, basic
                            hygiene and registration documentation, and where relevant, insurance and DBS checks for couriers.
                            For ingredient suppliers and higher-risk vendors we require contractual commitments and the right to
                            audit.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Monitoring, Audits and Remediation</h2>
                        <p>We monitor compliance through a mix of self-assessment questionnaires, documentary checks and
                            targeted audits for higher-risk suppliers. Where issues are identified we require corrective action plans
                            and, if necessary, suspend or terminate relationships. We commit to working with affected parties to

                            remediate harm in line with legal and ethical obligations, and to report serious concerns to the
                            appropriate authorities.</p>


                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Training and Internal Governance</h2>
                        <p className="leading-relaxed">
                            All relevant staff receive training on modern slavery risks, red flags and reporting procedures.
                            Recruitment and operations teams are trained to spot signs of exploitation among partners and
                            couriers. Our Chief Operating Officer and Data Protection Officer share responsibility for oversight, and
                            senior management review modern slavery issues at least twice yearly.
                        </p>



                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Key Performance Indicators</h2>
                        <p className="leading-relaxed">
                            To measure effectiveness we track: number of supplier assessments completed, percentage of high-risk
                            suppliers with contractual modern slavery clauses, number of staff trained, and number of corrective
                            actions closed. We will publish progress annually and adjust targets as needed.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Collaboration and Continuous Improvement</h2>
                        <p className="leading-relaxed">
                            We engage with sector groups, local authorities and peer platforms to share best practice. We will
                            progressively deepen due diligence for cross-border suppliers and explore independent third-party
                            audits where risk justifies the expense.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Reporting Concerns and Contact</h2>
                        <p className="leading-relaxed">
                            If you suspect modern slavery or exploitation in our operations or supply chain, contact:
                        </p>
                        <p><strong>Email:</strong> hello@chopnow.co.uk</p>
                        <p className=''><strong>Phone:</strong> 07944 445328</p>
                        <p>ChopNow Ltd</p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Approval</h2>
                        <p>This statement was approved by the Board of ChopNow Ltd and will be reviewed and updated
                            annually.</p>
                    
                        <p className="mt-4">Name:[Board Chair / CEO]</p>
                       
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
