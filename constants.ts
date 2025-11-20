
import type { PerformanceSpec, RfidOption, IotOption, TankOption, AccessoryOption, DispensingUnitOption, SafetyUpgradeOption, LicenseOption } from './types';

// Removed static BASE_PRICE as it is now determined by the selected Tank
export const BASE_FINANCE_PER_MONTH = 0; // Not used in new logic

const commonSpecs: PerformanceSpec[] = [
  { value: '120L/m', label: 'Speed' },
  { value: '100%', label: 'Tracking' },
  { value: '24/7', label: 'Monitoring' },
];

// Prices are now MONTHLY prices
export const RFID_OPTIONS: RfidOption[] = [
  { 
    id: '1-active-reader', // Was 'lr'
    name: '1 RFID Active Reader', 
    drive: '50 Tags', 
    price: 4999, 
    financePerMonth: 0,
    specs: commonSpecs,
    imageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010390/14_sdtrkr.png',
  },
  { 
    id: '2-active-reader', // Was 'lr-awd'
    name: '2 RFID Active Reader', 
    drive: '100 Tags', 
    price: 9999, 
    financePerMonth: 0,
    specs: commonSpecs,
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
  },
  { 
    id: 'performance-test', // Was 'p-awd'
    name: 'Performance', 
    drive: 'All-Wheel Drive', 
    price: 50000, 
    financePerMonth: 0,
    specs: [
      { value: '321mi', label: 'Range (EPA est.)' },
      { value: '125mph', label: 'Top Speed' },
      { value: '6.8sec', label: '0-60 mph' },
    ]
  },
];

export const DISPENSING_UNIT_OPTIONS: DispensingUnitOption[] = [
  { id: 'single-du', name: 'Single DU', subtext: '2 Nozzle', price: 0 }, 
  { id: 'double-du', name: 'Double DU', subtext: '3 Nozzle', price: 4999 }, 
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
    subtext: 'With Flow Meter', 
    price: 9999, 
    description: 'A Flow Meter is a high-precision instrument used to measure the volume of fuel being unloaded (decanted) into the station. It ensures accurate quantity verification, transparency, and prevents pilferage during the refilling process.'
  },
  { id: 'basic-skid', name: 'Basic Skid', subtext: 'Already Included', price: 0 },
];

export const MECHANICAL_INCLUSION_OPTIONS: AccessoryOption[] = [
  { id: 'dual-walled-tank', name: 'Dual Walled Tank', price: 0 },
  { id: 'peso-manhole', name: 'PESO Approved Manhole Assembly', price: 0 },
  { id: 'weather-proof-canopy', name: 'Weather Proof Modular Canopy', price: 0 },
  { id: 'ss-pipeline', name: 'Stainless Steel Pipeline', price: 0 },
  { id: 'galvanized-surface', name: 'Rustfree Surface Treatment', price: 0 },
  { id: 'filtration-mechanism', name: 'Filtration Mechanism', price: 0 },
];

export const SAFETY_UNIT_OPTIONS: AccessoryOption[] = [
  { id: 'iot-controller-safety', name: 'IOT Controller', price: 0 },
  { id: 'fuel-level-sensors', name: 'Fuel Level Sensors', price: 0 }, 
  { id: 'leak-detection', name: 'PESO Approved', price: 0 },
  { id: 'overfill-sensors', name: 'Overfill Sensors', price: 0 },
  { id: 'decantation-cutoff', name: 'Decantation Cutoff', price: 0 },
  { id: 'flame-proof-illumination', name: 'Flame Proof Illumination', price: 0 },
  { id: 'glasswool-shield', name: 'Glasswool Shield', price: 0 },
  { id: 'mobile-device', name: 'Wireless Synchronised Mobile', price: 0 },
];

export const SAFETY_UPGRADE_OPTIONS: SafetyUpgradeOption[] = [
  { 
    id: 'fire-suppression', 
    name: 'Fire Suppression System', 
    price: 2999, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/3.png', 
    description: 'Safety-focused package featuring an integrated fire extinguisher for emergency situations.'
  },
  { 
    id: 'crash-barrier', 
    name: 'Crash Barrier', 
    price: 5499, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/2.png', 
    description: 'Reinforced protective barriers engineered to safeguard the station against vehicular impact and ensure operational safety.'
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
