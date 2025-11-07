import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { PaintOption, WheelOption, InteriorOption, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption } from '../types';
import { PAINT_OPTIONS, WHEEL_OPTIONS, INTERIOR_OPTIONS, TRIM_OPTIONS, ACCESSORY_OPTIONS, CHARGING_OPTIONS, ACCESSORY_PACK_OPTIONS } from '../constants';
import ConnectivityModal from './ConnectivityModal.tsx';
import FinancingModal from './FinancingModal.tsx';

interface ConfiguratorProps {
  selectedTrim: TrimOption;
  setSelectedTrim: (trim: TrimOption) => void;
  selectedPaint: PaintOption;
  setSelectedPaint: (paint: PaintOption) => void;
  selectedWheels: WheelOption;
  setSelectedWheels: (wheels: WheelOption) => void;
  selectedInterior: InteriorOption;
  setSelectedInterior: (interior: InteriorOption) => void;
  selectedAccessories: AccessoryOption[];
  onAccessoryToggle: (accessory: AccessoryOption) => void;
  selectedCharging: ChargingOption[];
  onChargingToggle: (charger: ChargingOption) => void;
  selectedPacks: AccessoryPackOption[];
  onPackToggle: (pack: AccessoryPackOption) => void;
  vehiclePrice: number;
  destinationFee: number;
  orderFee: number;
  finalPrice: number;
  setVisualizerView: (view: 'car' | 'wheels') => void;
}

