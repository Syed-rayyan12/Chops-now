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
                        Gender Pay Gap
                    </h1>

                    <p className="font-ubuntu text-white mb-6 text-[18px] text-center max-w-2xl px-4">
                        We're committed to closing the gender pay gap and promoting equality across our platform.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-36 max-2xl:px-8 max-md:px-12 max-sm:px-8">
                    <div className="max-w-4xl mx-auto space-y-6 text-foreground font-ubuntu">


                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Executive Summary</h2>

                        <p className="leading-relaxed">
                            ChopNow is committed to fairness, inclusion and equal pay for equal work. This voluntary 2026 Gender
                            Pay Gap Report shows our current position, what it means, and the concrete steps we are taking to
                            close gaps and build a more equitable workplace as we scale. Where we present numbers, they reflect
                            payroll and bonus data for the snapshot date above. Where data is limited by headcount we flag this
                            and explain our approach.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Legal and Policy Context</h2>
                        <p className="leading-relaxed">
                            We follow the spirit of UK requirements under the Equality Act 2010 and the Gender Pay Gap
                            Regulations. Even though ChopNow may be below the mandatory reporting threshold, we publish
                            these results voluntarily to be accountable to staff, partners and customers and to embed equitable
                            practice from the start.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Legal and Policy Context</h2>
                        <p className="leading-relaxed">
                            We follow the spirit of UK requirements under the Equality Act 2010 and the Gender Pay Gap
                            Regulations. Even though ChopNow may be below the mandatory reporting threshold, we publish
                            these results voluntarily to be accountable to staff, partners and customers and to embed equitable
                            practice from the start.
                        </p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Our Data — Key Metrics</h2>
                        <p>ChopNow is a young business with a small workforce. Small changes in staffing have a material effect
                            on percentages. These figures are accurate to our payroll at the snapshot date.</p>


                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Mean Gender Pay Gap (hourly):</strong> 8.4% (male mean higher)</li>
                            <li><strong>Median Gender Pay Gap (hourly):</strong> 6.0% (male median higher)</li>
                            <li><strong>Mean Bonus Gap:</strong> 12.5% (male mean higher)</li>
                            <li><strong>Median Bonus Gap:</strong> 0.0% (no median difference)</li>
                            <li><strong>Proportion Receiving Bonus:</strong> Male 56% — Female 50%</li>

                            <li>
                                <strong>Pay Quartile Distribution:</strong>
                                <ul className="list-disc pl-6 mt-2 space-y-2">
                                    <li><strong>Upper quartile:</strong> 58% male / 42% female</li>
                                    <li><strong>Upper middle quartile:</strong> 52% male / 48% female</li>
                                    <li><strong>Lower middle quartile:</strong> 46% male / 54% female</li>
                                    <li><strong>Lower quartile:</strong> 44% male / 56% female</li>
                                </ul>
                            </li>
                            <li><strong>Interpretation:</strong> The gaps are modest but present. They reflect early-stage hiring patterns, a small
                                executive team with more male representation, and operational roles (delivery/courier) that skew
                                male. Bonus gaps are influenced by role mix and commission structures. As headcount increases, we
                                expect more stable trends.</li>
                        </ul>


                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Training and Internal Governance</h2>
                        <p className="leading-relaxed">
                            All relevant staff receive training on modern slavery risks, red flags and reporting procedures.
                            Recruitment and operations teams are trained to spot signs of exploitation among partners and
                            couriers. Our Chief Operating Officer and Data Protection Officer share responsibility for oversight, and
                            senior management review modern slavery issues at least twice yearly.
                        </p>



                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">What The Numbers Mean (Plainly)</h2>
                        <ul className='list-disc pl-6 mt-2 space-y-2'>
                            <li>A positive pay gap percentage above zero means that, on average, men are paid more than
                                women. It does not necessarily mean unequal pay for the same role — that is a separate legal
                                requirement we already enforce.</li>
                            <li>Our median gap (6.0%) is lower than many sector averages but still shows room to improve. The
                                mean gap is pulled up by a higher-paid small group of male employees in senior or technical
                                roles.</li>
                            <li>Bonus gap is primarily a reflection of role mix and the timing of performance-based payments;
                                we are addressing this in bonus design.</li>

                        </ul>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Root Causes Identified</h2>

                        <ul className="list-disc pl-6 space-y-3">
                            <li><strong>Role Mix:</strong> Early-stage operational roles (drivers, logistics) currently have higher male representation.</li>
                            <li><strong>Senior Hires:</strong> Our leadership and technical hires to date are disproportionately male, affecting mean pay.</li>
                            <li><strong>Bonus Design:</strong> Commission and incentive models favour roles with variable pay; some roles held more by men benefit more.</li>
                            <li><strong>Recruitment Pipeline:</strong> Limited outreach to female candidates for tech and leadership posts.</li>
                            <li><strong>Part-time And Flexible Working:</strong> Some women are in part-time roles; we must ensure promotion and pay progression remain equitable.</li>
                        </ul>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Actions We Are Taking — 12 Month Plan (Committed)</h2>
                        <p>We set near-term, measurable steps that balance urgency with practical delivery:</p>
                        <ul className='list-disc pl-6 space-y-3'>
                            <li>
                                <strong>Transparent Job Bands and Pay Ranges</strong><br />
                                Publish salary bands for all roles internally and apply consistent pay offers. Target: implement by Q1 2027.
                            </li>

                            <li>
                                <strong>Fair Bonus and Incentive Review</strong><br />
                                Redesign incentive schemes to reduce role-dependent bias and add non-financial recognition options. Target: new scheme live Q2 2027.
                            </li>

                            <li>
                                <strong>Inclusive Recruitment Practices</strong><br />
                                Use gender-neutral adverts, diverse shortlists, and female-focused talent channels for leadership and tech roles. Target: 50% diverse shortlist for senior roles.
                            </li>

                            <li>
                                <strong>Leadership Development and Returner Support</strong><br />
                                Offer leadership training, mentoring and return-to-work programmes targeted at women. Target: three participants in the first year.
                            </li>

                            <li>
                                <strong>Flexible Working and Role Design</strong><br />
                                Promote flexible hours, job-sharing, and remote options for senior and technical roles to broaden the candidate pool.
                            </li>

                            <li>
                                <strong>Courier and Partner Diversity</strong><br />
                                Work with community partners to attract a more diverse courier base and support women-run kitchens through grants and business support.
                            </li>

                            <li>
                                <strong>Monitoring and Transparency</strong><br />
                                Publish this report annually, set public targets, and track progress quarterly. Assign executive sponsor and HR owner.
                            </li>
                        </ul>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Targets and Measurement</h2>
                        <ul className='list-disc pl-6 space-y-3'>
                            <li>Reduce mean gender pay gap to below 5% by 5 April 2028.</li>
                            <li>Achieve gender balance (45–55%) in leadership roles by 5 April 2029.</li>
                            <li>Ensure 50% of senior role shortlists include female candidates from Q2 2027.
                                Progress will be reported publicly each year and internally to staff.</li>
                        </ul>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Governance, Accountability and Responsibility</h2>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>
                                <strong>Board Oversight:</strong> The Board reviews pay-gap progress annually and approves strategy.
                            </li>

                            <li>
                                <strong>Executive Sponsor:</strong> Chief People Officer (or equivalent) is accountable for delivery.
                            </li>

                            <li>
                                <strong>Operational Lead:</strong> HR will own data collection, pay reviews and reporting.
                            </li>

                            <li>
                                <strong>Employee Voice:</strong> We will set up a diversity and inclusion working group including employee representatives.
                            </li>
                        </ul>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Pay Equity Assurance</h2>
                        <p>ChopNow is committed to equal pay for equal work and conducts regular equal-pay audits: matching
                            roles by job band, seniority and responsibilities to confirm there is no unjustified difference in pay
                            between genders for the same role.</p>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Risks And Mitigations</h2>
                        <ul className='list-disc pl-6 space-y-3'>
                            <li>
                                <strong>Small Sample Volatility:</strong> With a small workforce, single hires can swing metrics. Mitigation: focus
                                on structural changes (pay bands, inclusive hiring) rather than short-term number management.
                            </li>

                            <li>
                                <strong>Operational Constraints:</strong> Some operational roles are traditionally male-dominated. Mitigation:
                                outreach, alternative role design and targeted incentives to widen the applicant pool.
                            </li>
                        </ul>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Communication and Engagement</h2>
                        <span>We will:</span>
                        <ul>
                            <li>Share this report with all staff and partners.</li>
                            <li>Run workshops explaining the data and planned actions.</li>
                            <li>Invite feedback and ideas from employees and the community.</li>
                        </ul>
                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Closing Statement</h2>
                        <p>ChopNow wants to build a company that reflects the communities we serve — diverse, fair and
                            inclusive. This Gender Pay Gap Report is a public commitment to measurable change. Numbers give us
                            direction; actions close the gap. We will report progress honestly, learn fast, and keep accountability
                            visible.</p>

                        <h2 className="font-fredoka-one text-2xl font-bold text-foreground mt-8 mb-4">Contact and Further Information</h2>
                        <p>For questions about this report or to request further detail, contact:</p>
                        <p>Email: hello@chopnow.co.uk</p>
                         <p>Phone: +44 20 7946 0123</p>
                        <p>ChopNow Ltd</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
