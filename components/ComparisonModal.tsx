import React from 'react';
import { TRIM_OPTIONS } from '../constants';
import type { TrimOption } from '../types';

interface ComparisonModalProps {
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  if (amount === 0) return 'Standard';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose }) => {
  const modelsToCompare = TRIM_OPTIONS;

  // Dynamically get all unique spec labels from all models
  const allSpecLabels = [...new Set(modelsToCompare.flatMap(trim => trim.specs.map(spec => spec.label)))];

  const features = [
    { label: 'Price', getValue: (trim: TrimOption) => formatCurrency(trim.price) },
    { label: 'Drive', getValue: (trim: TrimOption) => trim.drive },
    ...allSpecLabels.map(label => ({
      label: label,
      getValue: (trim: TrimOption) => trim.specs.find(s => s.label === label)?.value || '-'
    }))
  ];
  
  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">Compare Models</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-2 font-semibold text-gray-800 border-b-2 border-gray-200 align-middle">Feature</th>
                {modelsToCompare.map(trim => (
                  <th key={trim.id} className="py-4 px-2 font-semibold text-gray-800 text-center border-b-2 border-gray-200 align-middle">
                    {trim.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map(feature => (
                <tr key={feature.label}>
                  <td className="py-4 px-2 text-sm text-gray-600 border-b border-gray-100 align-middle">{feature.label}</td>
                  {modelsToCompare.map(trim => (
                    <td key={trim.id} className="py-4 px-2 text-sm font-semibold text-gray-900 text-center border-b border-gray-100 align-middle">
                      {feature.getValue(trim)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ComparisonModal;
