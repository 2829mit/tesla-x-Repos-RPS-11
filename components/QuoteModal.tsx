import React, { useState, useEffect } from 'react';
import type { CustomerDetails } from '../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mobile: string, email: string) => void;
  initialDetails: CustomerDetails | null;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, onSubmit, initialDetails }) => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && initialDetails) {
      setMobile(initialDetails.mobile || '');
      setEmail(initialDetails.email || '');
    }
  }, [isOpen, initialDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !email) {
      setError('Please fill in both fields.');
      return;
    }
    onSubmit(mobile, email);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Get Your Quote</h3>
        <p className="text-sm text-gray-600 mb-6">Please provide your details to receive the quote and brochure.</p>
        
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input 
              type="tel" 
              value={mobile} 
              onChange={e => {
                setMobile(e.target.value);
                setError('');
              }}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter mobile number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Enter email address"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Quote
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuoteModal;