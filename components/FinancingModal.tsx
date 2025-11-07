import React, { useState, useMemo } from 'react';
import type { PaintOption, WheelOption } from '../types';

// Re-use the currency formatter
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Line item component for the breakdown
const BreakdownItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
    </div>
);


const FinancingModal: React.FC<{
  onClose: () => void;
  paint: PaintOption;
  wheels: WheelOption;
}> = ({ onClose, paint, wheels }) => {
  const [activeTab, setActiveTab] = useState<'full' | 'loan'>('full');
  const imageUrl = 'https://i.postimg.cc/X7yYY8Tr/rps.jpg';
  const fallbackUrl = 'https://i.postimg.cc/zfkB1G46/rps2.jpg';

  // These values are hardcoded to precisely match the design in the user's image.
  const breakdown = {
      gst: 321389,
      tcs: 65890,
      adminFee: 50000,
      fastag: 800,
      roadTax: 258,
      fuelSavings: -343500
  };
  const onRoadPrice = 6705948; 

  // State for loan calculation
  const [loanTerm, setLoanTerm] = useState(60); // Default 60 months (5 years)
  const [downPayment, setDownPayment] = useState(onRoadPrice * 0.2); // Default 20% down
  const INTEREST_RATE = 9; // 9% annual interest rate

  const minDownPayment = onRoadPrice * 0.1; // 10%
  const maxDownPayment = onRoadPrice * 0.8; // 80%

  const loanAmount = useMemo(() => onRoadPrice - downPayment, [onRoadPrice, downPayment]);

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const monthlyRate = INTEREST_RATE / 12 / 100;
    const tenureMonths = loanTerm;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
  }, [loanAmount, loanTerm]);


  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side: Image */}
        <div className="w-full lg:w-1/2 h-1/3 lg:h-full bg-stone-50 flex items-center justify-center p-8">
            <img 
              src={imageUrl} 
              alt="Vehicle" 
              className="object-contain max-h-full max-w-full" 
              onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
            />
        </div>

        {/* Right side: Details */}
        <div className="w-full lg:w-1/2 h-2/3 lg:h-full p-10 flex flex-col relative overflow-y-auto">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 z-10" aria-label="Close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-3xl font-semibold mb-4">Financing Options</h2>
            <p className="text-sm text-gray-600">
                Registration in <span className="underline font-medium text-gray-800">Maharashtra</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
                Your On-Road Price is calculated based on selected state
            </p>
            
            <div className="flex border-b my-6">
                <button 
                  onClick={() => setActiveTab('full')}
                  className={`flex-1 text-center py-2 text-sm font-bold transition-colors ${activeTab === 'full' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Full Payment
                </button>
                <button 
                  onClick={() => setActiveTab('loan')}
                  className={`flex-1 text-center py-2 text-sm font-bold transition-colors ${activeTab === 'loan' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Auto Loan
                </button>
            </div>
            
            {/* Conditional Content */}
            {activeTab === 'full' ? (
              <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                      <p className="text-4xl font-semibold text-gray-900">{formatCurrency(onRoadPrice)}</p>
                      <span className="text-gray-600 font-medium">On-Road Price</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                      <div className="flex items-center">
                          <input type="checkbox" id="fuel-savings" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label htmlFor="fuel-savings" className="ml-3 text-sm text-gray-700">
                              Include Est. Fuel Savings
                              <span className="block text-xs text-blue-600 underline cursor-pointer">Customise</span>
                          </label>
                      </div>
                      <p className="font-semibold">{formatCurrency(breakdown.fuelSavings)}</p>
                  </div>

                  <div className="pt-4 space-y-2">
                      <p className="font-semibold text-gray-800 mb-2">Includes</p>
                      <BreakdownItem label="GST" value={formatCurrency(breakdown.gst)} />
                      <BreakdownItem label="TCS 1%" value={formatCurrency(breakdown.tcs)} />
                      <BreakdownItem label="Administration and Service Fee" value={formatCurrency(breakdown.adminFee)} />
                      <BreakdownItem label="Fastag" value={formatCurrency(breakdown.fastag)} />
                      <BreakdownItem label="Estimated Road Tax and Charges" value={formatCurrency(breakdown.roadTax)} />
                  </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                    <p className="text-gray-600 text-sm">Monthly Payment</p>
                    <p className="text-4xl font-semibold text-gray-900">{formatCurrency(monthlyPayment)}<span className="text-lg">/mo</span></p>
                    <p className="text-xs text-gray-500">for {loanTerm} months at {INTEREST_RATE}% APR</p>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Loan Term</label>
                    </div>
                     <div className="grid grid-cols-4 gap-2">
                        {[36, 48, 60, 72].map(term => (
                            <button
                                key={term}
                                onClick={() => setLoanTerm(term)}
                                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${loanTerm === term ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {term} mo
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="down-payment" className="text-sm font-medium">Down Payment</label>
                        <span className="text-sm font-semibold">{formatCurrency(downPayment)}</span>
                    </div>
                    <input
                        type="range"
                        id="down-payment"
                        min={minDownPayment}
                        max={maxDownPayment}
                        step={10000}
                        value={downPayment}
                        onChange={(e) => setDownPayment(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                <BreakdownItem label="On-Road Price" value={formatCurrency(onRoadPrice)} />
              </div>
            )}


            <div className="mt-auto pt-6 text-xs text-gray-500">
                <p>*On-road fees are subject to change without notice. Your final drive away price may vary due to your individual circumstances.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
export default FinancingModal;