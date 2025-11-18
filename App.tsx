import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import CarVisualizer from './components/CarVisualizer.tsx';
import Configurator from './components/Configurator.tsx';
import LeadFormModal from './components/LeadFormModal.tsx';
import type { TrimOption, AccessoryOption, IotOption, TankOption, WarrantyOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails } from './types';
import { 
  TRIM_OPTIONS,
  BASE_PRICE,
  DECANTATION_OPTIONS,
  REPOS_OS_OPTIONS,
  WARRANTY_OPTIONS,
  SAFETY_UNIT_OPTIONS,
  DISPENSING_UNIT_OPTIONS,
  FUEL_LEVEL_TECHNOLOGY_OPTIONS,
  MECHANICAL_INCLUSION_OPTIONS,
  SAFETY_UPGRADE_OPTIONS
} from './constants';

const App: React.FC = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(true);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  
  // Use safe initialization with fallbacks to prevent crashes
  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(() => {
    if (TRIM_OPTIONS && TRIM_OPTIONS.length > 0) return TRIM_OPTIONS[0];
    return { id: 'rwd', name: '3 RFID Nozzle', drive: '', price: 0, financePerMonth: 0, specs: [] };
  });

  const [selectedTank, setSelectedTank] = useState<TankOption['id']>('22kl');
  
  const [selectedFuelLevelTechnologyOptions, setSelectedFuelLevelTechnologyOptions] = useState<AccessoryOption[]>(() => 
    Array.isArray(FUEL_LEVEL_TECHNOLOGY_OPTIONS) ? FUEL_LEVEL_TECHNOLOGY_OPTIONS : []
  );
  
  const [selectedReposOsOptions, setSelectedReposOsOptions] = useState<AccessoryOption[]>(() => 
    (REPOS_OS_OPTIONS || []).filter(o => o.price === 0)
  );
  
  const [selectedMechanicalInclusionOptions, setSelectedMechanicalInclusionOptions] = useState<AccessoryOption[]>(() => 
    Array.isArray(MECHANICAL_INCLUSION_OPTIONS) ? MECHANICAL_INCLUSION_OPTIONS : []
  );

  // Robust initializers for single-select options
  const [selectedDecantation, setSelectedDecantation] = useState<IotOption>(() => {
    const options = DECANTATION_OPTIONS || [];
    return options.find(o => o.price === 0) || options[0] || { id: 'basic', name: 'Basic', price: 0, subtext: '' };
  });
  
  const [selectedDispensingUnit, setSelectedDispensingUnit] = useState<DispensingUnitOption>(() => {
    const options = DISPENSING_UNIT_OPTIONS || [];
    return options[0] || { id: 'single', name: 'Single', subtext: '', price: 0 };
  });
  
  const [selectedSafetyUnits, setSelectedSafetyUnits] = useState<AccessoryOption[]>(() => 
    (SAFETY_UNIT_OPTIONS || []).filter(o => o.price === 0)
  );

  const [selectedSafetyUpgrades, setSelectedSafetyUpgrades] = useState<SafetyUpgradeOption[]>([]);
  
  const [selectedWarrantyOption, setSelectedWarrantyOption] = useState<WarrantyOption>(() => {
    const options = WARRANTY_OPTIONS || [];
    return options.find(o => o.price === 0) || options[0] || { id: 'basic', name: 'Basic', price: 0 };
  });
  
  const [selectedConsumption, setSelectedConsumption] = useState<string | null>(null);
  const [recommendedTankId, setRecommendedTankId] = useState<TankOption['id'] | null>(null);

  // Preload all possible vehicle images on initial app load for a smoother experience
  useEffect(() => {
    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    const imageCount = 31; // We have images from 1.png to 31.png
    const imageUrls = Array.from({ length: imageCount }, (_, i) => `${s3BaseUrl}${i + 1}.png`);
    
    // This loop tells the browser to start downloading and caching these images.
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []); // The empty dependency array ensures this runs only once when the component mounts.


  const handleLeadFormClose = (details?: CustomerDetails) => {
    setIsLeadFormOpen(false);
    if (details) {
      setCustomerDetails(details);
      setSelectedConsumption(details.consumption);
      
      switch (details.consumption) {
        case '50-100KL':
          setRecommendedTankId('22kl');
          break;
        case '100-200KL':
          setRecommendedTankId('30kl');
          break;
        case '200-300KL':
          setRecommendedTankId('45kl');
          break;
        case '300-1000KL':
          setRecommendedTankId('60kl');
          break;
        default:
          setRecommendedTankId(null);
          break;
      }
    }
  };

  const handleConsumptionSelect = (consumption: string) => {
    setSelectedConsumption(consumption);
    switch (consumption) {
      case '50-100KL':
        setRecommendedTankId('22kl');
        break;
      case '100-200KL':
        setRecommendedTankId('30kl');
        break;
      case '200-300KL':
        setRecommendedTankId('45kl');
        break;
      case '300-1000KL':
        setRecommendedTankId('60kl');
        break;
      default:
        setRecommendedTankId(null);
        break;
    }
  };

  const handleFuelLevelTechnologyToggle = (option: AccessoryOption) => {
    setSelectedFuelLevelTechnologyOptions(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleReposOsToggle = (option: AccessoryOption) => {
    setSelectedReposOsOptions(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleMechanicalInclusionToggle = (option: AccessoryOption) => {
    setSelectedMechanicalInclusionOptions(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleSafetyUnitToggle = (option: AccessoryOption) => {
    setSelectedSafetyUnits(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleSafetyUpgradeToggle = (option: SafetyUpgradeOption) => {
    setSelectedSafetyUpgrades(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const vehiclePrice = useMemo(() => {
    let price = BASE_PRICE + (selectedTrim?.price || 0);
    price += selectedDispensingUnit?.price || 0;
    price += (selectedFuelLevelTechnologyOptions || []).reduce((total, opt) => total + opt.price, 0);
    price += selectedReposOsOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedMechanicalInclusionOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedDecantation?.price || 0;
    price += selectedSafetyUnits.reduce((total, unit) => total + unit.price, 0);
    price += selectedSafetyUpgrades.reduce((total, unit) => total + unit.price, 0);
    price += selectedWarrantyOption?.price || 0;
    return price;
  }, [selectedTrim, selectedDispensingUnit, selectedFuelLevelTechnologyOptions, selectedReposOsOptions, selectedMechanicalInclusionOptions, selectedDecantation, selectedSafetyUnits, selectedSafetyUpgrades, selectedWarrantyOption]);

  const finalPrice = vehiclePrice;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800">
      {isLeadFormOpen && <LeadFormModal onSubmit={handleLeadFormClose} />}
      <Header />
      <main className="flex flex-col lg:flex-row">
        <div className="w-full lg:flex-1 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] h-[45vh] min-h-[300px] relative z-0 bg-gray-100">
          <CarVisualizer 
            trim={selectedTrim}
            tank={selectedTank}
            safetyUpgrades={selectedSafetyUpgrades}
          />
        </div>
        <div className="w-full lg:w-[400px] xl:w-[450px] lg:h-[calc(100vh-72px)] bg-white z-10 flex-shrink-0">
          <Configurator
            customerDetails={customerDetails}
            selectedTrim={selectedTrim}
            setSelectedTrim={setSelectedTrim}
            selectedTank={selectedTank}
            setSelectedTank={setSelectedTank}
            selectedFuelLevelTechnologyOptions={selectedFuelLevelTechnologyOptions}
            onFuelLevelTechnologyToggle={handleFuelLevelTechnologyToggle}
            selectedReposOsOptions={selectedReposOsOptions}
            onReposOsToggle={handleReposOsToggle}
            selectedMechanicalInclusionOptions={selectedMechanicalInclusionOptions}
            onMechanicalInclusionToggle={handleMechanicalInclusionToggle}
            selectedDecantation={selectedDecantation}
            setSelectedDecantation={setSelectedDecantation}
            selectedDispensingUnit={selectedDispensingUnit}
            setSelectedDispensingUnit={setSelectedDispensingUnit}
            selectedSafetyUnits={selectedSafetyUnits}
            onSafetyUnitToggle={handleSafetyUnitToggle}
            selectedSafetyUpgrades={selectedSafetyUpgrades}
            onSafetyUpgradeToggle={handleSafetyUpgradeToggle}
            selectedWarrantyOption={selectedWarrantyOption}
            setSelectedWarrantyOption={setSelectedWarrantyOption}
            selectedConsumption={selectedConsumption}
            onConsumptionSelect={handleConsumptionSelect}
            vehiclePrice={vehiclePrice}
            finalPrice={finalPrice}
            recommendedTankId={recommendedTankId}
          />
        </div>
      </main>
    </div>
  );
};

export default App;