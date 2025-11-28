
import React, { useState } from 'react';
import { CONSUMPTION_OPTIONS } from '../constants';
import type { CustomerDetails } from '../types';
import { submitLead } from '../services/api';

interface LeadFormModalProps {
  onSubmit: (data?: CustomerDetails) => void;
}

const INDUSTRY_OPTIONS = [
  'Mining',
  'Logistics',
  'Infra & Construction',
  'Manufacturing',
  'Others'
];

const STATE_OPTIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 
  'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

const SALESPERSON_OPTIONS = [
  'Ketan',
  'Abhishek',
  'Aditya',
  'Ajay'
];

const LeadFormModal: React.FC<LeadFormModalProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CustomerDetails>({
    name: '',
    mobile: '',
    email: '',
    company: '',
    industry: '',
    state: '',
    consumption: '',
    salesperson: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing in mobile field
    if (name === 'mobile') {
      setError(null);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // Mobile Validation: Exactly 10 digits
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Call backend API service
      await submitLead(formData);
      // On success, pass data up to parent
      onSubmit(formData);
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[10px] flex items-center justify-center z-[100] p-4 animate-fade-in"
    >
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-[772px] relative p-6 md:p-12 overflow-y-auto max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button enabled for testing purposes */}
        <button 
          onClick={() => onSubmit()} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 disabled:opacity-50 z-10" 
          aria-label="Close"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-left text-gray-900">Partner with Repos</h2>
        <p className="text-sm text-gray-600 mb-6 text-left">
          Please provide your details to initiate your journey with Repos. This information helps us tailor the perfect Fuel Distribution Solution for your business needs.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            {/* Row 1: Name | Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition"
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
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className={`w-full px-4 py-2 bg-gray-100 border rounded-md focus:ring-1 outline-none transition ${error && error.includes('Mobile') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-400'}`}
                  placeholder="e.g., 9876543210"
                />
              </div>
            </div>

            {/* Row 2: Email | Salesperson */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700 mb-1">Salesperson</label>
                <select
                  name="salesperson"
                  id="salesperson"
                  value={formData.salesperson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Select Salesperson</option>
                  {SALESPERSON_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Company | Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition"
                  placeholder="Your company's name"
                />
              </div>
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  name="industry"
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Select Industry</option>
                  {INDUSTRY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: State | Consumption */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6">
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / UT</label>
                <select
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Select State</option>
                  {STATE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 mb-1">Monthly Consumption</label>
                <select
                  name="consumption"
                  id="consumption"
                  value={formData.consumption}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 outline-none transition appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Select Consumption</option>
                  {CONSUMPTION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 hover:scale-105 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
