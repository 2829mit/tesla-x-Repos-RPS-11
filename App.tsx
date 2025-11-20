
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import CarVisualizer from './components/CarVisualizer.tsx';
import Configurator from './components/Configurator.tsx';
import LeadFormModal from './components/LeadFormModal.tsx';
import LoginModal from './components/LoginModal.tsx';
import type { TrimOption, AccessoryOption, IotOption, TankOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails, LicenseOption } from './types';
import { 
  DECANTATION_OPTIONS,
  REPOS_OS_OPTIONS,
  SAFETY_UNIT_OPTIONS,
  DISPENSING_UNIT_OPTIONS,
  MECHANICAL_INCLUSION_OPTIONS,
  LICENSE_OPTIONS,
  TANK_OPTIONS,
} from './constants';
import { getRecommendedTankId } from './utils/vehicleHelpers';

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [userRole, setUserRole] = useState<'sales' | 'guest' | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  
  // Payment Mode State - Default to installments as requested
  const [paymentMode, setPaymentMode] = useState<'outright' | 'installments'>('installments');
  
  // Default to NULL (no option selected)
  const [selectedTrim, setSelectedTrim] = useState<TrimOption | null>(null);

  // Ensure selectedTank defaults to a valid ID from TANK_OPTIONS
  const [selectedTank, setSelectedTank] = useState<TankOption['id']>(() => 
    TANK_OPTIONS[0]?.id || '22kl'
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
  
  const [selectedLicenseOptions, setSelectedLicenseOptions] = useState<LicenseOption[]>(() => {
      // Select all license options by default as they are informational/scopes
      return LICENSE_OPTIONS || [];
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
  }, []);

  const handleLogin = (role: 'sales' | 'guest') => {
    setUserRole(role);
    setIsLoginModalOpen(false);
    setIsLeadFormOpen(true);
  };

  const handleLeadFormClose = (details?: CustomerDetails) => {
    setIsLeadFormOpen(false);
    if (details) {
      setCustomerDetails(details);
      setSelectedConsumption(details.consumption);
      
      const recId = getRecommendedTankId(details.consumption);
      setRecommendedTankId(recId);
    }
  };

  const handleConsumptionSelect = (consumption: string) => {
    setSelectedConsumption(consumption);
    const recId = getRecommendedTankId(consumption);
    setRecommendedTankId(recId);
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

  // --- Price Calculations ---

  // 1. Calculate Total Monthly Price (Base cost of configuration per month)
  const monthlyTotalPrice = useMemo(() => {
    const tank = TANK_OPTIONS.find(t => t.id === selectedTank);
    const tankPrice = tank ? tank.price : 0;

    let price = tankPrice;
    price += selectedTrim?.price || 0;
    price += selectedDispensingUnit?.price || 0;
    price += selectedReposOsOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedMechanicalInclusionOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedDecantation?.price || 0;
    price += selectedSafetyUnits.reduce((total, unit) => total + unit.price, 0);
    price += selectedSafetyUpgrades.reduce((total, unit) => total + unit.price, 0);
    price += selectedLicenseOptions.reduce((total, opt) => total + opt.price, 0);
    return price;
  }, [selectedTank, selectedTrim, selectedDispensingUnit, selectedReposOsOptions, selectedMechanicalInclusionOptions, selectedDecantation, selectedSafetyUnits, selectedSafetyUpgrades, selectedLicenseOptions]);

  // 2. Calculate Total Contract Value (Excluding Tax)
  // This is essentially (Monthly * 36) regardless of payment mode, used as base for tax
  const totalContractValue = useMemo(() => {
    return monthlyTotalPrice * 36;
  }, [monthlyTotalPrice]);

  // 3. Calculate GST (18%)
  const gstAmount = useMemo(() => {
    return totalContractValue * 0.18;
  }, [totalContractValue]);

  // 4. Calculate Total Inclusive of Tax
  const totalInclTax = useMemo(() => {
    return totalContractValue + gstAmount;
  }, [totalContractValue, gstAmount]);

  // 5. Determine displayed/final price based on payment mode
  // For Outright: User pays Total Incl Tax.
  // For Installments: User pays Monthly Price. The GST Amount is the "Down Payment".
  const displayPrice = useMemo(() => {
    if (paymentMode === 'outright') {
      return totalInclTax;
    }
    return monthlyTotalPrice;
  }, [totalInclTax, monthlyTotalPrice, paymentMode]);

  // Determine if prices should be shown (only for 'sales' role)
  const showPrices = userRole === 'sales';

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800">
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} />}
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
            paymentMode={paymentMode}
            setPaymentMode={setPaymentMode}
            selectedTrim={selectedTrim}
            setSelectedTrim={setSelectedTrim}
            selectedTank={selectedTank}
            setSelectedTank={setSelectedTank}
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
            selectedLicenseOptions={selectedLicenseOptions}
            selectedConsumption={selectedConsumption}
            onConsumptionSelect={handleConsumptionSelect}
            
            // New Pricing Props
            totalContractValue={totalContractValue}
            gstAmount={gstAmount}
            finalPrice={displayPrice} // This is either Total(Inc Tax) or Monthly Price
            
            recommendedTankId={recommendedTankId}
            showPrices={showPrices}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
