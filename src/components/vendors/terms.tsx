import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const TermsPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <section className="container py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          <span className="text-primary">Terms</span> & Policy
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          These terms govern your use of ShopNest, ensuring compliance with Indian laws like the <strong>Consumer Protection Act, 2019</strong> and <strong>Information Technology Act, 2000</strong>. By using our platform, you agree to these conditions.
        </p>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" asChild>
          <Link to="/vendor-landing">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vendor Page
          </Link>
        </Button>
      </section>

      {/* Terms Content Section */}
      <section className="container py-16">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Terms & Policy Details</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 dark:text-gray-400 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Account Responsibilities</h3>
              <p>
                Vendors must provide accurate information, as required by the <strong>Consumer Protection (E-commerce) Rules, 2020</strong>, and secure their accounts. The <strong>Information Technology Act, 2000</strong> penalizes unauthorized access under <strong>Section 72A</strong>. Notify us of security issues, and our <strong>Grievance Officer</strong>, mandated by the <strong>IT Rules, 2011</strong>, will address complaints within 30 days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Commission and Fees</h3>
              <p>
                ShopNest charges a <strong>10% commission</strong> on each sale, per the <strong>Consumer Protection (E-commerce) Rules, 2020</strong>, varying by category. Vendors handle taxes under the <strong>Goods and Services Tax Act, 2017</strong>. No upfront or monthly fees apply. The <strong>Central Consumer Protection Authority</strong> ensures fair pricing practices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Product Listings</h3>
              <p>
                Products must meet <strong>quality standards</strong> under the <strong>Consumer Protection Act, 2019</strong> and comply with the <strong>Legal Metrology Act, 2009</strong> for accurate labeling. Prohibited items are banned under <strong>Section 18</strong> of the <strong>E-commerce Rules</strong>. The <strong>Central Consumer Protection Authority</strong> may order recalls for unsafe products.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">4. Account Suspension</h3>
              <p>
                Accounts may be suspended for violations like <strong>fraud</strong> or selling <strong>prohibited items</strong>, per the <strong>E-commerce Rules, 2020</strong>. The <strong>Information Technology Act, 2000</strong> imposes penalties under <strong>Section 43A</strong> for data negligence. Suspended vendors can appeal to the <strong>Grievance Officer</strong> within 15 days, with repeated violations leading to <strong>permanent termination</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">5. Payments and Refunds</h3>
              <p>
                Payments, minus the <strong>10% commission</strong>, are processed bi-weekly via a secure gateway, per the <strong>Payment and Settlement Systems Act, 2007</strong>. Refunds for defective products comply with the <strong>E-commerce Rules, 2020</strong>. Vendors maintain a <strong>nodal account</strong>, as required by the <strong>Reserve Bank of India</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">6. Roles and Compliance</h3>
              <p>
                The <strong>Grievance Officer</strong> handles complaints, while the <strong>Chief Compliance Officer</strong> ensures adherence to the <strong>E-commerce Rules, 2020</strong>. The <strong>Central Consumer Protection Authority</strong> investigates unfair practices. Vendors, as <strong>data fiduciaries</strong> under the <strong>Digital Personal Data Protection Act, 2023</strong>, manage customer data responsibly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">7. Termination</h3>
              <p>
                Accounts may be terminated for <strong>fraud</strong> or non-compliance with the <strong>Indian Contract Act, 1872</strong>. The <strong>E-commerce Rules, 2020</strong> allow suspension for misleading ads. Terminated vendors can appeal to the <strong>Grievance Officer</strong>, and payments are settled per <strong>Reserve Bank of India</strong> guidelines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">8. Limitation of Liability</h3>
              <p>
                ShopNest’s liability is limited to fees paid, per the <strong>Consumer Protection Act, 2019</strong>. The <strong>Information Technology Act, 2000</strong> protects intermediaries from third-party content liability. Disputes fall under Indian jurisdiction per the <strong>Indian Contract Act, 1872</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">9. Contact Us</h3>
              <p>
                Contact our <strong>Grievance Officer</strong> at support@shopnest.com for questions. The <strong>E-commerce Rules, 2020</strong> require responses within 30 days. Terms may be updated to reflect laws like the <strong>Digital Personal Data Protection Act, 2023</strong>, with changes posted here.
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

