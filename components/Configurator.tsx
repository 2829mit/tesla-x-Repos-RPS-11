import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { PaintOption, WheelOption, InteriorOption, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption, IotOption, TankOption, WarrantyOption } from '../types';
import { PAINT_OPTIONS, WHEEL_OPTIONS, INTERIOR_OPTIONS, TRIM_OPTIONS, ACCESSORY_OPTIONS, CHARGING_OPTIONS, ACCESSORY_PACK_OPTIONS, IOT_OPTIONS, DECANTATION_OPTIONS, SAFETY_UNIT_OPTIONS, CONSUMPTION_OPTIONS, TANK_OPTIONS, WARRANTY_OPTIONS, REPOS_OS_OPTIONS } from '../constants';
import ConnectivityModal from './ConnectivityModal.tsx';
import ComparisonModal from './ComparisonModal.tsx';

interface ConfiguratorProps {
  selectedTrim: TrimOption | null;
  setSelectedTrim: (trim: TrimOption) => void;
  selectedTank: TankOption['id'] | null;
  setSelectedTank: (tankId: TankOption['id']) => void;
  selectedPaint: PaintOption | null;
  setSelectedPaint: (paint: PaintOption) => void;
  selectedWheels: WheelOption | null;
  setSelectedWheels: (wheels: WheelOption) => void;
  selectedInterior: InteriorOption | null;
  setSelectedInterior: (interior: InteriorOption) => void;
  selectedAccessories: AccessoryOption[];
  onAccessoryToggle: (accessory: AccessoryOption) => void;
  selectedCharging: ChargingOption[];
  onChargingToggle: (charger: ChargingOption) => void;
  selectedPacks: AccessoryPackOption[];
  onPackToggle: (pack: AccessoryPackOption) => void;
  selectedIotOptions: IotOption[];
  onIotToggle: (option: IotOption) => void;
  selectedReposOsOptions: AccessoryOption[];
  onReposOsToggle: (option: AccessoryOption) => void;
  selectedDecantation: IotOption | null;
  setSelectedDecantation: (option: IotOption) => void;
  selectedSafetyUnits: AccessoryOption[];
  onSafetyUnitToggle: (option: AccessoryOption) => void;
  selectedWarrantyOption: WarrantyOption | null;
  setSelectedWarrantyOption: (option: WarrantyOption) => void;
  selectedConsumption: string | null;
  onConsumptionSelect: (consumption: string) => void;
  vehiclePrice: number;
  destinationFee: number;
  orderFee: number;
  finalPrice: number;
  setVisualizerView: (view: 'car' | 'wheels') => void;
  recommendedTankId: TankOption['id'] | null;
}

