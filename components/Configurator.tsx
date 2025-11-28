
import React, { useState, useRef, useEffect } from 'react';
import type { AccessoryOption, IotOption, TankOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails, LicenseOption } from '../types';
import { CONSUMPTION_OPTIONS, TANK_OPTIONS, REPOS_OS_OPTIONS, DISPENSING_UNIT_OPTIONS, MECHANICAL_INCLUSION_OPTIONS, SAFETY_UPGRADE_OPTIONS, LICENSE_OPTIONS, DECANTATION_OPTIONS, SAFETY_UNIT_OPTIONS } from '../constants';
import { getSafetyImage } from '../utils/vehicleHelpers';

interface ConfiguratorProps {
  customerDetails: CustomerDetails | null;
  paymentMode: 'outright' | 'installments';
  setPaymentMode: (mode: 'outright' | 'installments') => void;
  selectedTank: TankOption['id'];
  setSelectedTank: (tankId: TankOption['id']) => void;
  selectedReposOsOptions: AccessoryOption[];
  onReposOsToggle: (option: AccessoryOption) => void;
  selectedMechanicalInclusionOptions: AccessoryOption[];
  onMechanicalInclusionToggle: (option: AccessoryOption) => void;
  selectedDecantation: IotOption | null;
  setSelectedDecantation: (option: IotOption) => void;
  
  // Updated to Array for Multi-Select
  selectedDispensingUnits: DispensingUnitOption[];
  onDispensingUnitToggle: (option: DispensingUnitOption) => void;
  
  selectedSafetyUnits: AccessoryOption[];
  onSafetyUnitToggle: (option: AccessoryOption) => void;
  selectedSafetyUpgrades: SafetyUpgradeOption[];
  onSafetyUpgradeToggle: (option: SafetyUpgradeOption) => void;
  selectedLicenseOptions: LicenseOption[];
  selectedConsumption: string | null;
  onConsumptionSelect: (consumption: string) => void;
  
  totalContractValue: number; 
  gstAmount: number;
  finalPrice: number; 
  
  recommendedTankId: TankOption['id'] | null;
  showPrices: boolean;
  onResetConfiguration?: () => void;
  
  // Handlers for opening modals
  onOpenComparison: () => void;
  onOpenQuote: () => void;
}

