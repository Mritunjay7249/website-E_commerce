import React from 'react';
import BackButton from '../components/BackButton';

const AboutUsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-base-100 p-8 rounded-lg shadow-lg">
      <BackButton />
      <h1 className="text-4xl font-display font-bold mb-6 text-center text-primary">About ShopSphere</h1>
      
      <div className="space-y-8 text-lg text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Our Story</h2>
          <p>
            Founded in {new Date().getFullYear() - 2}, ShopSphere began with a simple idea: to create a seamless and enjoyable online shopping experience that brings together the best products from around the world. We saw a need for a platform that not only offers a vast selection but also prioritizes quality, customer satisfaction, and a strong sense of community. From a small team with a big dream, we've grown into a trusted destination for shoppers and sellers alike.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Our Mission</h2>
          <p>
            Our mission is to empower customers by providing them with an unparalleled selection of high-quality products, competitive prices, and exceptional service. We aim to connect people with the items they love and need, making everyday life a little easier and a lot more inspired.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Our Vision</h2>
          <p>
            We envision a world where shopping is not just a transaction, but an experience. Our goal is to be the most customer-centric company, where customers can find and discover anything they might want to buy online, and that empowers businesses of all sizes to reach a global audience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-display text-secondary mb-3">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="font-semibold">Customer Obsession:</span> We start with the customer and work backwards.</li>
            <li><span className="font-semibold">Passion for Innovation:</span> We are always looking for new ways to delight our customers.</li>
            <li><span className="font-semibold">Commitment to Excellence:</span> We set high standards and are committed to delivering quality in everything we do.</li>
            <li><span className="font-semibold">Integrity and Trust:</span> We operate with honesty and transparency to build lasting relationships.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
