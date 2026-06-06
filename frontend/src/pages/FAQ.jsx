import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQData = [
  {
    id: 1,
    category: 'Ordering',
    question: 'How do I place an order?',
    answer: 'Browse our products, add items to your cart, proceed to checkout, fill in your shipping details, and place your order. You\'ll receive a confirmation email with your order details.',
  },
  {
    id: 2,
    category: 'Ordering',
    question: 'Can I modify my order after placing it?',
    answer: 'Yes, you can modify your order within 2 hours of placement. Please contact our support team immediately with your order number.',
  },
  {
    id: 3,
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and digital payment methods including Google Pay, Apple Pay, and bank transfers.',
  },
  {
    id: 4,
    category: 'Payments',
    question: 'Is my payment information secure?',
    answer: 'Yes, all payments are processed through secure SSL-encrypted channels. We never store your credit card information directly.',
  },
  {
    id: 5,
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available for an additional fee. Delivery times may vary based on location.',
  },
  {
    id: 6,
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship within India only. We\'re working on international shipping options.',
  },
  {
    id: 7,
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer 30-day returns for unopened products in original packaging. Please contact our support team to initiate a return.',
  },
  {
    id: 8,
    category: 'Returns',
    question: 'How long do refunds take?',
    answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.',
  },
  {
    id: 9,
    category: 'Products',
    question: 'Are your products organic?',
    answer: 'We offer both organic and conventional agricultural products. Product descriptions clearly indicate whether items are organic certified.',
  },
  {
    id: 10,
    category: 'Products',
    question: 'How do I know if a product is in stock?',
    answer: 'Product availability is shown on each product page. Out-of-stock items display "Coming Soon" and you can be notified when they\'re back in stock.',
  },
  {
    id: 11,
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.',
  },
  {
    id: 12,
    category: 'Account',
    question: 'How do I track my order?',
    answer: 'You can track your order in your Profile page under "Order History" or via the tracking link sent in your order confirmation email.',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(FAQData.map(item => item.category))];
  const filteredFAQ = selectedCategory === 'All' 
    ? FAQData 
    : FAQData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-darkGreen to-green-500 text-white py-12"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-green-100">Find answers to common questions about NandiAgro</p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-darkGreen text-white'
                  : 'bg-gray-200 text-textPrimary hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQ.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="border border-darkGreen border-opacity-20 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-green-50 transition-colors"
                >
                  <div className="text-left">
                    <span className="inline-block bg-darkGreen bg-opacity-10 text-darkGreen text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-textPrimary">{faq.question}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 flex-shrink-0"
                  >
                    <ChevronDown size={24} className="text-darkGreen" />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {expanded === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 py-4 bg-green-50 border-t border-darkGreen border-opacity-10"
                    >
                      <p className="text-textSecondary leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Still Need Help? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center bg-green-50 rounded-lg p-8 border border-darkGreen border-opacity-20"
        >
          <h3 className="text-2xl font-bold text-textPrimary mb-3">Still need help?</h3>
          <p className="text-textSecondary mb-6">
            Can't find the answer you're looking for? Contact our support team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-darkGreen text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
}
