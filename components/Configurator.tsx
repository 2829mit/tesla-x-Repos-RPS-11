
import React, { useState, useRef, useEffect } from 'react';
import type { TrimOption, AccessoryOption, IotOption, TankOption, WarrantyOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails, LicenseOption } from '../types';
import { TRIM_OPTIONS, DECANTATION_OPTIONS, SAFETY_UNIT_OPTIONS, CONSUMPTION_OPTIONS, TANK_OPTIONS, WARRANTY_OPTIONS, REPOS_OS_OPTIONS, DISPENSING_UNIT_OPTIONS, FUEL_LEVEL_TECHNOLOGY_OPTIONS, MECHANICAL_INCLUSION_OPTIONS, SAFETY_UPGRADE_OPTIONS, LICENSE_OPTIONS, BASE_PRICE } from '../constants';
import ComparisonModal from './ComparisonModal.tsx';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { logQuoteGeneration, QuoteData } from '../services/api';

interface ConfiguratorProps {
  customerDetails: CustomerDetails | null;
  selectedTrim: TrimOption;
  setSelectedTrim: (trim: TrimOption) => void;
  selectedTank: TankOption['id'];
  setSelectedTank: (tankId: TankOption['id']) => void;
  selectedFuelLevelTechnology: AccessoryOption;
  setSelectedFuelLevelTechnology: (option: AccessoryOption) => void;
  selectedReposOsOptions: AccessoryOption[];
  onReposOsToggle: (option: AccessoryOption) => void;
  selectedMechanicalInclusionOptions: AccessoryOption[];
  onMechanicalInclusionToggle: (option: AccessoryOption) => void;
  selectedDecantation: IotOption;
  setSelectedDecantation: (option: IotOption) => void;
  selectedDispensingUnit: DispensingUnitOption;
  setSelectedDispensingUnit: (option: DispensingUnitOption) => void;
  selectedSafetyUnits: AccessoryOption[];
  onSafetyUnitToggle: (option: AccessoryOption) => void;
  selectedSafetyUpgrades: SafetyUpgradeOption[];
  onSafetyUpgradeToggle: (option: SafetyUpgradeOption) => void;
  selectedLicenseOptions: LicenseOption[];
  onLicenseOptionToggle: (option: LicenseOption) => void;
  selectedWarrantyOption: WarrantyOption;
  setSelectedWarrantyOption: (option: WarrantyOption) => void;
  selectedConsumption: string | null;
  onConsumptionSelect: (consumption: string) => void;
  vehiclePrice: number;
  finalPrice: number;
  recommendedTankId: TankOption['id'] | null;
}

