import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import CarVisualizer from './components/CarVisualizer';
import Configurator from './components/Configurator';
import LeadFormModal from './components/LeadFormModal';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import ExplorePage from './components/ExplorePage';
import FaqPage from './components/FaqPage';
import ReposPayPage from './components/ReposPayPage';
import AboutUsPage from './components/AboutUsPage';
import ComparisonModal from './components/ComparisonModal';
import QuoteModal from './components/QuoteModal';
import { generateQuotePDF } from './utils/pdfGenerator';
import { logQuoteGeneration } from './services/api';
import type { AccessoryOption, IotOption, TankOption, DispensingUnitOption, SafetyUpgradeOption, CustomerDetails, LicenseOption, QuoteData } from './types';
import { 
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
  
  // Modal States
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const [paymentMode, setPaymentMode] = useState<'outright' | 'installments'>('installments');
  
  // Selected Tank - Base product remains selected
  const [selectedTank, setSelectedTank] = useState<TankOption['id']>(() => 
    TANK_OPTIONS[0]?.id || '22kl'
  );
  
  // Initialize all options as unselected
  const [isPlatformSelected, setIsPlatformSelected] = useState(false);
  const [viewPlatform, setViewPlatform] = useState(false); // Controls visualizer visibility for platform
  const [selectedReposOsOptions, setSelectedReposOsOptions] = useState<AccessoryOption[]>([]);
  const [selectedMechanicalInclusionOptions, setSelectedMechanicalInclusionOptions] = useState<AccessoryOption[]>([]);
  const [selectedDecantation, setSelectedDecantation] = useState<IotOption[]>([]);
  const [selectedDispensingUnits, setSelectedDispensingUnits] = useState<DispensingUnitOption[]>([]);
  const [selectedSafetyUnits, setSelectedSafetyUnits] = useState<AccessoryOption[]>([]);
  const [selectedSafetyUpgrades, setSelectedSafetyUpgrades] = useState<SafetyUpgradeOption[]>([]);
  const [selectedLicenseOptions, setSelectedLicenseOptions] = useState<LicenseOption[]>([]);

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
  
  const handleTankChange = (tankId: TankOption['id']) => {
    setSelectedTank(tankId);
    // Hide platform image when tank capacity is selected/changed, but keep it selected
    setViewPlatform(false);
  };

  const handlePlatformToggle = () => {
    const newState = !isPlatformSelected;
    setIsPlatformSelected(newState);
    setViewPlatform(newState);
  };

  const handleReposOsToggle = (option: AccessoryOption) => {
    setSelectedReposOsOptions(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleMechanicalInclusionToggle = (option: AccessoryOption) => {
    setViewPlatform(false);
    setSelectedMechanicalInclusionOptions(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleDecantationToggle = (option: IotOption) => {
    setViewPlatform(false);
    setSelectedDecantation(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleSafetyUnitToggle = (option: AccessoryOption) => {
    setViewPlatform(false);
    setSelectedSafetyUnits(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const handleSafetyUpgradeToggle = (option: SafetyUpgradeOption) => {
    setViewPlatform(false);
    setSelectedSafetyUpgrades(prev => {
      const exists = prev.find(o => o.id === option.id);
      if (!exists) {
        return [...prev, option];
      }
      return prev.filter(o => o.id !== option.id);
    });
  };

  const handleDispensingUnitToggle = (option: DispensingUnitOption) => {
    setViewPlatform(false);
    setSelectedDispensingUnits(prev => 
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const resetConfiguration = () => {
    setSelectedTank(TANK_OPTIONS[0]?.id || '22kl');
    setIsPlatformSelected(false);
    setViewPlatform(false);
    setSelectedReposOsOptions([]);
    setSelectedMechanicalInclusionOptions([]);
    setSelectedDecantation([]);
    setSelectedDispensingUnits([]);
    setSelectedSafetyUnits([]);
    setSelectedSafetyUpgrades([]);
    setSelectedLicenseOptions([]);
    setPaymentMode('installments');
  };

  const monthlyTotalPrice = useMemo(() => {
    const tank = TANK_OPTIONS.find(t => t.id === selectedTank);
    const tankPrice = tank ? tank.price : 0;

    let price = tankPrice;
    price += selectedDispensingUnits.reduce((sum, du) => sum + du.price, 0);
    price += selectedReposOsOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedMechanicalInclusionOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedDecantation.reduce((total, opt) => total + opt.price, 0);
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

  const handleQuoteSubmit = async (mobile: string, email: string) => {
    setIsQuoteModalOpen(false);

    const updatedCustomerDetails = {
      ...(customerDetails || {
        name: 'Guest User',
        company: '',
        industry: '',
        state: '',
        consumption: '',
        salesperson: ''
      }),
      mobile,
      email
    };

    const quoteData: QuoteData = {
      customerDetails: updatedCustomerDetails,
      paymentMode,
      totalPrice: displayPrice,
      gstAmount: gstAmount,
      totalContractValue: totalContractValue,
      monthlyPrice: paymentMode === 'installments' ? displayPrice : undefined,
      
      configuration: {
        tank: selectedTank,
        dispensingUnits: selectedDispensingUnits,
        decantation: selectedDecantation,
        accessories: {
          reposOs: selectedReposOsOptions,
          mechanical: selectedMechanicalInclusionOptions,
          safetyUnits: selectedSafetyUnits,
          safetyUpgrades: selectedSafetyUpgrades,
        },
        licenses: selectedLicenseOptions,
      }
    };

    await generateQuotePDF(quoteData);
    logQuoteGeneration(quoteData);
  };

  const handleEnterApp = () => {
    setCurrentView('app');
    setShowRoiCalculator(false);
  };

  if (currentView === 'landing') {
    return (
      <LandingPage 
        onEnterApp={handleEnterApp} 
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
        onNavigateToApp={handleEnterApp}
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
        onNavigateToApp={handleEnterApp}
        onAboutClick={() => setCurrentView('about')}
      />
    );
  }

  if (currentView === 'about') {
    return (
      <AboutUsPage
        onNavigateHome={() => setCurrentView('landing')}
        onNavigateToApp={handleEnterApp}
        onExploreClick={() => setCurrentView('explore')}
        onReposPayClick={() => setCurrentView('reposPay')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800 relative">
      {isLoginModalOpen && <LoginModal onLogin={handleLogin} />}
      {isLeadFormOpen && <LeadFormModal onSubmit={handleLeadFormClose} />}
      
      <Header 
        navItems={['Home']}
        onRoiClick={() => setShowRoiCalculator(true)} 
        onHomeClick={() => setShowRoiCalculator(false)}
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
              mechanicalOptions={selectedMechanicalInclusionOptions}
              dispensingUnits={selectedDispensingUnits}
              safetyUnits={selectedSafetyUnits}
              safetyUpgrades={selectedSafetyUpgrades}
              decantation={selectedDecantation}
              hasPlatform={viewPlatform}
            />
          </div>
          <div className="w-full lg:w-[400px] xl:w-[450px] lg:h-[calc(100vh-72px)] bg-white z-10 flex-shrink-0">
            <Configurator
              customerDetails={customerDetails}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              selectedTank={selectedTank}
              setSelectedTank={handleTankChange}
              isPlatformSelected={isPlatformSelected}
              onPlatformToggle={handlePlatformToggle}
              selectedReposOsOptions={selectedReposOsOptions}
              onReposOsToggle={handleReposOsToggle}
              selectedMechanicalInclusionOptions={selectedMechanicalInclusionOptions}
              onMechanicalInclusionToggle={handleMechanicalInclusionToggle}
              
              selectedDecantation={selectedDecantation}
              onDecantationToggle={handleDecantationToggle}
              
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
              
              onOpenComparison={() => setIsComparisonModalOpen(true)}
              onOpenQuote={() => setIsQuoteModalOpen(true)}
            />
          </div>
        </main>
      )}

      {isComparisonModalOpen && (
        <ComparisonModal onClose={() => setIsComparisonModalOpen(false)} showPrices={showPrices} />
      )}

      <QuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        onSubmit={handleQuoteSubmit}
        initialDetails={customerDetails}
      />
    </div>
  );
};

export default App;