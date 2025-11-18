import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header.tsx';
import CarVisualizer from './components/CarVisualizer.tsx';
import Configurator from './components/Configurator.tsx';
import LeadFormModal from './components/LeadFormModal.tsx';
import type { PaintOption, WheelOption, InteriorOption, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption, IotOption, TankOption, WarrantyOption } from './types';
import { 
  PAINT_OPTIONS, 
  WHEEL_OPTIONS, 
  INTERIOR_OPTIONS, 
  TRIM_OPTIONS,
  DESTINATION_FEE,
  ORDER_FEE,
  BASE_PRICE,
  DECANTATION_OPTIONS,
  REPOS_OS_OPTIONS,
  WARRANTY_OPTIONS
} from './constants';

const App: React.FC = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(true);
  const [selectedTrim, setSelectedTrim] = useState<TrimOption | null>(null);
  const [selectedTank, setSelectedTank] = useState<TankOption['id'] | null>(null);
  const [selectedPaint, setSelectedPaint] = useState<PaintOption | null>(null);
  const [selectedWheels, setSelectedWheels] = useState<WheelOption | null>(null);
  const [selectedInterior, setSelectedInterior] = useState<InteriorOption | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([]);
  const [selectedCharging, setSelectedCharging] = useState<ChargingOption[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<AccessoryPackOption[]>([]);
  const [selectedIotOptions, setSelectedIotOptions] = useState<IotOption[]>([]);
  const [selectedReposOsOptions, setSelectedReposOsOptions] = useState<AccessoryOption[]>([]);
  const [selectedDecantation, setSelectedDecantation] = useState<IotOption>(DECANTATION_OPTIONS.find(o => o.price === 0)!);
  const [selectedSafetyUnits, setSelectedSafetyUnits] = useState<AccessoryOption[]>([]);
  const [selectedWarrantyOption, setSelectedWarrantyOption] = useState<WarrantyOption>(WARRANTY_OPTIONS.find(o => o.price === 0)!);
  const [selectedConsumption, setSelectedConsumption] = useState<string | null>(null);
  const [visualizerView, setVisualizerView] = useState<'car' | 'wheels'>('car');
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


  const handleLeadFormClose = (consumption?: string) => {
    setIsLeadFormOpen(false);
    if (consumption) {
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
        case '300-400KL':
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

  const handleAccessoryToggle = (accessory: AccessoryOption) => {
    setSelectedAccessories(prev =>
      prev.find(a => a.id === accessory.id)
        ? prev.filter(a => a.id !== accessory.id)
        : [...prev, accessory]
    );
  };

  const handleChargingToggle = (charger: ChargingOption) => {
    setSelectedCharging(prev =>
      prev.find(c => c.id === charger.id)
        ? prev.filter(c => c.id !== charger.id)
        : [...prev, charger]
    );
  };

  const handlePackToggle = (pack: AccessoryPackOption) => {
    setSelectedPacks(prev =>
      prev.find(p => p.id === pack.id)
        ? prev.filter(p => p.id !== pack.id)
        : [...prev, pack]
    );
  };

  const handleIotToggle = (option: IotOption) => {
    setSelectedIotOptions(prev =>
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

  const handleSafetyUnitToggle = (option: AccessoryOption) => {
    setSelectedSafetyUnits(prev =>
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const vehiclePrice = useMemo(() => {
    let price = BASE_PRICE + (selectedTrim?.price ?? 0);
    price += selectedPaint?.price ?? 0;
    price += selectedWheels?.price ?? 0;
    price += selectedInterior?.price ?? 0;
    price += selectedAccessories.reduce((total, acc) => total + acc.price, 0);
    price += selectedCharging.reduce((total, charger) => total + charger.price, 0);
    price += selectedPacks.reduce((total, pack) => total + pack.price, 0);
    price += selectedIotOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedReposOsOptions.reduce((total, opt) => total + opt.price, 0);
    price += selectedDecantation?.price ?? 0;
    price += selectedSafetyUnits.reduce((total, unit) => total + unit.price, 0);
    price += selectedWarrantyOption?.price ?? 0;
    return price;
  }, [selectedTrim, selectedPaint, selectedWheels, selectedInterior, selectedAccessories, selectedCharging, selectedPacks, selectedIotOptions, selectedReposOsOptions, selectedDecantation, selectedSafetyUnits, selectedWarrantyOption]);

  const finalPrice = vehiclePrice + DESTINATION_FEE + ORDER_FEE;

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-800">
      {isLeadFormOpen && <LeadFormModal onSubmit={handleLeadFormClose} />}
      <Header />
      <main className="flex flex-col lg:flex-row">
        <div className="lg:w-3/4 w-full lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px]">
          <CarVisualizer 
            paint={selectedPaint} 
            trim={selectedTrim}
            tank={selectedTank}
            packs={selectedPacks}
            visualizerView={visualizerView}
          />
        </div>
        <div className="lg:w-1/4 w-full lg:h-[calc(100vh-72px)]">
          <Configurator
            selectedTrim={selectedTrim}
            setSelectedTrim={setSelectedTrim}
            selectedTank={selectedTank}
            setSelectedTank={setSelectedTank}
            selectedPaint={selectedPaint}
            setSelectedPaint={setSelectedPaint}
            selectedWheels={selectedWheels}
            setSelectedWheels={setSelectedWheels}
            selectedInterior={selectedInterior}
            setSelectedInterior={setSelectedInterior}
            selectedAccessories={selectedAccessories}
            onAccessoryToggle={handleAccessoryToggle}
            selectedCharging={selectedCharging}
            onChargingToggle={handleChargingToggle}
            selectedPacks={selectedPacks}
            onPackToggle={handlePackToggle}
            selectedIotOptions={selectedIotOptions}
            onIotToggle={handleIotToggle}
            selectedReposOsOptions={selectedReposOsOptions}
            onReposOsToggle={handleReposOsToggle}
            selectedDecantation={selectedDecantation}
            setSelectedDecantation={setSelectedDecantation}
            selectedSafetyUnits={selectedSafetyUnits}
            onSafetyUnitToggle={handleSafetyUnitToggle}
            selectedWarrantyOption={selectedWarrantyOption}
            setSelectedWarrantyOption={setSelectedWarrantyOption}
            selectedConsumption={selectedConsumption}
            onConsumptionSelect={handleConsumptionSelect}
            vehiclePrice={vehiclePrice}
            destinationFee={DESTINATION_FEE}
            orderFee={ORDER_FEE}
            finalPrice={finalPrice}
            setVisualizerView={setVisualizerView}
            recommendedTankId={recommendedTankId}
          />
        </div>
      </main>
    </div>
  );
};

export default App;