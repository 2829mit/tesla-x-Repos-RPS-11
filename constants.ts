
import type { PerformanceSpec, IotOption, TankOption, AccessoryOption, DispensingUnitOption, SafetyUpgradeOption, LicenseOption } from './types';

// Removed static BASE_PRICE as it is now determined by the selected Tank
export const BASE_FINANCE_PER_MONTH = 0; // Not used in new logic

const commonSpecs: PerformanceSpec[] = [
  { value: '120L/m', label: 'Speed' },
  { value: '100%', label: 'Tracking' },
  { value: '24/7', label: 'Monitoring' },
];

// Renamed and Updated Dispensing Unit Options
export const DISPENSING_UNIT_OPTIONS: DispensingUnitOption[] = [
  { id: 'single-du', name: 'Single DU', subtext: '2 Nozzle 100 Tags', price: 0 }, 
  { id: 'backup-du', name: 'Additional DU', subtext: 'Standard Nozzle', price: 0 }, 
];

export const REPOS_OS_OPTIONS: AccessoryOption[] = [
  { id: 'reports-analytics', name: 'Reports & Analytics', price: 0 },
  { id: 'operator-manager-apps', name: 'Operator & Manager Apps', price: 0 },
  { id: 'real-time-inventory', name: 'Real-time Fuel Level Inventory', price: 0 },
  { id: 'erp-integration', name: 'ERP Integration', price: 0 }, 
];

export const DECANTATION_OPTIONS: IotOption[] = [
  { 
    id: 'advanced-skid', 
    name: 'Advanced Skid', 
    subtext: 'With Metering Counter', 
    price: 9999, 
    description: 'A Flow Meter is a high-precision instrument used to measure the volume of fuel being unloaded (decanted) into the station. It ensures accurate quantity verification, transparency, and prevents pilferage during the refilling process.'
  },
  { id: 'basic-skid', name: 'Basic Skid', subtext: 'Without Metering Counter', price: 0 },
];

export const MECHANICAL_INCLUSION_OPTIONS: AccessoryOption[] = [
  { id: 'dual-walled-tank', name: 'Dual Walled Tank', price: 0 },
  { id: 'peso-manhole', name: 'PESO Approved Manhole Assembly', price: 0 },
  { id: 'weather-proof-canopy', name: 'Weather Proof Modular Canopy', price: 0 },
  { id: 'ss-pipeline', name: 'Stainless Steel Pipeline', price: 0 },
  { id: 'galvanized-surface', name: 'Rustfree Surface Treatment', price: 0 },
  { id: 'filtration-mechanism', name: 'Filtration Mechanism', price: 0 },
  { id: 'flame-proof-illumination', name: 'Flame Proof Illumination', price: 0 },
  { id: 'glasswool-shield', name: 'Glasswool Shield', price: 0 },
];

export const SAFETY_UNIT_OPTIONS: AccessoryOption[] = [
  { id: 'iot-controller-safety', name: 'IOT Controller', price: 0 },
  { id: 'fuel-level-sensors', name: 'Fuel Level Sensors', price: 0 }, 
  { id: 'overfill-sensors', name: 'Overfill Sensors', price: 0 },
  { id: 'decantation-cutoff', name: 'Decantation Cutoff', price: 0 },
  { id: 'mobile-device', name: 'Wireless Synchronised Mobile', price: 0 },
];

export const SAFETY_UPGRADE_OPTIONS: SafetyUpgradeOption[] = [
  { 
    id: 'crash-barrier', 
    name: 'Crash Barrier', 
    price: 5499, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/2.png', 
    description: 'Reinforced protective barriers engineered to safeguard the station against vehicular impact and ensure operational safety.'
  },
  { 
    id: 'fire-suppression', 
    name: 'Fire Suppression System', 
    price: 2999, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/3.png', 
    description: 'Safety-focused package featuring an integrated fire extinguisher for emergency situations.'
  },
];

export const LICENSE_OPTIONS: LicenseOption[] = [
  { id: 'drawing-layout', name: 'Drawing Layout Creation', price: 0, subtext: 'Scope Repos' },
  { id: 'prior-approval', name: 'Prior Approval', price: 0, subtext: 'Scope Repos' },
  { id: 'dm-noc', name: 'DM NOC', price: 0, subtext: 'Scope Customer' },
  { id: 'final-grant', name: 'Final Grant Form 14', price: 0, subtext: 'Scope Repos' },
];

export const TANK_OPTIONS: TankOption[] = [
  { id: '22kl', name: '22KL', price: 99999, dimensions: '10.5 x 4.5 x 4.5 meters' },
  { id: '30kl', name: '30KL', price: 119999, dimensions: '12 x 4.5 x 4.5 meters' },
  { id: '45kl', name: '45KL', price: 129999, dimensions: '15 x 4.5 x 4.5 meters' },
  { id: '60kl', name: '60KL', price: 139999, dimensions: '18 x 4.5 x 4.5 meters' },
];

export const CONSUMPTION_OPTIONS: string[] = [
  '50-100KL',
  '100-200KL',
  '200-300KL',
  '300-1000KL',
];
