export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSubCategory {
  title: string;
  items: FAQItem[];
}

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  icon: string;
  subCategories: FAQSubCategory[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: "orders-delivery",
    title: "Orders & Delivery",
    description: "Find information on orders and shipping times, delivery options and tracking.",
    slug: "orders-delivery",
    icon: "package",
    subCategories: [
      {
        title: "Order and delivery information",
        items: [
          {
            question: "What are your delivery options and shipping costs?",
            answer: "We offer complimentary shipping on all orders above ₹1,000 within India. For orders below ₹1,000, a flat shipping fee of ₹50 applies. Standard delivery takes 5–7 business days. Express delivery is available at ₹120 and delivers within 2–3 business days. International shipping rates vary by destination and are calculated at checkout."
          },
          {
            question: "Do you offer international shipping?",
            answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please note that international orders may be subject to customs duties and taxes imposed by the destination country, which are the responsibility of the customer."
          },
          {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive a confirmation email with a tracking number and a link to track your package. You can also track your order by logging into your account and visiting the 'Orders' section."
          },
          {
            question: "How many items can I order?",
            answer: "There is no strict limit on the number of items you can order. However, for bulk orders exceeding 20 units of a single product, we recommend contacting us directly at hello@sampritibotanicals.com for assistance."
          },
          {
            question: "Can I change my delivery address after placing an order?",
            answer: "If your order has not yet been shipped, we can update the delivery address. Please contact us at hello@sampritibotanicals.com as soon as possible with your order number and the corrected address."
          },
          {
            question: "What should I do if my order hasn't arrived?",
            answer: "If your order has not arrived within the estimated delivery timeframe, please check your tracking information first. If the tracking shows no movement for more than 48 hours, contact us at hello@sampritibotanicals.com with your order number and we will investigate."
          },
        ],
      },
      {
        title: "Cancel or amend an order",
        items: [
          {
            question: "Can I cancel or amend my order?",
            answer: "Orders can be cancelled or amended within 2 hours of placement, as long as they have not been processed. Please contact us immediately at hello@sampritibotanicals.com with your order number. We will do our best to accommodate your request."
          },
        ],
      },
      {
        title: "Issue with order",
        items: [
          {
            question: "What should I do if an item is missing from my order?",
            answer: "We apologise for the inconvenience. Please contact us at hello@sampritibotanicals.com within 48 hours of receiving your order. Include your order number and a photo of the items received, and we will arrange for the missing item to be dispatched promptly."
          },
          {
            question: "What should I do if my order is damaged in transit?",
            answer: "We take great care in packaging our products, but if an item arrives damaged, please contact us at hello@sampritibotanicals.com within 48 hours. Include your order number and photographs of the damaged item and packaging. We will provide a replacement or a full refund."
          },
          {
            question: "What can I do if I haven't received an order confirmation email?",
            answer: "Please first check your spam or promotions folder. If you still cannot find it, contact us at hello@sampritibotanicals.com with the email address used for the purchase and we will resend the confirmation."
          },
        ],
      },
    ],
  },
  {
    id: "products-ingredients",
    title: "Products & Ingredients",
    description: "Learn about our formulations, ingredients, product usage guidance and suitability.",
    slug: "products-ingredients",
    icon: "leaf",
    subCategories: [
      {
        title: "Product usage guidance",
        items: [
          {
            question: "How should I store my Sampriti products?",
            answer: "Our botanical formulations are best stored in a cool, dry place away from direct sunlight. Some products benefit from refrigeration—please refer to the specific storage instructions on each product label. Keep lids tightly closed after use to preserve freshness."
          },
          {
            question: "Do Sampriti products have an expiry date?",
            answer: "Yes, all our products have a manufacturing date and best-before date printed on the packaging. Typically, our powdered formulations have a shelf life of 18–24 months when stored correctly. Once opened, we recommend using within 6 months for optimal potency."
          },
          {
            question: "Are Sampriti products safe to use during pregnancy?",
            answer: "While our formulations use traditional botanical ingredients, we recommend consulting your healthcare provider before using any herbal product during pregnancy or nursing. Some adaptogenic herbs may not be suitable for all stages of pregnancy."
          },
          {
            question: "Will Sampriti products aggravate sensitive skin?",
            answer: "Our formulations are crafted with gentle, time-honoured ingredients. However, as with any botanical product, we recommend performing a patch test on a small area of skin before full application. If you have known allergies to specific herbs, please review the ingredient list carefully."
          },
          {
            question: "How do I use the Shakti Peya adaptogenic brew?",
            answer: "Steep 1 teaspoon of Shakti Peya in hot water for 7 minutes. Drink at dawn or between meals for sustained vitality. It can also be mixed with warm milk for a more grounding experience. We recommend starting with one cup daily and adjusting based on your constitution."
          },
        ],
      },
      {
        title: "Product ingredients",
        items: [
          {
            question: "How does Sampriti select ingredients for its products?",
            answer: "Our ingredients are chosen based on centuries of traditional wisdom—rooted in Siddha and Ayurvedic lineages. We source from trusted growers who practice regenerative agriculture. Every ingredient is tested for purity, potency, and ethical sourcing before it reaches our formulations."
          },
          {
            question: "Do Sampriti products contain preservatives?",
            answer: "We use minimal, naturally-derived preservatives only when necessary to ensure product stability and safety. Our powdered formulations are traditionally preserved through careful drying and storage methods. We avoid synthetic parabens, phthalates, and artificial preservatives."
          },
          {
            question: "Are all Sampriti products vegan?",
            answer: "Yes, all our products are entirely plant-derived and vegan. We do not use any animal-derived ingredients or by-products in our formulations. We are committed to cruelty-free practices across every stage of production."
          },
          {
            question: "Do Sampriti products contain gluten?",
            answer: "All our products are gluten-free by design. We ensure that our ingredients and processing facilities are free from gluten contamination. However, if you have severe gluten sensitivity, please contact us for detailed information about specific products."
          },
        ],
      },
    ],
  },
  {
    id: "shipping-returns",
    title: "Shipping & Returns",
    description: "Information on our shipping policies, returns process, exchanges and refunds.",
    slug: "shipping-returns",
    icon: "return",
    subCategories: [
      {
        title: "Shipping information",
        items: [
          {
            question: "Which locations do you ship to?",
            answer: "We ship across all pin codes in India. International shipping is available to select countries. During checkout, you can verify if we deliver to your location. We are continuously expanding our shipping network."
          },
          {
            question: "Do you offer free shipping?",
            answer: "Yes, we offer complimentary standard shipping on all orders above ₹1,000 within India. Orders below ₹1,000 are charged a flat rate of ₹50. Express shipping is available at ₹120 regardless of order value."
          },
          {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 5–7 business days within India. Express shipping delivers within 2–3 business days. International shipping typically takes 10–14 business days, depending on the destination and customs clearance."
          },
          {
            question: "Do you ship to PO Boxes?",
            answer: "Unfortunately, we cannot ship to PO Box addresses. A physical delivery address with a contactable phone number is required for all shipments to ensure safe delivery."
          },
        ],
      },
      {
        title: "Returns and exchanges",
        items: [
          {
            question: "What is your returns policy?",
            answer: "We accept returns within 15 days of delivery. Products must be unopened, in their original packaging, and in resalable condition. To initiate a return, please contact us at hello@sampritibotanicals.com with your order number and reason for return."
          },
          {
            question: "How can I return my purchase?",
            answer: "To return a purchase, please email us at hello@sampritibotanicals.com with your order number. We will provide you with a return authorisation and shipping instructions. Return shipping costs are borne by the customer unless the return is due to a defect or error on our part."
          },
          {
            question: "When will I receive my refund?",
            answer: "Once we receive and inspect the returned items, refunds are processed within 5–7 business days. The amount will be credited to the original payment method. You will receive a confirmation email once the refund is processed."
          },
          {
            question: "Can I exchange a product?",
            answer: "Yes, we offer exchanges for unopened products within 15 days of delivery. Please contact us to initiate an exchange. If the exchange is due to a product defect or our error, we will cover the shipping costs."
          },
          {
            question: "Can I return a product purchased overseas?",
            answer: "International returns are accepted within 15 days of delivery. The customer is responsible for return shipping costs and any customs duties. We recommend using a tracked shipping service for returns."
          },
        ],
      },
    ],
  },
  {
    id: "payment-account",
    title: "Payment & Account",
    description: "Details on payment methods, account management, security and privacy.",
    slug: "payment-account",
    icon: "card",
    subCategories: [
      {
        title: "Payment options",
        items: [
          {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking, and EMI options on select cards. All transactions are processed through secure, encrypted payment gateways."
          },
          {
            question: "Is it safe to use my credit card on your website?",
            answer: "Yes, your security is our priority. All payments are processed through PCI-DSS compliant payment gateways with 256-bit SSL encryption. We do not store your card details on our servers."
          },
          {
            question: "Do you offer Cash on Delivery?",
            answer: "Yes, Cash on Delivery (COD) is available for orders within India. A nominal fee of ₹40 applies for COD orders. Orders placed via COD are limited to a maximum value of ₹5,000."
          },
          {
            question: "Do you offer EMI options?",
            answer: "Yes, we offer EMI options on orders above ₹3,000 on select credit cards. Available EMI plans include 3, 6, and 9 months. The EMI option is displayed at checkout if your card is eligible."
          },
        ],
      },
      {
        title: "Account management",
        items: [
          {
            question: "How do I create an account?",
            answer: "Click on the 'Account' icon at the top of the page and select 'Register'. Enter your name, email address, and a secure password. You can also register using your Google account for quicker access."
          },
          {
            question: "I forgot my password. How can I reset it?",
            answer: "On the login page, click 'Forgot Password'. Enter the email address associated with your account, and we will send you a password reset link. For security reasons, the link expires within 30 minutes."
          },
          {
            question: "How do I update my personal information?",
            answer: "Log into your account and navigate to 'Account Settings'. From there, you can update your name, email address, phone number, and delivery addresses. Remember to save your changes before leaving the page."
          },
          {
            question: "Can I delete my account?",
            answer: "Yes, you can request account deletion by contacting us at hello@sampritibotanicals.com. Please note that account deletion is permanent and cannot be undone. Your order history will be anonymised but retained for record-keeping purposes."
          },
        ],
      },
    ],
  },
  {
    id: "sustainability-ethics",
    title: "Sustainability & Ethics",
    description: "Our commitment to ethical sourcing, sustainability practices and social responsibility.",
    slug: "sustainability-ethics",
    icon: "globe",
    subCategories: [
      {
        title: "Our practices",
        items: [
          {
            question: "What is your approach to sustainability?",
            answer: "Sustainability is woven into every aspect of our practice. We source ingredients from growers who practice regenerative agriculture, use minimal and recyclable packaging, and operate a zero-waste production facility. Our commitment extends beyond products to the well-being of the communities we work with."
          },
          {
            question: "Are your products tested on animals?",
            answer: "Absolutely not. We are a cruelty-free brand. We do not test our formulations or ingredients on animals at any stage of production. We are committed to ethical practices and work only with suppliers who share this commitment."
          },
          {
            question: "What is your packaging made from?",
            answer: "Our packaging is made from recyclable and biodegradable materials wherever possible. We use glass bottles, recycled paper, and plant-based inks. We encourage our customers to reuse or recycle our packaging. We are continuously exploring innovative sustainable packaging solutions."
          },
          {
            question: "Do you have a refill programme?",
            answer: "We are in the process of introducing a refill programme for select products. This initiative is part of our commitment to reducing single-use packaging. Stay updated by subscribing to our newsletter for announcements."
          },
          {
            question: "How do you ensure ethical sourcing?",
            answer: "We personally visit and vet every source of our ingredients. We work directly with farming communities, paying fair wages and supporting traditional cultivation methods. Our supply chain is fully traceable from origin to bottle, ensuring transparency and ethical integrity."
          },
        ],
      },
    ],
  },
  {
    id: "other",
    title: "Other",
    description: "Additional information about our brand, careers, press and general enquiries.",
    slug: "other",
    icon: "dots",
    subCategories: [
      {
        title: "General enquiries",
        items: [
          {
            question: "How can I contact Sampriti Botanicals?",
            answer: "You can reach us via email at hello@sampritibotanicals.com or through the contact form on our website. We endeavour to respond to all enquiries within 24 hours during business days. For urgent matters, please mention 'Urgent' in your subject line."
          },
          {
            question: "Where are your products manufactured?",
            answer: "Our products are crafted in small batches in our facility located in the Western Ghats of India—a region known for its rich botanical biodiversity. Each batch is hand-reviewed and approved before dispatch."
          },
          {
            question: "Do you offer international wholesale or partnership opportunities?",
            answer: "Yes, we are open to wholesale and partnership enquiries. Please contact us at partnerships@sampritibotanicals.com with details about your business and the nature of the partnership you are seeking."
          },
          {
            question: "Are you present in any retail stores?",
            answer: "Currently, Sampriti Botanicals is available exclusively through our online store. This allows us to maintain the highest quality control and offer personalised guidance to every customer. We may expand to select retail partners in the future."
          },
        ],
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): FAQCategory | undefined => {
  return faqCategories.find((cat) => cat.slug === slug);
};
