
import type { PerformanceSpec, TrimOption, IotOption, TankOption, WarrantyOption, AccessoryOption, DispensingUnitOption, SafetyUpgradeOption, LicenseOption } from './types';

export const BASE_PRICE = 3500000;
export const BASE_FINANCE_PER_MONTH = 48000;

const commonSpecs: PerformanceSpec[] = [
  { value: '120L/m', label: 'Speed' },
  { value: '100%', label: 'Tracking' },
  { value: '24/7', label: 'Monitoring' },
];

export const TRIM_OPTIONS: TrimOption[] = [
  { 
    id: 'rwd', 
    name: '3 RFID Nozzle', 
    drive: '150 tags', 
    price: 60000, 
    financePerMonth: 0,
    specs: commonSpecs,
    imageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010429/15_a79ols.png',
  },
  { 
    id: 'lr', 
    name: '1 RFID Nozzle', 
    drive: '50 Tags', 
    price: 30000, 
    financePerMonth: 7000,
    specs: commonSpecs,
    imageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1763010390/14_sdtrkr.png',
  },
  { 
    id: 'lr-awd', 
    name: '2 RFID Nozzle', 
    drive: '100 Tags', 
    price: 50000, 
    financePerMonth: 12000,
    specs: commonSpecs,
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/Entire+RPS.png',
  },
  { 
    id: 'p-awd', 
    name: 'Performance', 
    drive: 'All-Wheel Drive', 
    price: 1700000, 
    financePerMonth: 23000,
    specs: [
      { value: '321mi', label: 'Range (EPA est.)' },
      { value: '125mph', label: 'Top Speed' },
      { value: '6.8sec', label: '0-60 mph' },
    ]
  },
];

export const DISPENSING_UNIT_OPTIONS: DispensingUnitOption[] = [
  { id: 'single-du', name: 'Single DU', subtext: '2 Nozzle', price: 50000 },
  { id: 'double-du', name: 'Double DU', subtext: '3 Nozzle', price: 60000 },
];

export const FUEL_LEVEL_TECHNOLOGY_OPTIONS: AccessoryOption[] = [
  { id: 'ultrasonic-sensor', name: 'Ultrasonic Sensor', price: 0 },
  { id: 'capacitive-sensor', name: 'Capacitive Sensor', price: 0 },
];

export const REPOS_OS_OPTIONS: AccessoryOption[] = [
  { id: 'reports-analytics', name: 'Reports & Analytics', price: 0 },
  { id: 'operator-manager-apps', name: 'Operator & Manager Apps', price: 0 },
  { id: 'real-time-inventory', name: 'Real-time Fuel Level Inventory', price: 0 },
  { id: 'erp-integration', name: 'ERP Integration', price: 30000 },
];

export const DECANTATION_OPTIONS: IotOption[] = [
  { 
    id: 'advanced-skid', 
    name: 'Advanced Skid', 
    subtext: 'With Flow Meter', 
    price: 25000,
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
  { id: 'leak-detection', name: 'PESO Approved', price: 0 },
  { id: 'overfill-sensors', name: 'Overfill Sensors', price: 0 },
  { id: 'decantation-cutoff', name: 'Decantation Cutoff', price: 0 },
  { id: 'flame-proof-illumination', name: 'Flame Proof Illumination', price: 0 },
  { id: 'glasswool-shield', name: 'Glasswool Shield', price: 0 },
  { id: 'bollard-barriers', name: 'Bollard Barriers', price: 4999 },
  { id: 'surveillance-camera', name: 'Surveillance Camera', price: 12999 },
  { id: 'mobile-device', name: 'Wireless Synchronised Mobile', price: 20000 },
];

export const SAFETY_UPGRADE_OPTIONS: SafetyUpgradeOption[] = [
  { 
    id: 'fire-suppression', 
    name: 'Fire Suppression System', 
    price: 280000,
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/3.png',
    description: 'Safety-focused package featuring an integrated fire extinguisher for emergency situations.'
  },
  { 
    id: 'crash-barrier', 
    name: 'Crash Barrier', 
    price: 350000,
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/2.png',
    description: 'Reinforced protective barriers engineered to safeguard the station against vehicular impact and ensure operational safety.'
  },
];

export const LICENSE_OPTIONS: LicenseOption[] = [
  { id: 'drawing-layout', name: 'Drawing Layout Creation', price: 0, subtext: 'Scope Repos' },
  { id: 'prior-approval', name: 'Prior Approval', price: 0, subtext: 'Scope Repos' },
  { id: 'dm-noc', name: 'DM NOC', price: 0, subtext: 'Scope Customer' },
  { id: 'final-grant', name: 'Final Grant', price: 0, subtext: 'Scope Customer' },
];

export const TANK_OPTIONS: TankOption[] = [
  { id: '22kl', name: '22KL' },
  { id: '30kl', name: '30KL' },
  { id: '45kl', name: '45KL' },
  { id: '60kl', name: '60KL' },
];

export const CONSUMPTION_OPTIONS: string[] = [
  '50-100KL',
  '100-200KL',
  '200-300KL',
  '300-1000KL',
];

export const WARRANTY_OPTIONS: WarrantyOption[] = [
  { id: 'standard-1-year', name: 'Standard 1 Year', price: 0 },
  { id: 'extended-1-year', name: 'Extended 1 Year', price: 25000 },
  { id: 'extended-2-year', name: 'Extended 2 Year', price: 30000 },
];
