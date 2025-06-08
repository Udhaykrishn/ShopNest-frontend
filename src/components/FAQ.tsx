import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is ShopNest?",
    answer:
      "ShopNest is a multi-vendor e-commerce platform where you can buy and sell a wide variety of products. Think of it as your one-stop shop, connecting customers with vendors from across India and beyond, offering everything from fashion to electronics at competitive prices.",
    value: "item-1",
  },
  {
    question: "How can I become a vendor on ShopNest?",
    answer:
      "To become a vendor, sign up on our Vendor Portal, submit your business details, and get your products approved by our team. Once approved, you can start listing your items and reach millions of ShopNest customers!",
    value: "item-2",
  },
  {
    question: "Are the products on ShopNest genuine?",
    answer:
      "Yes! We work closely with verified vendors to ensure product authenticity. Every item goes through a quality check before approval, and we encourage customer reviews to maintain trust and transparency.",
    value: "item-3",
  },
  {
    question: "What payment methods does ShopNest accept?",
    answer:
      "ShopNest supports multiple payment options, including UPI, credit/debit cards, net banking, and cash on delivery (COD) in select areas. Shop with ease using your preferred method!",
    value: "item-4",
  },
  {
    question: "How does ShopNest ensure fast delivery?",
    answer:
      "We partner with top logistics providers across India to offer lightning-fast delivery. Most orders are delivered within 2-5 days, depending on your location, with real-time tracking available for every purchase.",
    value: "item-5",
  },
  {
    question: "Can I return or exchange items on ShopNest?",
    answer:
      "Absolutely! ShopNest offers a hassle-free return and exchange policy. If you’re not satisfied with your purchase, you can return it within 7 days of delivery, provided it meets our return conditions.",
    value: "item-6",
  },
  {
    question: "How do I contact ShopNest support?",
    answer:
      "Our customer support team is here 24/7. Reach out via email at support@shopnest.in, call us at 1800-123-4567, or use the live chat feature on our website for instant assistance.",
    value: "item-7",
  },
  {
    question: "Does ShopNest offer discounts or deals?",
    answer:
      "Yes! ShopNest regularly features discounts, flash sales, and exclusive deals from our vendors. Keep an eye on our homepage or subscribe to our newsletter for the latest offers!",
    value: "item-8",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};