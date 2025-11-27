
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import CarVisualizer from './components/CarVisualizer.tsx';
import Configurator from './components/Configurator.tsx';
import LeadFormModal from './components/LeadFormModal.tsx';
import LoginModal from './components/LoginModal.tsx';
import LandingPage from './components/LandingPage.tsx';
import ExplorePage from './components/ExplorePage.tsx';
import FaqPage from './components/FaqPage.tsx';
import ReposPayPage from './components/ReposPayPage.tsx';
import AboutUsPage from './components/AboutUsPage.tsx';
import type { AccessoryOption, IotOption, TankOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails, LicenseOption } from './types';
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
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'explore' | 'faq' | 'reposPay' | 'about'>('landing');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [userRole, setUserRole] = useState<'sales' | 'guest' | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [showRoiCalculator, setShowRoiCalculator] = useState(false);
  
  const [paymentMode, setPaymentMode] = useState<'outright' | 'installments'>('installments');
  
  // Selected Tank
  const [selectedTank, setSelectedTank] = useState<TankOption['id']>(() => 
    TANK_OPTIONS[0]?.id || '22kl'
  );
  
  const [selectedReposOsOptions, setSelectedReposOsOptions] = useState<AccessoryOption[]>(() => 
    (REPOS_OS_OPTIONS || []).filter(o => o.price === 0)
  );
  
  const [selectedMechanicalInclusionOptions, setSelectedMechanicalInclusionOptions] = useState<AccessoryOption[]>(() => 
    Array.isArray(MECHANICAL_INCLUSION_OPTIONS) ? MECHANICAL_INCLUSION_OPTIONS : []
  );

  const [selectedDecantation, setSelectedDecantation] = useState<IotOption | null>(() => {
    const options = DECANTATION_OPTIONS || [];
    return options.find(o => o.price === 0) || options[0] || null;
  });
  
  // Changed to Array for Multi-Select
  const [selectedDispensingUnits, setSelectedDispensingUnits] = useState<DispensingUnitOption[]>(() => {
    const options = DISPENSING_UNIT_OPTIONS || [];
    // Default to selecting Single DU if available
    const defaultDU = options.find(o => o.id === 'single-du');
    return defaultDU ? [defaultDU] : [];
  });
  
  const [selectedSafetyUnits, setSelectedSafetyUnits] = useState<AccessoryOption[]>(() => 
    (SAFETY_UNIT_OPTIONS || []).filter(o => o.price === 0)
  );

  const [selectedSafetyUpgrades, setSelectedSafetyUpgrades] = useState<SafetyUpgradeOption[]>([]);
  
  const [selectedLicenseOptions, setSelectedLicenseOptions] = useState<LicenseOption[]>(() => {
      return LICENSE_OPTIONS || [];
  });

  const [selectedConsumption, setSelectedConsumption] = useState<string | null>(null);
  const [recommendedTankId, setRecommendedTankId] = useState<TankOption['id'] | null>(null);

  useEffect(() => {
    const s3BaseUrl = 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/';
    const imageCount = 31;
    const imageUrls = Array.from({ length: imageCount }, (_, i) => `${s3BaseUrl}${i + 1}.png`);
    
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

  const handleDispensingUnitToggle = (option: DispensingUnitOption) => {
    setSelectedDispensingUnits(prev => 
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  // Reset configuration handler for Clear All button
  const resetConfiguration = () => {
    setSelectedTank(TANK_OPTIONS[0]?.id || '22kl');
    
    // Clear all array selections including price 0 options
    setSelectedReposOsOptions([]);
    setSelectedMechanicalInclusionOptions([]);
    
    // Clear decantation selection completely
    setSelectedDecantation(null);
    
    // Clear dispensing units including default
    setSelectedDispensingUnits([]);
    
    setSelectedSafetyUnits([]);
    setSelectedSafetyUpgrades([]);
    // Clear license options including standard offerings
    setSelectedLicenseOptions([]);
    
    setPaymentMode('installments');
  };

  const monthlyTotalPrice = useMemo(() => {
    const tank = TANK_OPTIONS.find(t => t.id === selectedTank);
    const tankPrice = tank ? tank.price : 0;

    let price = tankPrice;
    // Sum all selected dispensing units
    price += selectedDispensingUnits.reduce((sum, du) => sum + du.price, 0);
    
    price += selectedReposOsOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedMechanicalInclusionOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedDecantation?.price || 0;
    price += selectedSafetyUnits.reduce((total, unit) => total + unit.price, 0);
    price += selectedSafetyUpgrades.reduce((total, unit) => total + unit.price, 0);
    price += selectedLicenseOptions.reduce((total, opt) => total + opt.price, 0);
    return price;
  }, [selectedTank, selectedDispensingUnits, selectedReposOsOptions, selectedMechanicalInclusionOptions, selectedDecantation, selectedSafetyUnits, selectedSafetyUpgrades, selectedLicenseOptions]);

  const totalContractValue = useMemo(() => {
    return monthlyTotalPrice * 36;
  }, [monthlyTotalPrice]);

  const gstAmount = useMemo(() => {
    return totalContractValue * 0.18;
  }, [totalContractValue]);

  const totalInclTax = useMemo(() => {
    return totalContractValue + gstAmount;
  }, [totalContractValue, gstAmount]);

  const displayPrice = useMemo(() => {
    if (paymentMode === 'outright') {
      return totalInclTax;
    }
    return monthlyTotalPrice;
  }, [totalInclTax, monthlyTotalPrice, paymentMode]);

  const showPrices = userRole === 'sales';

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onEnterApp={() => setCurrentView('app')} 
        onExploreClick={() => setCurrentView('explore')}
        onFaqClick={() => setCurrentView('faq')}
        onReposPayClick={() => setCurrentView('reposPay')}
        onAboutClick={() => setCurrentView('about')}
        onRoiClick={() => {
          setCurrentView('app');
          setShowRoiCalculator(true);
        }}
      />
    );
  }

  if (currentView === 'explore') {
    return (
      <ExplorePage 
        onNavigateHome={() => setCurrentView('landing')}
        onNavigateToApp={() => setCurrentView('app')}
        onFaqClick={() => setCurrentView('faq')}
        onAboutClick={() => setCurrentView('about')}
      />
    );
  }

  if (currentView === 'faq') {
    return (
      <FaqPage 
        onBack={() => setCurrentView('landing')} 
        onAboutClick={() => setCurrentView('about')}
      />
    );
  }

  if (currentView === 'reposPay') {
    return (
      <ReposPayPage 
        onBack={() => setCurrentView('landing')}
        onNavigateToApp={() => setCurrentView('app')}
        onAboutClick={() => setCurrentView('about')}
      />
    );
  }

  if (currentView === 'about') {
    return (
      <AboutUsPage
        onNavigateHome={() => setCurrentView('landing')}
        onNavigateToApp={() => setCurrentView('app')}
        onExploreClick={() => setCurrentView('explore')}
        onReposPayClick={() => setCurrentView('reposPay')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800">
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} />}
      {isLeadFormOpen && <LeadFormModal onSubmit={handleLeadFormClose} />}
      
      <Header 
        navItems={['Home']}
        onRoiClick={() => setShowRoiCalculator(true)} 
        onHomeClick={() => setShowRoiCalculator(false)}
        // If user clicks FAQs in App, go to FAQ page
        rightNavItems={['FAQs']}
        onNavItemClick={(item) => {
            if (item === 'FAQs') setCurrentView('faq');
            if (item === 'Home') setCurrentView('landing');
        }}
      />
      
      {showRoiCalculator ? (
        <div className="w-full h-[calc(100vh-72px)] bg-white">
          <iframe 
            src="https://repos-rps-roi-calculator.vercel.app/" 
            className="w-full h-full border-0"
            title="ROI Calculator"
          />
        </div>
      ) : (
        <main className="flex flex-col lg:flex-row">
          <div className="w-full lg:flex-1 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px] h-[45vh] min-h-[300px] relative z-0 bg-gray-100">
            <CarVisualizer 
              tank={selectedTank}
              safetyUpgrades={selectedSafetyUpgrades}
            />
          </div>
          <div className="w-full lg:w-[400px] xl:w-[450px] lg:h-[calc(100vh-72px)] bg-white z-10 flex-shrink-0">
            <Configurator
              customerDetails={customerDetails}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              selectedTank={selectedTank}
              setSelectedTank={setSelectedTank}
              selectedReposOsOptions={selectedReposOsOptions}
              onReposOsToggle={handleReposOsToggle}
              selectedMechanicalInclusionOptions={selectedMechanicalInclusionOptions}
              onMechanicalInclusionToggle={handleMechanicalInclusionToggle}
              selectedDecantation={selectedDecantation}
              setSelectedDecantation={setSelectedDecantation}
              
              // Pass Array and Toggle Handler
              selectedDispensingUnits={selectedDispensingUnits}
              onDispensingUnitToggle={handleDispensingUnitToggle}
              
              selectedSafetyUnits={selectedSafetyUnits}
              onSafetyUnitToggle={handleSafetyUnitToggle}
              selectedSafetyUpgrades={selectedSafetyUpgrades}
              onSafetyUpgradeToggle={handleSafetyUpgradeToggle}
              selectedLicenseOptions={selectedLicenseOptions}
              selectedConsumption={selectedConsumption}
              onConsumptionSelect={handleConsumptionSelect}
              
              totalContractValue={totalContractValue}
              gstAmount={gstAmount}
              finalPrice={displayPrice}
              
              recommendedTankId={recommendedTankId}
              showPrices={showPrices}
              onResetConfiguration={resetConfiguration}
            />
          </div>
        </main>
      )}
    </div>
  );
};

export default App;
