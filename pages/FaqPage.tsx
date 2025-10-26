import React, { useState } from 'react';
import BackButton from '../components/BackButton';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <h3 className="font-semibold text-lg text-gray-800">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="p-4 pt-0 text-gray-600">
          {answer}
        </p>
      </div>
    </div>
  );
};


const faqData = [
    { q: 'How do I place an order?', a: 'To place an order, simply browse our products, select the items you wish to purchase, add them to your cart, and proceed to checkout. Follow the on-screen instructions to enter your shipping and payment information to complete your order.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All transactions are secure and encrypted.' },
    { q: 'How can I track my order?', a: 'Once your order has shipped, you will receive a confirmation email with a tracking number. You can use this number on the carrier\'s website to track your package. You can also view your order status in the "My Orders" section of your account.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy for most items. If you are not satisfied with your purchase, you can return it for a full refund or exchange. Please visit our Shipping & Returns page for more details.' },
    { q: 'How do I create an account?', a: 'Click the "Login" button at the top of the page, then choose to create an account. You can sign up as a customer or a seller. The process is quick and easy!' },
];

const FaqPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <BackButton />
      <div className="bg-base-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-display font-bold mb-8 text-center text-primary">Frequently Asked Questions</h1>
        <div className="space-y-2">
            {faqData.map((item, index) => (
                <FaqItem key={index} question={item.q} answer={item.a} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