const Configurator: React.FC<ConfiguratorProps> = ({
  selectedTrim,
  setSelectedTrim,
  selectedPaint,
  setSelectedPaint,
  selectedWheels,
  setSelectedWheels,
  selectedInterior,
  setSelectedInterior,
  selectedAccessories,
  onAccessoryToggle,
  selectedCharging,
  onChargingToggle,
  selectedPacks,
  onPackToggle,
  vehiclePrice,
  destinationFee,
  orderFee,
  finalPrice,
  setVisualizerView,
}) => {
  const [paymentMode, setPaymentMode] = useState<'cash' | 'finance'>('cash');
  const [showPriceDetails, setShowPriceDetails] = useState(true);
  const [isStickyFooterVisible, setIsStickyFooterVisible] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isConnectivityModalOpen, setIsConnectivityModalOpen] = useState(false);
  const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);
  const [selectedPackForModal, setSelectedPackForModal] = useState<AccessoryPackOption | null>(null);


  const priceDetailsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wheelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const stickyFooterObserver = new IntersectionObserver(
      ([entry]) => {
        // Hide sticky footer when price breakdown section is in view
        setIsStickyFooterVisible(!entry.isIntersecting);
      },
      {
        root: scrollContainer,
        rootMargin: '0px',
        threshold: 0.1, 
      }
    );

    const priceRef = priceDetailsRef.current;
    if (priceRef) {
      stickyFooterObserver.observe(priceRef);
    }

    return () => {
      if (priceRef) {
        stickyFooterObserver.unobserve(priceRef);
      }
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisualizerView('wheels');
        } else {
          setVisualizerView('car');
        }
      },
      {
        root: scrollContainer,
        threshold: 0,
      }
    );

    const wheelsElement = wheelsRef.current;
    if (wheelsElement) {
      observer.observe(wheelsElement);
    }

    return () => {
      if (wheelsElement) {
        observer.unobserve(wheelsElement);
      }
    };
  }, [setVisualizerView]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const financePayment = useMemo(() => {
    const loanAmount = finalPrice - 500000; // Assume ₹5 Lakh down payment
    const monthlyRate = 9 / 12 / 100; // 9% annual interest rate
    const tenureMonths = 60; // 5 years
    if (loanAmount <= 0) return 0;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
  }, [finalPrice]);

  const formatPrice = (price: number) => {
    return price === 0 ? 'Included' : `+${formatCurrency(price)}`;
  };
  
  const formatLineItemPrice = (price: number) => {
    return price === 0 ? 'Included' : formatCurrency(price);
  }

  const PaymentToggleButton: React.FC<{ mode: 'cash' | 'finance'; label: string }> = ({ mode, label }) => (
    <button
        onClick={() => setPaymentMode(mode)}
        className={`w-1/2 pb-2 text-sm font-bold transition-all duration-200 focus:outline-none ${paymentMode === mode ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-900 opacity-50 hover:opacity-100'}`}
    >
        {label}
    </button>
  );

  const PriceLineItem: React.FC<{ label: string; value: string | number; bold?: boolean }> = ({ label, value, bold = false }) => (
    <div className={`flex justify-between items-center text-sm ${bold ? 'font-semibold' : ''}`}>
      <p className="text-gray-600">{label}</p>
      <p className="text-gray-800">{typeof value === 'number' ? formatCurrency(value) : value}</p>
    </div>
  );
  
  const getFooterPrice = () => {
    switch (paymentMode) {
      case 'finance':
        return `${formatCurrency(financePayment)}/mo`;
      case 'cash':
      default:
        return formatCurrency(finalPrice);
    }
  }

  const getTrimDisplayPrice = (trim: TrimOption) => {
    switch (paymentMode) {
      case 'finance':
        return `${formatCurrency(trim.financePerMonth)}/mo`;
      case 'cash':
      default:
        return formatCurrency(trim.price);
    }
  }

  return (
    <div className="bg-white text-gray-800 h-full flex flex-col">
      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto">
        <div className="p-6 md:p-10">
          <h1 className="text-4xl sm:text-5xl font-semibold text-center text-gray-900">Model Y</h1>
          <div className="flex justify-around my-8 text-center">
            {selectedTrim.specs.map(spec => (
              <div key={spec.label}>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {spec.value}
                </p>
                <p className="text-xs text-gray-600 mt-1">{spec.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-around mb-6">
              <PaymentToggleButton mode="cash" label="Full Payment" />
              <PaymentToggleButton mode="finance" label="Auto Loan" />
          </div>
          
          <div className="space-y-4 mb-[45px]">
              {TRIM_OPTIONS.map(option => (
                  <button 
                      key={option.id}
                      onClick={() => setSelectedTrim(option)}
                      className={`relative overflow-hidden w-full p-4 border rounded-lg text-left transition-all duration-300 ${
                        selectedTrim.id === option.id 
                          ? 'border-blue-600 ring-2 ring-blue-600' 
                          : 'border-gray-300 hover:border-gray-500'
                      } ${
                        selectedTrim.id === option.id 
                          ? '' 
                          : option.id === 'p-awd' 
                            ? 'opacity-75' 
                            : 'opacity-70'
                      }`}
                  >
                      {option.id === 'p-awd' && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 font-semibold rounded-bl-lg">
                            Recommended
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                          <div>
                              <p className="font-semibold">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.drive}</p>
                          </div>
                          <p className="font-semibold text-lg">{getTrimDisplayPrice(option)}</p>
                      </div>
                  </button>
              ))}
          </div>

          <div className="space-y-[45px]">
            {/* Paint Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-center">Paint</h2>
              <p className="text-gray-500 mb-2 text-sm text-center">{selectedPaint.name} <span className="text-gray-800 font-medium">{formatPrice(selectedPaint.price)}</span></p>
              <div className="flex space-x-3 justify-center">
                {PAINT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedPaint(option)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${selectedPaint.id === option.id ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'}`}
                    aria-label={`Select ${option.name} paint`}
                  >
                    <div className={`w-full h-full rounded-full ${option.colorCode}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wheels Section */}
            <div ref={wheelsRef}>
              <h2 className="text-2xl font-semibold mb-2 text-center">Wheels</h2>
              <p className="text-gray-500 mb-2 text-sm text-center">{selectedWheels.name} <span className="text-gray-800 font-medium">{formatPrice(selectedWheels.price)}</span></p>
              <div className="flex space-x-4 justify-center">
                {WHEEL_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedWheels(option)}
                    className={`p-1 bg-gray-200 rounded-full border-2 transition-transform duration-200 hover:scale-105 ${selectedWheels.id === option.id ? 'border-blue-500' : 'border-transparent'}`}
                    aria-label={`Select ${option.name}`}
                  >
                    <img src={option.imageUrl} alt={option.name} className="w-16 h-16 rounded-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Interior Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-center">Interior</h2>
              <p className="text-gray-500 mb-2 text-sm text-center">{selectedInterior.name} <span className="text-gray-800 font-medium">{formatPrice(selectedInterior.price)}</span></p>
              <div className="flex space-x-3 justify-center">
                {INTERIOR_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedInterior(option)}
                    className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${selectedInterior.id === option.id ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'}`}
                    aria-label={`Select ${option.name} interior`}
                  >
                    <div className={`w-full h-full rounded-full ${option.id === 'black' ? 'bg-black' : 'bg-white border'}`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-center">Accessories</h2>
              <div className="space-y-2">
                {ACCESSORY_OPTIONS.map(option => (
                  <label 
                    key={option.id}
                    htmlFor={option.id}
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.id}
                        checked={selectedAccessories.some(a => a.id === option.id)}
                        onChange={() => onAccessoryToggle(option)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{formatCurrency(option.price)}</span>
                  </label>
                ))}
              </div>
            </div>

             {/* Charging Section */}
            <div>
                <h2 className="text-2xl font-semibold mb-2 text-center">Charging</h2>
                <p className="text-gray-500 mb-3 text-sm text-center">Every Tesla includes access to the largest global Supercharging network</p>
                <div className="space-y-2">
                    {CHARGING_OPTIONS.map(option => (
                        <label 
                            key={option.id}
                            htmlFor={option.id}
                            className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                        >
                            <input
                                type="checkbox"
                                id={option.id}
                                checked={selectedCharging.some(c => c.id === option.id)}
                                onChange={() => onChargingToggle(option)}
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 self-start mt-1"
                            />
                            <img 
                              src={option.imageUrl} 
                              alt={option.name} 
                              className="w-16 h-auto mx-3 object-contain" 
                            />
                            <div className="flex-grow">
                                <p className="text-sm font-semibold">{formatCurrency(option.price)}</p>
                                <p className="text-sm font-semibold text-gray-800">{option.name}</p>
                                <p className="text-xs text-gray-500">{option.description}</p>
                            </div>
                        </label>
                    ))}
                </div>

                {/* FSD Video card */}
                <button className="w-full border border-gray-300 rounded-lg flex items-center p-2 mt-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <div className="relative w-1/3 flex-shrink-0">
                        <img 
                            src="https://static-assets.tesla.com/configurator/compositor?context=design_studio_2&options=$MT367,$PN01,$W38C,$IBB4&view=STUD_SIDEVIEW&model=m3&size=1920&bkba_opt=2&crop=0,0,0,0&overlay=0&" 
                            alt="Full Self-Driving in action" 
                            className="rounded-md aspect-[16/9] object-cover" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-md">
                            <div className="bg-gray-300 bg-opacity-75 rounded-full p-3 backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">Watch a Video</p>
                        <p className="text-sm text-gray-600">See Full Self-Driving in Action</p>
                    </div>
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-3">Mobile Charger is included</p>
                <div className="text-center mt-4">
                    <button className="bg-gray-100 text-gray-800 text-sm font-semibold py-2 px-5 rounded-md hover:bg-gray-200 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Accessory Packs Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-center">Accessory Packs</h2>
              <div className="grid grid-cols-1 gap-4">
                {ACCESSORY_PACK_OPTIONS.map(option => (
                  <div
                    key={option.id}
                    className={`border rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors ${selectedPacks.some(p => p.id === option.id) ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
                    onClick={() => onPackToggle(option)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-semibold text-gray-800">{option.name}</p>
                      <div className="flex items-center space-x-3">
                        <button aria-label="More info" onClick={(e) => { e.stopPropagation(); setSelectedPackForModal(option); }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <input
                          type="checkbox"
                          checked={selectedPacks.some(p => p.id === option.id)}
                          readOnly
                          className="h-6 w-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500 pointer-events-none"
                        />
                      </div>
                    </div>
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      className="w-full h-auto object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* New Pricing Breakdown Section */}
            <div ref={priceDetailsRef} className="pt-4 space-y-3">
              <h2 className="text-2xl font-semibold text-center">Enter Delivery ZIP</h2>
              <input 
                type="text" 
                placeholder="Enter Delivery ZIP" 
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-center focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              {showPriceDetails && (
                <div className="space-y-2 pt-2">
                  <PriceLineItem label={`${selectedTrim.name} ${selectedTrim.drive}`} value={formatLineItemPrice(selectedTrim.price)} />
                  {selectedPaint.price > 0 && <PriceLineItem label={selectedPaint.name} value={formatLineItemPrice(selectedPaint.price)} />}
                  {selectedWheels.price > 0 && <PriceLineItem label={selectedWheels.name} value={formatLineItemPrice(selectedWheels.price)} />}
                  {selectedInterior.price > 0 && <PriceLineItem label={selectedInterior.name} value={formatLineItemPrice(selectedInterior.price)} />}
                  {selectedPacks.map(pack => <PriceLineItem key={pack.id} label={pack.name} value={formatLineItemPrice(pack.price)} />)}
                  {selectedAccessories.map(acc => <PriceLineItem key={acc.id} label={acc.name} value={formatLineItemPrice(acc.price)} />)}
                  {selectedCharging.map(charger => <PriceLineItem key={charger.id} label={charger.name} value={formatLineItemPrice(charger.price)} />)}

                  <PriceLineItem label="Five Seat Interior" value="Included" />
                  <PriceLineItem label="Autopilot" value="Included" />
                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => setIsConnectivityModalOpen(true)}
                      className="text-gray-600 underline decoration-gray-900 hover:decoration-current cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      30-Day Premium Connectivity Trial
                    </button>
                    <p className="text-gray-800">Included</p>
                  </div>
                  <PriceLineItem label="30-Day Full Self-Driving (Supervised) Trial" value="Included" />
                  <hr className="my-2"/>
                  <PriceLineItem label="Vehicle Price" value={vehiclePrice} bold />
                  <PriceLineItem label="Destination Fee" value={destinationFee} />
                  <PriceLineItem label="Order Fee" value={orderFee} />
                  <hr className="my-2"/>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <p>Est. Purchase Price</p>
                    <p>{formatCurrency(finalPrice)}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-3">
                    <button
                      onClick={() => setSelectedPaymentMethod('card')}
                      className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors duration-300 ${
                        selectedPaymentMethod === 'card'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Pay with Card
                    </button>
                    <button
                      onClick={() => setSelectedPaymentMethod('upi')}
                      className={`flex-1 font-bold py-3 px-4 rounded-lg transition-colors duration-300 ${
                        selectedPaymentMethod === 'upi'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Pay with UPI
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center pt-1"
              >
                {showPriceDetails ? 'Hide' : 'Show'} Pricing Details
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${showPriceDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Footer */}
      {isStickyFooterVisible && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold">{getFooterPrice()}</p>
                <button onClick={() => setIsFinancingModalOpen(true)} aria-label="Show financing details">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 -mt-1">Vehicle Price</p>
            </div>
            <button 
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Order Now
            </button>
          </div>
        </div>
      )}

      {isConnectivityModalOpen && <ConnectivityModal onClose={() => setIsConnectivityModalOpen(false)} />}
      {isFinancingModalOpen && (
        <FinancingModal 
          onClose={() => setIsFinancingModalOpen(false)} 
          paint={selectedPaint}
          wheels={selectedWheels}
        />
      )}
      {selectedPackForModal && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setSelectedPackForModal(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedPackForModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex flex-col items-center">
                <h2 className="text-3xl font-semibold mb-4 text-gray-900">{selectedPackForModal.name}</h2>
                <img
                    src={selectedPackForModal.imageUrl}
                    alt={selectedPackForModal.name}
                    className="w-full h-auto object-contain rounded mb-6 max-h-64"
                />
                <p className="text-gray-600 leading-relaxed text-left w-full">{selectedPackForModal.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configurator;