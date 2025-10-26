import React from 'react';
import BackButton from '../components/BackButton';

const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-base-100 p-8 rounded-lg shadow-lg">
      <BackButton />
      <h1 className="text-4xl font-display font-bold mb-6 text-center text-primary">Shipping Policy</h1>
      
      <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Order Processing</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in the shipment of your order, we will contact you via email or telephone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Shipping Rates & Delivery Estimates</h2>
          <p>
            Shipping charges for your order will be calculated and displayed at checkout. We offer several shipping options to meet your needs. Delivery delays can occasionally occur.
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><span className="font-semibold">Standard Shipping:</span> 5-7 business days</li>
            <li><span className="font-semibold">Expedited Shipping:</span> 2-3 business days</li>
            <li><span className="font-semibold">Overnight Shipping:</span> 1-2 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours. You can track your order status in the "My Orders" section of your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Damages</h2>
          <p>
            ShopSphere is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicyPage;
