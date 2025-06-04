import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const VendorLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="container py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Become a <span className="text-primary">Vendor</span> on ShopNest
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
          Join our vibrant marketplace and reach millions of customers. Sell your products with ease and grow your business with ShopNest's powerful tools.
        </p>
        <Button className="bg-primary text-white hover:bg-primary/90">
          Start Selling Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Benefits Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Sell on <span className="text-primary">ShopNest</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Global Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Access millions of customers worldwide with our expansive marketplace and targeted marketing tools.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Easy Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Get started in minutes with our user-friendly vendor dashboard and seamless onboarding process.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Powerful Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Leverage analytics, inventory management, and promotional tools to optimize your sales and growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-900 dark:text-white">What do I need to become a vendor?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400">
              You need a valid business registration, a bank account for payments, and products that meet our quality standards. Sign up on our vendor portal to get started.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-gray-900 dark:text-white">What are the fees for selling on ShopNest?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400">
              We charge a 10% commission on each sale, which varies by product category. There are no upfront costs or monthly fees to join as a vendor.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-gray-900 dark:text-white">How do I manage my inventory?</AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400">
              Our vendor dashboard allows you to upload, edit, and track your inventory in real-time. You can also integrate with third-party inventory management tools.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center bg-primary/10 dark:bg-primary/20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Grow Your Business?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
          Join thousands of vendors thriving on ShopNest. Sign up today and start selling to a global audience.
        </p>
        <Button className="bg-primary text-white hover:bg-primary/90">
          Become a Vendor <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Footer Section */}
      <footer className="container py-8 text-center border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-center gap-6">
          <Link
            to="/vendor/privacy"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
          >
            Privacy Policy
          </Link>
          <Link
            to="/vendor/terms"
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-opacity"
          >
            Terms & Policy
          </Link>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          © 2025 ShopNest. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