const Configurator: React.FC<ConfiguratorProps> = ({
  customerDetails,
  selectedTrim,
  setSelectedTrim,
  selectedTank,
  setSelectedTank,
  selectedFuelLevelTechnology,
  setSelectedFuelLevelTechnology,
  selectedReposOsOptions,
  onReposOsToggle,
  selectedMechanicalInclusionOptions,
  onMechanicalInclusionToggle,
  selectedDecantation,
  setSelectedDecantation,
  selectedDispensingUnit,
  setSelectedDispensingUnit,
  selectedSafetyUnits,
  onSafetyUnitToggle,
  selectedSafetyUpgrades,
  onSafetyUpgradeToggle,
  selectedLicenseOptions,
  onLicenseOptionToggle,
  selectedWarrantyOption,
  setSelectedWarrantyOption,
  selectedConsumption,
  onConsumptionSelect,
  vehiclePrice,
  finalPrice,
  recommendedTankId,
}) => {
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'quote' | 'contact'>('contact');
  
  // State for Learn More Modal - can be SafetyUpgrade or IotOption
  const [learnMoreOption, setLearnMoreOption] = useState<SafetyUpgradeOption | IotOption | null>(null);

  // State for UI interactions
  const [isStickyFooterVisible, setIsStickyFooterVisible] = useState(true);
  const [isPricingDetailsOpen, setIsPricingDetailsOpen] = useState(true);
  const [showIncludedOptions, setShowIncludedOptions] = useState(false);
  
  // Ref for the pricing section to track visibility
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If pricing section is visible (intersecting), hide the sticky footer
        setIsStickyFooterVisible(!entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the root
        threshold: 0.1, // Trigger when 10% of the target is visible
      }
    );

    if (pricingSectionRef.current) {
      observer.observe(pricingSectionRef.current);
    }

    return () => {
      if (pricingSectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return price === 0 ? formatCurrency(0) : `+${formatCurrency(price)}`;
  };
  
  const getTrimDisplayPrice = (trim: TrimOption) => {
    return formatPrice(trim.price);
  };

  // Helper to calculate the correct image URL for thumbnails based on current config
  const getSafetyImage = (upgradeId: string) => {
    const isSmallTank = selectedTank === '22kl' || selectedTank === '30kl';
    const isLargeTank = selectedTank === '45kl' || selectedTank === '60kl';
    const isDuWithoutRfid = selectedTrim.id === 'rwd'; // 3 RFID Nozzle
    const isDuWith1Rfid = selectedTrim.id === 'lr';    // 1 RFID Nozzle
    const isDuWith2Rfid = selectedTrim.id === 'lr-awd'; // 2 RFID Nozzle
    
    let baseIndex = 13; // Default fallback

    if (isSmallTank) {
      if (isDuWithoutRfid) baseIndex = 1;
      else if (isDuWith1Rfid) baseIndex = 5;
      else if (isDuWith2Rfid) baseIndex = 9;
      else baseIndex = 13;
    } else if (isLargeTank) {
      if (isDuWithoutRfid) baseIndex = 17;
      else if (isDuWith1Rfid) baseIndex = 21;
      else if (isDuWith2Rfid) baseIndex = 25;
      else baseIndex = 29;
    }

    // Calculate offset based on the specific upgrade we want to show
    // Logic matched with CarVisualizer: Fire adds 1, Barrier adds 2
    let offset = 0;
    if (upgradeId === 'fire-suppression') {
      offset = 1;
    } else if (upgradeId === 'crash-barrier') {
      offset = 2;
    }

    const imageIndex = baseIndex + offset;
    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    return `${s3BaseUrl}${imageIndex}.png`;
  };

  const handleViewQuoteClick = async () => {
    setSelectedAction('quote');
    
    const quoteData: QuoteData = {
      customerDetails,
      totalPrice: finalPrice,
      configuration: {
        trim: selectedTrim,
        tank: selectedTank,
        dispensingUnit: selectedDispensingUnit,
        decantation: selectedDecantation,
        accessories: {
          fuelLevel: selectedFuelLevelTechnology,
          reposOs: selectedReposOsOptions,
          mechanical: selectedMechanicalInclusionOptions,
          safetyUnits: selectedSafetyUnits,
          safetyUpgrades: selectedSafetyUpgrades,
        },
        licenses: selectedLicenseOptions,
        warranty: selectedWarrantyOption,
      }
    };

    // Generate PDF using utility
    await generateQuotePDF(quoteData);

    // Log to backend
    logQuoteGeneration(quoteData);
  };

  // Group pricing items
  const pricingItems = [
    { name: 'RPS Base Price', price: BASE_PRICE },
    { name: selectedDispensingUnit.name, price: selectedDispensingUnit.price },
    { name: selectedTrim.name, price: selectedTrim.price },
    { name: selectedFuelLevelTechnology.name, price: selectedFuelLevelTechnology.price },
    ...selectedReposOsOptions.map(opt => ({ name: opt.name, price: opt.price })),
    { name: selectedDecantation.name, price: selectedDecantation.price },
    ...selectedMechanicalInclusionOptions.map(opt => ({ name: opt.name, price: opt.price })),
    ...selectedSafetyUnits.map(opt => ({ name: opt.name, price: opt.price })),
    ...selectedSafetyUpgrades.map(opt => ({ name: opt.name, price: opt.price })),
    { name: selectedWarrantyOption.name, price: selectedWarrantyOption.price },
  ];

  const paidItems = pricingItems.filter(item => item.price > 0);
  const includedItems = pricingItems.filter(item => item.price === 0);

  return (
    <div className="bg-white text-gray-800 lg:h-full h-auto flex flex-col relative lg:overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-grow lg:overflow-y-auto overflow-visible scroll-smooth">
        <div className="p-6 md:p-10 pb-24">
          <h1 className="text-2xl md:text-[28px] md:leading-[48px] font-medium text-center text-[#171A20]">Repos Portable Station</h1>
          <div className="flex justify-around my-8 text-center">
            {[
              { label: 'Speed', value: '120L/m' },
              { label: 'Tracking', value: '100%' },
              { label: 'Monitoring', value: '24/7' },
            ].map(spec => (
              <div key={spec.label}>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {spec.value}
                </p>
                <p className="text-xs sm:text-[14px] leading-[20px] text-[#393C41] mt-1">{spec.label}</p>
              </div>
            ))}
          </div>
          
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

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Tank Capacity</h2>
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
                              <div className="relative bg-blue-600 px-2.5 py-0.5 rounded-tr-lg shadow">
                                  Recommended
                              </div>
                              <div 
                                  className="absolute top-full left-0 w-0 h-0"
                                  style={{
                                      borderStyle: 'solid',
                                      borderWidth: '0 6px 6px 0',
                                      borderColor: 'transparent #1d4ed8 transparent transparent'
                                  }}
                              />
                          </div>
                      )}
                      <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">Tank</p>
                            <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">Capacity</p>
                          </div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                      </div>
                      {/* Faint overlay */}
                      {selectedTank && selectedTank !== option.id && (
                          <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                      )}
                  </button>
              ))}
            </div>
          </div>

          <div className="mb-[45px]">
              <button
                  onClick={() => setIsComparisonModalOpen(true)}
                  className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left transition-colors"
              >
                  <span className="font-semibold text-gray-800">View & Compare Features</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </button>
          </div>

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Dispensing Unit</h2>
            <div className="space-y-2">
              {DISPENSING_UNIT_OPTIONS.map(option => (
                <button
                  key={`dispensing-unit-${option.id}`}
                  onClick={() => setSelectedDispensingUnit(option)}
                  className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                    selectedDispensingUnit.id === option.id
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
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                    </div>
                  </div>
                  {/* Faint overlay */}
                  {selectedDispensingUnit.id !== option.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">RFID Technology</h2>
            <div className="space-y-2">
              {TRIM_OPTIONS.filter(option => option.id !== 'p-awd')
                .sort((a, b) => {
                  const order: Array<TrimOption['id']> = ['rwd', 'lr-awd', 'lr'];
                  return order.indexOf(a.id) - order.indexOf(b.id);
                })
                .map(option => (
                  <button
                    key={`dispensing-${option.id}`}
                    onClick={() => setSelectedTrim(option)}
                    className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedTrim.id === option.id 
                        ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                          <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">{option.drive}</p>
                        </div>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{getTrimDisplayPrice(option)}</p>
                      </div>
                    </div>
                    {/* Faint overlay */}
                    {selectedTrim.id !== option.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                    )}
                  </button>
              ))}
            </div>
          </div>

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Fuel Level Technology</h2>
            <div className="space-y-2">
              {FUEL_LEVEL_TECHNOLOGY_OPTIONS.map(option => (
                <button
                  key={`fuel-level-${option.id}`}
                  onClick={() => setSelectedFuelLevelTechnology(option)}
                  className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                    selectedFuelLevelTechnology.id === option.id
                      ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                      </div>
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                    </div>
                  </div>
                  {/* Faint overlay */}
                  {selectedFuelLevelTechnology.id !== option.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

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
                    selectedReposOsOptions.some(o => o.id === option.id)
                      ? 'bg-gray-600 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedReposOsOptions.some(o => o.id === option.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                    <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Decantation Unit</h2>
            <div className="space-y-2">
              {DECANTATION_OPTIONS.map(option => (
                <div key={`decantation-${option.id}`} className="flex flex-col">
                  <button
                    onClick={() => setSelectedDecantation(option)}
                    className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedDecantation.id === option.id
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
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                      </div>
                    </div>
                    {/* Faint overlay */}
                    {selectedDecantation.id !== option.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                    )}
                  </button>
                  
                  {/* Learn More Button for Advanced Skid */}
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

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Mechanical Inclusion</h2>
            <div className="space-y-2">
              {MECHANICAL_INCLUSION_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => onMechanicalInclusionToggle(option)}
                  className={`w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                    selectedMechanicalInclusionOptions.some(o => o.id === option.id)
                      ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                    selectedMechanicalInclusionOptions.some(o => o.id === option.id)
                      ? 'bg-gray-600 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}>
                    {selectedMechanicalInclusionOptions.some(o => o.id === option.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                    <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-[45px]">
            {/* Safety Unit Section */}
            <div>
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Sensors and Controller Unit</h2>
              <div className="space-y-2">
                {SAFETY_UNIT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => onSafetyUnitToggle(option)}
                    className={`w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedSafetyUnits.some(o => o.id === option.id)
                        ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors mr-3 ${
                      selectedSafetyUnits.some(o => o.id === option.id)
                        ? 'bg-gray-600 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {selectedSafetyUnits.some(o => o.id === option.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Upgrades Section */}
            <div>
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Safety Upgrades</h2>
              <div className="space-y-6">
                {SAFETY_UPGRADE_OPTIONS.map(option => (
                  <div key={option.id} className="flex flex-col">
                    <div
                      onClick={() => onSafetyUpgradeToggle(option)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                        selectedSafetyUpgrades.some(o => o.id === option.id)
                          ? 'border-gray-400 ring-1 ring-gray-400'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-5 w-5 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                            selectedSafetyUpgrades.some(o => o.id === option.id)
                              ? 'bg-gray-600 border-gray-600'
                              : 'bg-white border-gray-300'
                          }`}>
                            {selectedSafetyUpgrades.some(o => o.id === option.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">{option.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">{formatPrice(option.price)}</span>
                      </div>
                      
                      <div className="w-full bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={getSafetyImage(option.id)} 
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

            {/* Warranty Options Section */}
            <div>
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-2">Warranty Options</h2>
              <div className="space-y-2 mt-6">
                {WARRANTY_OPTIONS.map(option => (
                  <button
                    key={`warranty-${option.id}`}
                    onClick={() => setSelectedWarrantyOption(option)}
                    className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedWarrantyOption.id === option.id
                        ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{option.name}</p>
                          {option.subtext && <p className="font-medium text-[12px] leading-[18px] text-[#5C5E62]">{option.subtext}</p>}
                        </div>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                      </div>
                    </div>
                    {/* Faint overlay */}
                    {selectedWarrantyOption.id !== option.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Licenses Section */}
            <div>
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-8">Licenses and Compliance</h2>
              <div className="space-y-3 mt-6">
                {LICENSE_OPTIONS.map(option => (
                  <div
                    key={`license-${option.id}`}
                    className="w-full flex items-center p-4 border border-gray-300 rounded-lg text-left bg-gray-50"
                  >
                    <div className="flex-grow flex justify-between items-center">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      {option.subtext && <span className="text-sm text-gray-500 font-medium">{option.subtext}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown & Actions */}
          <div ref={pricingSectionRef} className="mt-16 pt-8 border-t border-gray-200">
            <div 
              className="flex justify-between items-center mb-6 cursor-pointer group select-none"
              onClick={() => setIsPricingDetailsOpen(!isPricingDetailsOpen)}
            >
              <h2 className="text-xl font-medium text-gray-900">Pricing Details</h2>
              <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isPricingDetailsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isPricingDetailsOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-3 text-sm text-gray-600 mb-8">
                  {/* Paid Items - Always Visible */}
                  {paidItems.map((item, idx) => (
                    <div key={`paid-${idx}`} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  
                  {/* Included Items Toggle */}
                  {includedItems.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-2">
                       <button 
                        onClick={() => setShowIncludedOptions(!showIncludedOptions)}
                        className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-800 mb-2"
                       >
                         {showIncludedOptions ? 'Hide included features' : 'Show included features'}
                         <svg 
                           xmlns="http://www.w3.org/2000/svg" 
                           className={`h-3 w-3 ml-1 transition-transform ${showIncludedOptions ? 'rotate-180' : ''}`} 
                           fill="none" 
                           viewBox="0 0 24 24" 
                           stroke="currentColor"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                         </svg>
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
            
            {/* Total - Always visible */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-8">
                 <span className="text-lg font-semibold text-gray-900">RPS Base Price</span>
                 <span className="text-lg font-bold text-gray-900">{formatCurrency(finalPrice)}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
                 <button
                   onClick={() => setSelectedAction('contact')}
                   className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-colors ${
                     selectedAction === 'contact' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                   }`}
                >
                  Contact Sales
                </button>
                 <button
                   onClick={handleViewQuoteClick}
                   className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-colors ${
                     selectedAction === 'quote' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                   }`}
                >
                  View Quote
                </button>
            </div>
          </div>

        </div>
      </div>
      
      {/* Sticky Footer - Floating Card Style */}
      <div className={`fixed bottom-0 left-0 right-0 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 p-4 z-20 w-full pointer-events-none transition-transform duration-300 ease-in-out ${isStickyFooterVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}>
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex justify-between items-center pointer-events-auto">
           <div>
             <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{formatCurrency(finalPrice)}</p>
             <p className="text-xs sm:text-sm text-gray-500 mt-0.5">RPS price</p>
           </div>
           <button
             onClick={handleViewQuoteClick}
             className="bg-blue-600 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-md text-sm sm:text-base font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
           >
             View Quote
           </button>
        </div>
      </div>

      {isComparisonModalOpen && (
        <ComparisonModal onClose={() => setIsComparisonModalOpen(false)} />
      )}

      {/* Learn More Modal */}
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
            
            {/* Conditionally render image only if present in the option (Safety Upgrade or specific IotOption) */}
            {(learnMoreOption as any).imageUrl ? (
               <div className="flex justify-center mb-6">
                <img 
                  src={(learnMoreOption as SafetyUpgradeOption).id.includes('fire') || (learnMoreOption as SafetyUpgradeOption).id.includes('crash') 
                      ? getSafetyImage((learnMoreOption as SafetyUpgradeOption).id) 
                      : (learnMoreOption as any).imageUrl}
                  alt={learnMoreOption.name} 
                  className="max-h-64 object-contain"
                />
              </div>
            ) : (
              // If no image, maybe show a placeholder or just description. 
              // For Flow Meter, we might not have an image, so we handle it gracefully.
              // Actually, IotOption in types.ts has optional imageUrl.
              // If provided in constants, use it. Otherwise, don't render img.
              null
            )}
           

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