const Configurator: React.FC<ConfiguratorProps> = ({
  selectedTrim,
  setSelectedTrim,
  selectedTank,
  setSelectedTank,
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
  selectedIotOptions,
  onIotToggle,
  selectedReposOsOptions,
  onReposOsToggle,
  selectedDecantation,
  setSelectedDecantation,
  selectedSafetyUnits,
  onSafetyUnitToggle,
  selectedWarrantyOption,
  setSelectedWarrantyOption,
  selectedConsumption,
  onConsumptionSelect,
  vehiclePrice,
  destinationFee,
  orderFee,
  finalPrice,
  setVisualizerView,
  recommendedTankId,
}) => {
  const [configMode, setConfigMode] = useState<'tankCapacity' | 'consumption'>('tankCapacity');
  const [showPriceDetails, setShowPriceDetails] = useState(true);
  const [isStickyFooterVisible, setIsStickyFooterVisible] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isConnectivityModalOpen, setIsConnectivityModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
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

  const formatPrice = (price: number) => {
    return price === 0 ? formatCurrency(0) : `+${formatCurrency(price)}`;
  };
  
  const formatLineItemPrice = (price: number) => {
    return price === 0 ? 'Included' : formatCurrency(price);
  }

  const ConfiguratorTab: React.FC<{ mode: 'tankCapacity' | 'consumption'; label: string }> = ({ mode, label }) => (
    <button
        onClick={() => setConfigMode(mode)}
        className={`w-1/2 pb-2 text-[14px] leading-[16.8px] font-medium transition-all duration-200 focus:outline-none ${configMode === mode ? 'text-[#171A20] border-b-2 border-[#171A20]' : 'text-[#171A20] opacity-50 hover:opacity-100'}`}
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

  const getTrimDisplayPrice = (trim: TrimOption) => {
    return formatPrice(trim.price);
  };

  const getAccessoryPackImageUrl = (pack: AccessoryPackOption): string => {
    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    const isLargeTank = selectedTank === '45kl' || selectedTank === '60kl';

    if (isLargeTank) {
      if (pack.id === 'crash-barrier-pack') {
        return `${s3BaseUrl}30.png`;
      }
      if (pack.id === 'fire-extinguisher-pack') {
        return `${s3BaseUrl}31.png`;
      }
    }
    
    // Default image for small tanks or when no tank is selected
    return pack.imageUrl;
  };

  return (
    <div className="bg-white text-gray-800 h-full flex flex-col">
      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto">
        <div className="p-6 md:p-10">
          <h1 className="text-[28px] leading-[48px] font-medium text-center text-[#171A20]">Repos Portable Station</h1>
          <div className="flex justify-around my-8 text-center">
            {selectedTrim ? (
              selectedTrim.specs.map(spec => (
                <div key={spec.label}>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {spec.value}
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#393C41] mt-1">{spec.label}</p>
                </div>
              ))
            ) : (
              [
                { label: 'Speed', value: '120L/m' },
                { label: 'Tracking', value: '100%' },
                { label: 'Monitoring', value: '24/7' },
              ].map(spec => (
                <div key={spec.label}>
                  <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {spec.value}
                  </p>
                  <p className="text-[14px] leading-[20px] text-[#393C41] mt-1">{spec.label}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-around mb-6">
              <ConfiguratorTab mode="tankCapacity" label="Tank Capacity" />
              <ConfiguratorTab mode="consumption" label="Consumption" />
          </div>
          
          {configMode === 'tankCapacity' && (
            <div className="space-y-4 mb-[45px]">
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
          )}
          
          {configMode === 'consumption' && (
            <div className="space-y-4 mb-[45px]">
              {CONSUMPTION_OPTIONS.map(option => (
                <button 
                    key={option}
                    onClick={() => {
                      onConsumptionSelect(option);
                      setConfigMode('tankCapacity');
                    }}
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
          )}

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
              {TRIM_OPTIONS.filter(option => option.id !== 'p-awd')
                .sort((a, b) => {
                  const order: Array<TrimOption['id']> = ['lr-awd', 'lr', 'rwd'];
                  return order.indexOf(a.id) - order.indexOf(b.id);
                })
                .map(option => (
                  <button
                    key={`dispensing-${option.id}`}
                    onClick={() => setSelectedTrim(option)}
                    className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                      selectedTrim?.id === option.id 
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
                    {selectedTrim && selectedTrim.id !== option.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                    )}
                  </button>
              ))}
            </div>
          </div>

          <div className="mb-[45px]">
            <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">IOT Technology</h2>
            <div className="space-y-2">
              {IOT_OPTIONS.map(option => (
                <button
                  key={`iot-${option.id}`}
                  onClick={() => onIotToggle(option)}
                  className={`group relative w-full flex items-center p-4 border rounded-lg text-left cursor-pointer transition-all duration-300 ${
                    selectedIotOptions.some(o => o.id === option.id)
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
                <button
                  key={`decantation-${option.id}`}
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
                      <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatPrice(option.price)}</p>
                    </div>
                  </div>
                  {/* Faint overlay */}
                  {selectedDecantation && selectedDecantation.id !== option.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-[45px]">
            {/* Safety Section */}
            <div>
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-2">Safety and Compliance</h2>
              <p className="text-center text-gray-600 mt-1 mb-6">Engineered to be the safest in the world</p>
              
              <div className="border border-gray-200 rounded-lg p-6 space-y-6">
                {/* Feature 1: 360-Degree Visibility */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Double Walled Safety</h3>
                    <p className="text-[14px] leading-[20px] text-[#5C5E62] mt-1">High tensile Strength and Durability</p>
                  </div>
                </div>
                
                {/* Feature 2: Active Safety */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Vaccum Valve</h3>
                    <p className="text-[14px] leading-[20px] text-[#5C5E62] mt-1">Automatic Release of excess Vapour Pressure</p>
                  </div>
                </div>
                
                {/* Feature 3: Passive Safety */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">PESO Approved</h3>
                    <p className="text-[14px] leading-[20px] text-[#5C5E62] mt-1">Certified for safety and reliability</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            {/* Safety Unit Section */}
            <div>
              <h2 className="font-medium text-[20px] leading-[28px] text-[#171A20] mb-3 text-center">Safety Unit</h2>
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
              <div className="grid grid-cols-1 gap-8">
                {ACCESSORY_PACK_OPTIONS.map(option => (
                  <div key={option.id}>
                    <div
                      className={`group relative border rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-all duration-300 ${selectedPacks.some(p => p.id === option.id) ? 'border-gray-400 ring-1 ring-gray-400 bg-gray-50' : 'border-gray-300'}`}
                      onClick={() => onPackToggle(option)}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <div className={`h-6 w-6 border rounded flex-shrink-0 flex items-center justify-center transition-colors ${
                              selectedPacks.some(p => p.id === option.id)
                                ? 'bg-gray-600 border-gray-600'
                                : 'bg-white border-gray-300'
                            }`}>
                            {selectedPacks.some(p => p.id === option.id) && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <p className="font-medium text-[14px] leading-[20px] text-[#171A20] ml-3">{option.name}</p>
                        </div>
                        <p className="font-medium text-[14px] leading-[20px] text-[#171A20]">{formatCurrency(option.price)}</p>
                      </div>
                      <img
                        src={getAccessoryPackImageUrl(option)}
                        alt={option.name}
                        className="w-full h-auto object-contain rounded"
                      />
                      {/* Faint overlay */}
                      {selectedPacks.length > 0 && !selectedPacks.some(p => p.id === option.id) && (
                          <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0 pointer-events-none"></div>
                      )}
                    </div>
                    <div className="mt-6 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedPackForModal(option); }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors"
                        aria-label={`Learn more about ${option.name}`}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Warranties Section */}
            <div>
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-2">Warranties</h2>
              
              <div className="border border-gray-200 rounded-lg p-6 space-y-6 mt-6">
                {/* Feature 1: Limited Warranty */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Limited Warranty</h3>
                    <p className="text-[14px] leading-[20px] text-[#5C5E62] mt-1">Repairs and Service covered for 1 year</p>
                  </div>
                </div>
                
                {/* Feature 2: Battery and Drive Unit Warranty */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Battery and Drive Unit Limited Warranty</h3>
                    <p className="text-[14px] leading-[20px] text-[#5C5E62] mt-1">Covered for 8 years or 120,000 miles, whichever comes first.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-md transition-colors">
                  Learn More
                </button>
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
                      selectedWarrantyOption?.id === option.id
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
                    {selectedWarrantyOption && selectedWarrantyOption.id !== option.id && (
                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg transition-opacity duration-300 group-hover:opacity-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* New Pricing Breakdown Section */}
            <div ref={priceDetailsRef} className="pt-4 space-y-3">
              <h2 className="text-2xl font-semibold text-center">Enter Delivery ZIP</h2>
              <input 
                type="text" 
                placeholder="Enter Delivery ZIP" 
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-center focus:ring-1 focus:ring-gray-400 outline-none" 
              />
              {showPriceDetails && (
                <div className="space-y-2 pt-2">
                  
                  {selectedTrim && <PriceLineItem label={`${selectedTrim.name} ${selectedTrim.drive}`} value={formatLineItemPrice(selectedTrim.price)} />}
                  {selectedPaint && selectedPaint.price > 0 && <PriceLineItem label={selectedPaint.name} value={formatLineItemPrice(selectedPaint.price)} />}
                  {selectedWheels && selectedWheels.price > 0 && <PriceLineItem label={selectedWheels.name} value={formatLineItemPrice(selectedWheels.price)} />}
                  {selectedInterior && selectedInterior.price > 0 && <PriceLineItem label={selectedInterior.name} value={formatLineItemPrice(selectedInterior.price)} />}
                  {selectedPacks.map(pack => <PriceLineItem key={pack.id} label={pack.name} value={formatLineItemPrice(pack.price)} />)}
                  {selectedIotOptions.map(opt => <PriceLineItem key={opt.id} label={opt.name} value={formatLineItemPrice(opt.price)} />)}
                  {selectedReposOsOptions.map(opt => <PriceLineItem key={opt.id} label={opt.name} value={formatLineItemPrice(opt.price)} />)}
                  {selectedDecantation && selectedDecantation.price > 0 && <PriceLineItem key={selectedDecantation.id} label={selectedDecantation.name} value={formatLineItemPrice(selectedDecantation.price)} />}
                  {selectedWarrantyOption && selectedWarrantyOption.price > 0 && <PriceLineItem key={selectedWarrantyOption.id} label={selectedWarrantyOption.name} value={formatLineItemPrice(selectedWarrantyOption.price)} />}
                  {selectedSafetyUnits.map(unit => <PriceLineItem key={unit.id} label={unit.name} value={formatLineItemPrice(unit.price)} />)}
                  {selectedAccessories.map(acc => <PriceLineItem key={acc.id} label={acc.name} value={formatLineItemPrice(acc.price)} />)}
                  {selectedCharging.map(charger => <PriceLineItem key={charger.id} label={charger.name} value={formatLineItemPrice(charger.price)} />)}

                  <hr className="my-2"/>
                  <PriceLineItem label="RPS Price" value={vehiclePrice} bold />
                  <PriceLineItem label="Destination Fee" value={destinationFee} />
                  <PriceLineItem label="Order Fee" value={orderFee} />
                  <hr className="my-2"/>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <p>Ex-Showroom Price</p>
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
        <div className="mx-3.5 mt-0.5 px-6 py-2 bg-white rounded-xl border border-gray-200 shadow-md">
          <div className="flex justify-between items-center">
            {/* Left Section: Price and Label */}
            <div>
              <div className="flex items-center space-x-2">
                 <p className="text-2xl font-bold text-black leading-tight">
                  {formatCurrency(finalPrice)}
                </p>
              </div>
              {/* Subtitle Label */}
              <p className="text-sm text-gray-500 mt-0">
                RPS price
              </p>
            </div>
            
            {/* Right Section: CTA Button */}
            <button 
              className="bg-[#3E6AE1] text-white font-semibold py-2 px-5 rounded hover:bg-[#3457b1] transition-colors duration-300"
            >
              Order Now
            </button>
          </div>
        </div>
      )}

      {isConnectivityModalOpen && <ConnectivityModal onClose={() => setIsConnectivityModalOpen(false)} />}
      {isComparisonModalOpen && <ComparisonModal onClose={() => setIsComparisonModalOpen(false)} />}
      
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