const ChevronUp: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDown: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const Configurator: React.FC<ConfiguratorProps> = ({
  customerDetails,
  paymentMode,
  setPaymentMode,
  selectedTank,
  setSelectedTank,
  selectedReposOsOptions,
  onReposOsToggle,
  selectedMechanicalInclusionOptions,
  onMechanicalInclusionToggle,
  selectedDecantation,
  setSelectedDecantation,
  selectedDispensingUnits,
  onDispensingUnitToggle,
  selectedSafetyUnits,
  onSafetyUnitToggle,
  selectedSafetyUpgrades,
  onSafetyUpgradeToggle,
  selectedLicenseOptions,
  selectedConsumption,
  onConsumptionSelect,
  
  totalContractValue,
  gstAmount,
  finalPrice,
  
  recommendedTankId,
  showPrices,
  onResetConfiguration,
  
  onOpenComparison,
  onOpenQuote
}) => {
  const [selectedAction, setSelectedAction] = useState<'quote' | 'contact'>('contact');
  const [learnMoreOption, setLearnMoreOption] = useState<SafetyUpgradeOption | IotOption | null>(null);

  const [isStickyFooterVisible, setIsStickyFooterVisible] = useState(true);
  const [isPricingDetailsOpen, setIsPricingDetailsOpen] = useState(true);
  const [showIncludedOptions, setShowIncludedOptions] = useState(false);
  
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPrices) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyFooterVisible(!entry.isIntersecting);
      },
      { root: null, threshold: 0.1, rootMargin: "0px" }
    );

    const currentRef = pricingSectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.disconnect();
    };
  }, [showPrices]);

  const formatCurrency = (amount: number) => {
    if (!showPrices) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (monthlyPrice: number) => {
    if (!showPrices) return '';
    if (paymentMode === 'outright') {
        const fullPrice = monthlyPrice * 36;
        return fullPrice === 0 ? formatCurrency(0) : `+${formatCurrency(fullPrice)}`;
    }
    return monthlyPrice === 0 ? formatCurrency(0) : `+${formatCurrency(monthlyPrice)}`;
  };
  
  const currentTank = TANK_OPTIONS.find(t => t.id === selectedTank);

  const handleViewQuoteClick = () => {
    setSelectedAction('quote');
    onOpenQuote();
  };

  const tankBasePrice = currentTank ? currentTank.price : 0;

  // DETERMINE MULTIPLIER BASED ON PAYMENT MODE
  const multiplier = paymentMode === 'outright' ? 36 : 1;

  let pricingItems = [
    { name: `RPS Base Price (${currentTank?.name || ''} Tank)`, price: tankBasePrice * multiplier },
    // Map all selected DUs
    ...selectedDispensingUnits.map(du => ({ name: du.name, price: du.price * multiplier })),
    ...selectedReposOsOptions.map(opt => ({ name: opt.name, price: opt.price * multiplier })),
    ...(selectedDecantation ? [{ name: selectedDecantation.name, price: selectedDecantation.price * multiplier }] : []),
    ...selectedMechanicalInclusionOptions.map(opt => ({ name: opt.name, price: opt.price * multiplier })),
    ...selectedSafetyUnits.map(opt => ({ name: opt.name, price: opt.price * multiplier })),
    ...selectedSafetyUpgrades.map(opt => ({ name: opt.name, price: opt.price * multiplier })),
  ];

  // Hide Tank Base Price row from the list if desired
  pricingItems = pricingItems.filter(item => !item.name.includes('RPS Base Price'));

  const paidItems = pricingItems.filter(item => item.price > 0);
  const includedItems = pricingItems.filter(item => item.price === 0);

  const displayedPriceLabel = paymentMode === 'outright' ? 'Total RPS Price (Inc. GST)' : 'Monthly Payment (36 mo)';
  const footerPrice = paymentMode === 'outright' ? totalContractValue : finalPrice;
  
  const subtotalDisplay = paymentMode === 'outright' ? totalContractValue : finalPrice;
  const subtotalLabel = paymentMode === 'outright' ? 'Subtotal (Excl. GST)' : 'Total Monthly Payment';

  return (
    <div className="bg-white text-gray-800 lg:h-full h-auto flex flex-col relative lg:overflow-hidden">
      <div className="flex-grow lg:overflow-y-auto overflow-visible scroll-smooth pb-24">
        <div className="pb-6 md:pb-10">
          
          {/* Sticky Header Section with Clear Button */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 md:px-10 mb-6 flex justify-between items-center shadow-sm">
             <h1 className="text-xl md:text-2xl font-medium text-[#171A20]">Repos Portable Station</h1>
             {onResetConfiguration && (
               <button 
                 onClick={onResetConfiguration}
                 className="flex-shrink-0 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors uppercase tracking-wide shadow-sm"
               >
                 Clear All
               </button>
             )}
          </div>

          <div className="px-6 md:px-10">
            <div className="flex justify-around my-8 text-center">
              {[
                { label: 'Speed', value: '120L/m' },
                { label: 'Tracking', value: '100%' },
                { label: 'Monitoring', value: '24/7' },
              ].map(spec => (
                <div key={spec.label}>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">{spec.value}</p>
                  <p className="text-xs sm:text-[14px] leading-[20px] text-[#393C41] mt-1">{spec.label}</p>
                </div>
              ))}
            </div>
            
            {/* 1. Consumption */}
            <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Consumption</h2>
              <div className="space-y-4">
                {CONSUMPTION_OPTIONS.map(option => (
                  <button 
                      key={option}
                      onClick={() => onConsumptionSelect(option)}
                      className={`group relative w-full p-4 border rounded-lg text-left transition-all duration-300 ${
                        selectedConsumption === option 
                          ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' 
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                  >
                      <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">Consumption</p>
                            <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">Monthly</p>
                          </div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option}</p>
                      </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. RPS Capacity */}
            <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">RPS Capacity</h2>
              <div className="space-y-4">
                {TANK_OPTIONS.map(option => (
                    <button 
                        key={option.id}
                        onClick={() => setSelectedTank(option.id)}
                        className={`group relative w-full p-4 border rounded-lg text-left transition-all duration-300 ${
                          selectedTank === option.id 
                            ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' 
                            : 'border-gray-300 hover:border-gray-500'
                        }`}
                    >
                        {recommendedTankId === option.id && (
                            <div className="absolute top-0 right-0 text-white text-xs font-semibold z-10">
                                <div className="relative bg-blue-600 px-2.5 py-0.5 rounded-tr-lg shadow">Recommended</div>
                                <div className="absolute top-full left-0 w-0 h-0" style={{ borderStyle: 'solid', borderWidth: '0 6px 6px 0', borderColor: 'transparent #1d4ed8 transparent transparent' }} />
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                              {option.dimensions && <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">{option.dimensions}</p>}
                            </div>
                        </div>
                        {selectedTank && selectedTank !== option.id && (
                            <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                        )}
                    </button>
                ))}
              </div>
            </div>

            {/* Compare Features Button */}
            <div className="mb-[45px]">
                <button
                    onClick={onOpenComparison}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
                >
                    <span className="font-semibold text-gray-800">View & Compare Features</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* 3. Mechanical Inclusion */}
            <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Mechanical Inclusions</h2>
              <div className="space-y-2">
                {MECHANICAL_INCLUSION_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => onMechanicalInclusionToggle(option)}
                    className={`w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedMechanicalInclusionOptions.some(o => o.id === option.id) ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                      selectedMechanicalInclusionOptions.some(o => o.id === option.id) ? 'bg-gray-600 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      {selectedMechanicalInclusionOptions.some(o => o.id === option.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{showPrices ? formatPrice(option.price) : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. RFID Enabled Dispensing Unit */}
            <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">RFID Enabled Dispensing Unit</h2>
              <div className="space-y-2">
                {DISPENSING_UNIT_OPTIONS.map(option => (
                  <button
                    key={`dispensing-unit-${option.id}`}
                    onClick={() => onDispensingUnitToggle(option)}
                    className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedDispensingUnits.some(du => du.id === option.id)
                        ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {/* Tickbox - Square Checkbox Style - Unified Color */}
                    <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                      selectedDispensingUnits.some(du => du.id === option.id)
                        ? 'bg-gray-600 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {selectedDispensingUnits.some(du => du.id === option.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                          <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">{option.subtext}</p>
                        </div>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">
                          {showPrices ? formatPrice(option.price) : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Repos OS */}
            <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Repos OS</h2>
              <div className="space-y-2">
                {REPOS_OS_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => onReposOsToggle(option)}
                    className={`w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedReposOsOptions.some(o => o.id === option.id)
                        ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                      selectedReposOsOptions.some(o => o.id === option.id) ? 'bg-gray-600 border-gray-600' : 'bg-white border-gray-300'
                    }`}>
                      {selectedReposOsOptions.some(o => o.id === option.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{showPrices ? formatPrice(option.price) : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Sensors and Controller Unit */}
            <div className="mb-[45px]">
                <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Sensors and Controller Unit</h2>
                <div className="space-y-2">
                  {SAFETY_UNIT_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => onSafetyUnitToggle(option)}
                      className={`w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                        selectedSafetyUnits.some(o => o.id === option.id) ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                        selectedSafetyUnits.some(o => o.id === option.id) ? 'bg-gray-600 border-gray-600' : 'bg-white border-gray-300'
                      }`}>
                        {selectedSafetyUnits.some(o => o.id === option.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow flex justify-between items-center">
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{showPrices ? formatPrice(option.price) : ''}</p>
                      </div>
                    </button>
                  ))}
                </div>
            </div>

             {/* 7. Decantation Unit */}
             <div className="mb-[45px]">
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Decantation Unit</h2>
              <div className="space-y-2">
                {DECANTATION_OPTIONS.map(option => (
                  <div key={`decantation-${option.id}`} className="flex flex-col">
                    <button
                      onClick={() => setSelectedDecantation(option)}
                      className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                        selectedDecantation?.id === option.id
                          ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                            <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">{option.subtext}</p>
                          </div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">
                            {showPrices ? formatPrice(option.price) : ''}
                          </p>
                        </div>
                      </div>
                      {selectedDecantation?.id !== option.id && (
                          <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                      )}
                    </button>
                    
                    {option.id === 'advanced-skid' && (
                      <div className="flex justify-end mt-2 mr-1">
                         <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLearnMoreOption(option);
                          }}
                          className="text-xs font-medium text-gray-500 hover:text-blue-600 underline transition-colors"
                        >
                          What is a Flow Meter?
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Safety Upgrades */}
            <div className="mb-[45px]">
                <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Safety Upgrades</h2>
                <div className="space-y-6">
                  {SAFETY_UPGRADE_OPTIONS.map(option => (
                    <div key={option.id} className="flex flex-col">
                      <div
                        onClick={() => onSafetyUpgradeToggle(option)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                          selectedSafetyUpgrades.some(o => o.id === option.id) ? 'border-gray-400 ring-1 ring-gray-400' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                              selectedSafetyUpgrades.some(o => o.id === option.id) ? 'bg-gray-600 border-gray-600' : 'bg-white border-gray-300'
                            }`}>
                              {selectedSafetyUpgrades.some(o => o.id === option.id) && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{option.name}</span>
                          </div>
                          <span className="font-medium text-gray-900">{showPrices ? formatPrice(option.price) : ''}</span>
                        </div>
                        
                        <div className="w-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                          <img 
                            src={getSafetyImage(selectedTank, option.id)} 
                            alt={option.name} 
                            className="max-h-[150px] w-auto object-contain mix-blend-multiply"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center mt-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setLearnMoreOption(option);
                          }}
                          className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
              
            {/* 9. Licenses and Compliance Section */}
            <div className="mb-[45px]">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-8">Licenses and Compliance</h2>
              <div className="space-y-3 mt-6">
                {LICENSE_OPTIONS.map(option => (
                  <div key={`license-${option.id}`} className="w-full flex items-center p-4 border border-gray-300 rounded-lg text-left bg-gray-50">
                    <div className="flex-grow flex justify-between items-center">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      {option.subtext && <span className="text-sm text-gray-500 font-medium">{option.subtext}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown & Actions */}
            {showPrices ? (
              <div ref={pricingSectionRef} className="pt-8 border-t border-gray-200">
                <div 
                  className="flex justify-between items-center mb-6 cursor-pointer group select-none"
                  onClick={() => setIsPricingDetailsOpen(!isPricingDetailsOpen)}
                >
                  <h2 className="text-xl font-medium text-gray-900">Pricing Details</h2>
                  <div className="flex items-center gap-4">
                      {/* Small Circular Toggle for Payment Mode */}
                      <div className="flex items-center gap-2 text-sm">
                          <span className={`${paymentMode === 'installments' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
                          <button 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setPaymentMode(paymentMode === 'installments' ? 'outright' : 'installments');
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${paymentMode === 'outright' ? 'bg-blue-600' : 'bg-gray-300'}`}
                          >
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${paymentMode === 'outright' ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                          <span className={`${paymentMode === 'outright' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Full Price</span>
                      </div>
                      
                      <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                        {isPricingDetailsOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isPricingDetailsOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-3 text-sm text-gray-600 mb-8">
                      
                      {/* Show Breakdown for BOTH modes. Multiplier handles price logic. */}
                      {paidItems.map((item, idx) => (
                        <div key={`paid-${idx}`} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </div>
                      ))}
                      
                      <div className="border-t border-gray-200 my-3 pt-3">
                          <div className="flex justify-between font-semibold text-gray-800">
                              <span>{subtotalLabel}</span>
                              <span>{formatCurrency(subtotalDisplay)}</span>
                          </div>
                          
                          {paymentMode === 'outright' && (
                            <div className="flex justify-between text-gray-600 mt-1">
                                <span>GST (18%)</span>
                                <span>{formatCurrency(gstAmount)}</span>
                            </div>
                          )}

                          {paymentMode === 'installments' && (
                             <>
                               <div className="flex justify-between text-blue-600 font-medium mt-2 text-sm">
                                  <span>Down Payment (GST Amount)</span>
                                  <span>{formatCurrency(gstAmount)}</span>
                               </div>
                               <div className="flex justify-between text-gray-600 mt-1 text-sm">
                                  <span>Tenure</span>
                                  <span>36 Months</span>
                               </div>
                               <div className="mt-2 text-xs text-gray-500 italic text-right">
                                  Subject to approval from Partnered Bank
                               </div>
                             </>
                          )}
                      </div>

                      {/* Show included items toggle (For both modes as they are relevant) */}
                      {includedItems.length > 0 && (
                        <div className="mt-4 border-t border-gray-100 pt-2">
                           <button 
                            onClick={() => setShowIncludedOptions(!showIncludedOptions)}
                            className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-800 mb-2"
                           >
                             {showIncludedOptions ? 'Hide included features' : 'Show included features'}
                             <span className="ml-1">
                              {showIncludedOptions ? <ChevronUp /> : <ChevronDown />}
                             </span>
                           </button>
                           
                           <div className={`space-y-2 pl-2 transition-all duration-300 overflow-hidden ${showIncludedOptions ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                             {includedItems.map((item, idx) => (
                               <div key={`inc-${idx}`} className="flex justify-between text-gray-500">
                                 <span>{item.name}</span>
                                 <span>Included</span>
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-8">
                     <span className="text-lg font-semibold text-gray-900">{displayedPriceLabel}</span>
                     <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(finalPrice)}</span>
                        {paymentMode === 'outright' && (
                            <p className="text-xs text-gray-500 font-normal">Inclusive of GST</p>
                        )}
                     </div>
                </div>

                <div className="flex gap-4 flex-col sm:flex-row">
                     <button
                       onClick={() => setSelectedAction('contact')}
                       className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-colors ${selectedAction === 'contact' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      Contact Sales
                    </button>
                     <button
                       onClick={handleViewQuoteClick}
                       className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-colors ${selectedAction === 'quote' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                      View Quote
                    </button>
                </div>
              </div>
            ) : (
              <div className="pt-8 border-t border-gray-200 mb-8">
                  <div className="flex gap-4 flex-col sm:flex-row">
                     <button
                       className="w-full py-3 px-4 rounded text-sm font-semibold bg-blue-600 text-white transition-colors hover:bg-blue-700"
                       onClick={() => {
                         alert("Thank you for your interest. Our sales team will contact you shortly.");
                       }}
                    >
                      Contact Sales
                    </button>
                  </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {showPrices && (
        <div className={`fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-4 z-20 w-full pointer-events-none transition-transform duration-300 ease-in-out ${isStickyFooterVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}>
          <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 pointer-events-auto">
             <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{formatCurrency(footerPrice)}</p>
                  {paymentMode === 'installments' && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Per Month</p>
                  )}
                </div>
                <button
                  onClick={handleViewQuoteClick}
                  className="bg-blue-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  View Quote
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Learn More Modal for Safety Upgrades */}
      {learnMoreOption && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setLearnMoreOption(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-lg relative p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setLearnMoreOption(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">{learnMoreOption.name}</h3>
            
            {(learnMoreOption as any).imageUrl ? (
               <div className="flex justify-center mb-6">
                <img 
                  src={(learnMoreOption as SafetyUpgradeOption).id.includes('fire') || (learnMoreOption as SafetyUpgradeOption).id.includes('crash') 
                      ? getSafetyImage(selectedTank, (learnMoreOption as SafetyUpgradeOption).id) 
                      : (learnMoreOption as any).imageUrl}
                  alt={learnMoreOption.name} 
                  className="max-h-64 object-contain"
                />
              </div>
            ) : null}
           
            <p className="text-gray-600 text-center leading-relaxed">
              {(learnMoreOption as any).description || 'No description available.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configurator;
