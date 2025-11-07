import React, { useState } from 'react';

interface LeadFormModalProps {
  onSubmit: () => void;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    industry: '',
    consumption: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Here you would typically send the data to a server
    alert('Thank you for your submission!');
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[10px] flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-[772px] relative p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onSubmit} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-3xl font-semibold mb-2 text-left text-gray-900">Contact Form</h2>
        <p className="text-sm text-gray-600 mb-6 text-left">
          Registration in Mumbai, Pune, Delhi and Gurugram will be prioritized for delivery. State or territory location are used to estimate your on-road price. Final prices may vary due to individual circumstances.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {/* Row 1: Name | Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g., 9876543210"
                />
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Row 3: Company | Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Your company's name"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="e.g., Technology, Manufacturing"
                />
              </div>
            </div>

            {/* Row 4: Consumption */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <div>
                <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">Monthly Consumption</label>
                <select
                  name="consumption"
                  id="consumption"
                  value={formData.consumption}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Select Consumption</option>
                  <option value="50-100KL">50-100KL</option>
                  <option value="100-200KL">100-200KL</option>
                  <option value="200-300KL">200-300KL</option>
                  <option value="300-400KL">300-400KL</option>
                </select>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;