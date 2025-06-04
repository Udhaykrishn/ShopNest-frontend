import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="container py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="text-primary">Privacy</span> Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          At ShopNest, we prioritize your <strong>privacy</strong> and comply with Indian laws, including the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>. This policy explains how we collect, use, and protect your personal information.
        </p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
          <Link to={"/vendor-landing"}>
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vendor Page
          </Link>
        </Button>
      </section>

      {/* Policy Content Section */}
      <section className="container py-16">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Privacy Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-400 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
              <p>
                We collect <strong>sensitive personal data</strong>, such as your name, email, payment details, and business information, when you register as a vendor. Browsing data, including <strong>IP addresses</strong> and <strong>cookies</strong>, is gathered to improve user experience. The <strong>Digital Personal Data Protection Act, 2023</strong> defines personal data as any identifiable information, and we obtain your <strong>consent</strong> before collection, as required by the <strong>Information Technology Act, 2000</strong> and its <strong>SPDI Rules, 2011</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h3>
              <p>
                Your data supports <strong>transaction processing</strong>, <strong>vendor account management</strong>, and <strong>personalized marketing</strong>, as permitted by the <strong>Digital Personal Data Protection Act, 2023</strong>. We use analytics to enhance platform performance, ensuring data processing aligns with your <strong>consent</strong>. The <strong>Information Technology Act, 2000</strong> requires us to disclose our practices, which are accessible here. Depersonalized data aids <strong>market research</strong> to improve services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Data Protection and Security</h3>
              <p>
                We use <strong>encryption</strong> and <strong>secure servers</strong> to protect your data, as mandated by the <strong>Information Technology Act, 2000</strong> under <strong>Section 43A</strong>. Data breaches are reported to the <strong>Indian Computer Emergency Response Team</strong> and the <strong>Data Protection Board</strong>, per the <strong>Digital Personal Data Protection Act, 2023</strong>. Breach notifications include details and mitigation steps, with potential <strong>penalties</strong> for non-compliance based on severity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">4. Sharing Your Information</h3>
              <p>
                Data is shared only with <strong>trusted third-party processors</strong>, like payment gateways, under strict <strong>confidentiality agreements</strong>, as per the <strong>Digital Personal Data Protection Act, 2023</strong>. The <strong>Consumer Protection (E-commerce) Rules, 2020</strong> ensure consumer data protection during transactions. We do not sell data, and <strong>cross-border transfers</strong> require adequate safeguards.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">5. Your Rights</h3>
              <p>
                You can <strong>access</strong>, <strong>correct</strong>, or <strong>delete</strong> your data and withdraw <strong>consent</strong>, as granted by the <strong>Digital Personal Data Protection Act, 2023</strong>. The <strong>Puttaswamy Judgment, 2017</strong> upholds <strong>privacy</strong> as a fundamental right under <strong>Article 21</strong> of the Indian Constitution. Contact our <strong>Data Protection Officer</strong> at support@shopnest.com to exercise these rights or use our <strong>consent manager</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">6. Roles and Compliance</h3>
              <p>
                ShopNest acts as a <strong>data fiduciary</strong> under the <strong>Digital Personal Data Protection Act, 2023</strong>, overseeing data processing. Our <strong>Data Protection Officer</strong> conducts audits and handles grievances, while the <strong>Grievance Officer</strong>, mandated by the <strong>Consumer Protection Act, 2019</strong>, resolves complaints within 30 days. We provide this policy in <strong>English</strong> and <strong>regional languages</strong> for accessibility.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">7. E-commerce Privacy</h3>
              <p>
                The <strong>Consumer Protection (E-commerce) Rules, 2020</strong> require limiting data collection to <strong>transactional needs</strong> and prohibiting unauthorized <strong>profiling</strong>, especially for children, as per the <strong>Digital Personal Data Protection Act, 2023</strong>. We comply with the <strong>Legal Metrology Act, 2009</strong> for accurate data in product listings, ensuring transparency and trust.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">8. Changes to This Policy</h3>
              <p>
                We may update this policy to align with laws like the <strong>Digital Personal Data Protection Act, 2023</strong> or <strong>Information Technology Act, 2000</strong>. Updates will be posted here, with significant changes communicated via email. The <strong>Ministry of Electronics and Information Technology</strong> oversees compliance, ensuring your data’s safety.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer Section */}
      <footer className="container py-8 text-center border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          © 2025 ShopNest. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
