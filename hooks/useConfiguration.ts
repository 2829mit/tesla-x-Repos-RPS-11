import React, { useState, useMemo, useCallback } from 'react';
import { TANK_OPTIONS } from '../constants';
import { 
  TankOption, 
  AccessoryOption, 
  DispensingUnitOption, 
  SafetyUpgradeOption, 
  IotOption, 
  LicenseOption 
} from '../types';

export const useConfiguration = () => {
  const [paymentMode, setPaymentMode] = useState<'outright' | 'installments'>('installments');
  const [selectedTank, setSelectedTank] = useState<TankOption['id']>(TANK_OPTIONS[0].id);
  const [selectedReposOs, setSelectedReposOs] = useState<AccessoryOption[]>([]);
  const [selectedMechanical, setSelectedMechanical] = useState<AccessoryOption[]>([]);
  const [selectedDecantation, setSelectedDecantation] = useState<IotOption[]>([]);
  const [selectedDispensingUnits, setSelectedDispensingUnits] = useState<DispensingUnitOption[]>([]);
  const [selectedSafetyUnits, setSelectedSafetyUnits] = useState<AccessoryOption[]>([]);
  const [selectedSafetyUpgrades, setSelectedSafetyUpgrades] = useState<SafetyUpgradeOption[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<LicenseOption[]>([]);

  const toggleOption = useCallback(<T extends { id: string }>(
    option: T, 
    current: T[], 
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(prev => 
      prev.find(o => o.id === option.id)
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  }, []);

  const pricing = useMemo(() => {
    const tank = TANK_OPTIONS.find(t => t.id === selectedTank);
    const baseRate = tank?.price || 0;
    
    const addonRate = [
      ...selectedDispensingUnits,
      ...selectedReposOs,
      ...selectedMechanical,
      ...selectedDecantation,
      ...selectedSafetyUnits,
      ...selectedSafetyUpgrades,
      ...selectedLicenses
    ].reduce((sum, item) => sum + (item.price || 0), 0);

    const monthlyTotal = baseRate + addonRate;
    const contractValue = monthlyTotal * 36;
    const gst = contractValue * 0.18;
    const outrightTotal = contractValue + gst;

    return {
      monthlyTotal,
      contractValue,
      gst,
      outrightTotal,
      displayPrice: paymentMode === 'outright' ? outrightTotal : monthlyTotal
    };
  }, [
    selectedTank, selectedDispensingUnits, selectedReposOs, 
    selectedMechanical, selectedDecantation, selectedSafetyUnits, 
    selectedSafetyUpgrades, selectedLicenses, paymentMode
  ]);

  const reset = useCallback(() => {
    setSelectedTank(TANK_OPTIONS[0].id);
    setSelectedReposOs([]);
    setSelectedMechanical([]);
    setSelectedDecantation([]);
    setSelectedDispensingUnits([]);
    setSelectedSafetyUnits([]);
    setSelectedSafetyUpgrades([]);
    setPaymentMode('installments');
  }, []);

  return {
    state: {
      paymentMode,
      selectedTank,
      selectedReposOs,
      selectedMechanical,
      selectedDecantation,
      selectedDispensingUnits,
      selectedSafetyUnits,
      selectedSafetyUpgrades,
      selectedLicenses
    },
    actions: {
      setPaymentMode,
      setSelectedTank,
      toggleReposOs: (opt: AccessoryOption) => toggleOption(opt, selectedReposOs, setSelectedReposOs),
      toggleMechanical: (opt: AccessoryOption) => toggleOption(opt, selectedMechanical, setSelectedMechanical),
      toggleDecantation: (opt: IotOption) => toggleOption(opt, selectedDecantation, setSelectedDecantation),
      toggleDispensingUnit: (opt: DispensingUnitOption) => toggleOption(opt, selectedDispensingUnits, setSelectedDispensingUnits),
      toggleSafetyUnit: (opt: AccessoryOption) => toggleOption(opt, selectedSafetyUnits, setSelectedSafetyUnits),
      toggleSafetyUpgrade: (opt: SafetyUpgradeOption) => toggleOption(opt, selectedSafetyUpgrades, setSelectedSafetyUpgrades),
      reset
    },
    pricing
  };
};