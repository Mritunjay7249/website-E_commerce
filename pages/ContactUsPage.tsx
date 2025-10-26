import React, { useState } from 'react';
import BackButton from '../components/BackButton';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to a server
    console.log('Form Submitted', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-base-100 p-8 rounded-lg shadow-lg">
        {/* Contact Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-display font-bold text-primary">Get in Touch</h1>
          <p className="text-gray-600">
            We'd love to hear from you! Whether you have a question about our products, an order, or anything else, our team is ready to answer all your questions.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>123 ShopSphere Lane, E-commerce City, 12345</span>
            </div>
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span>support@shopsphere.com</span>
            </div>
            <div className="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <span>+1 (234) 567-890</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full bg-green-50 p-6 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-green-700">Thank you!</h2>
              <p className="text-green-600 mt-2">Your message has been sent. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
              </div>
              <button type="submit" className="w-full btn bg-secondary text-white hover:bg-secondary-focus font-bold py-3 rounded-full text-lg">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
