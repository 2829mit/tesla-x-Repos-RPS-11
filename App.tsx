import React, { useState, useMemo } from 'react';
import Header from './components/Header.tsx';
import CarVisualizer from './components/CarVisualizer.tsx';
import Configurator from './components/Configurator.tsx';
import LeadFormModal from './components/LeadFormModal.tsx';
import type { PaintOption, WheelOption, InteriorOption, TrimOption, AccessoryOption, ChargingOption, AccessoryPackOption } from './types';
import { 
  PAINT_OPTIONS, 
  WHEEL_OPTIONS, 
  INTERIOR_OPTIONS, 
  TRIM_OPTIONS,
  DESTINATION_FEE,
  ORDER_FEE
} from './constants';

const App: React.FC = () => {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(true);
  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(TRIM_OPTIONS.find(t => t.id === 'p-awd') || TRIM_OPTIONS[0]);
  const [selectedPaint, setSelectedPaint] = useState<PaintOption>(PAINT_OPTIONS[0]);
  const [selectedWheels, setSelectedWheels] = useState<WheelOption>(WHEEL_OPTIONS[0]);
  const [selectedInterior, setSelectedInterior] = useState<InteriorOption>(INTERIOR_OPTIONS[0]);
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([]);
  const [selectedCharging, setSelectedCharging] = useState<ChargingOption[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<AccessoryPackOption[]>([]);
  const [visualizerView, setVisualizerView] = useState<'car' | 'wheels'>('car');
  const [recommendedTrimId, setRecommendedTrimId] = useState<TrimOption['id'] | null>(null);

  const handleLeadFormClose = (consumption?: string) => {
    setIsLeadFormOpen(false);
    if (consumption) {
      switch (consumption) {
        case '50-100KL':
          setRecommendedTrimId('rwd');
          break;
        case '100-200KL':
          setRecommendedTrimId('lr');
          break;
        case '200-300KL':
          setRecommendedTrimId('lr-awd');
          break;
        case '300-400KL':
          setRecommendedTrimId('p-awd');
          break;
        default:
          setRecommendedTrimId(null);
          break;
      }
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

  const vehiclePrice = useMemo(() => {
    let price = selectedTrim.price;
    price += selectedPaint.price;
    price += selectedWheels.price;
    price += selectedInterior.price;
    price += selectedAccessories.reduce((total, acc) => total + acc.price, 0);
    price += selectedCharging.reduce((total, charger) => total + charger.price, 0);
    price += selectedPacks.reduce((total, pack) => total + pack.price, 0);
    return price;
  }, [selectedTrim, selectedPaint, selectedWheels, selectedInterior, selectedAccessories, selectedCharging, selectedPacks]);

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
            visualizerView={visualizerView}
          />
        </div>
        <div className="lg:w-1/4 w-full lg:h-[calc(100vh-72px)]">
          <Configurator
            selectedTrim={selectedTrim}
            setSelectedTrim={setSelectedTrim}
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
            vehiclePrice={vehiclePrice}
            destinationFee={DESTINATION_FEE}
            orderFee={ORDER_FEE}
            finalPrice={finalPrice}
            setVisualizerView={setVisualizerView}
            recommendedTrimId={recommendedTrimId}
          />
        </div>
      </main>
    </div>
  );
};

export default App;