
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
  { id: 'single-du', name: 'Single DU', subtext: '2 Nozzle with Active Readers', price: 0 }, 
  { id: 'basic-skid-dispensing', name: 'Basic Skid', subtext: '', price: 0 },
  // Removed Additional DU from here
  { id: 'filtration-mechanism', name: 'Filtration Mechanism', subtext: '', price: 0 },
  { id: 'flame-proof-illumination', name: 'Flame Proof Illumination', subtext: '', price: 0 },
  { id: 'glasswool-shield', name: 'Glasswool Shield', subtext: '', price: 0 },
];

export const REPOS_OS_OPTIONS: AccessoryOption[] = [
  { id: 'reports-analytics', name: 'Reports & Analytics', price: 0 },
  { id: 'operator-manager-apps', name: 'Operator & Manager Apps', price: 0 },
  { id: 'real-time-inventory', name: 'Real-time Fuel Level Inventory', price: 0 },
  { id: 'erp-integration', name: 'ERP Integration', price: 2999 }, 
];

export const DECANTATION_OPTIONS: IotOption[] = [
  { id: 'basic-skid', name: 'Basic Skid', subtext: 'Without Metering Counter', price: 0 },
];

export const MECHANICAL_INCLUSION_OPTIONS: AccessoryOption[] = [
  { 
    id: 'dual-walled-tank', 
    name: 'Dual Walled Tank', 
    price: 0,
    infoImageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764951511/Double_walled_tank_r7u9hb.png',
    description: 'Double-walled construction ensures zero leakage and provides an extra layer of environmental protection and safety compliance.'
  },
  { id: 'iso-certified-frame', name: 'ISO Certified Frame', price: 0 },
  { id: 'peso-manhole', name: 'PESO Approved Manhole Assembly', price: 0 },
  { id: 'weather-proof-canopy', name: 'Weather Proof Modular Canopy', price: 0 },
  { id: 'ss-pipeline', name: 'Stainless Steel Pipeline', price: 0 },
  { id: 'galvanized-surface', name: 'Rustfree Surface Treatment', price: 0 },
];

export const SAFETY_UNIT_OPTIONS: AccessoryOption[] = [
  { 
    id: 'fuel-level-sensors', 
    name: 'Fuel Level Sensors', 
    price: 0,
    infoImageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764951508/RATG_sensor_pe2a55.png',
    description: 'High-precision ATG (Automatic Tank Gauge) sensors for real-time fuel inventory monitoring and leak detection.'
  }, 
  {
    id: 'leak-detection-system',
    name: 'Leak Detection System',
    price: 0,
    infoImageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764177461/Screenshot_2025-11-26_224724_kbhepo.png',
    description: 'Precision sensors monitor double-walled tank integrity 24/7. Any breach triggers an immediate system alert.'
  },
  { 
    id: 'overfill-sensors', 
    name: 'Overfill Sensors', 
    price: 0,
    infoImageUrl: 'https://res.cloudinary.com/dt8jmqu8d/image/upload/v1764951500/Overfill_sensor_bfxzo6.png',
    description: 'Advanced safety sensors that automatically shut off the pump to prevent accidental overfilling during fuel replenishment.'
  },
  { id: 'iot-controller-safety', name: 'IOT Controller', price: 0 },
  { id: 'mobile-device', name: 'Wireless Synchronised Mobile', price: 0 },
];

export const SAFETY_UPGRADE_OPTIONS: SafetyUpgradeOption[] = [
  { 
    id: 'crash-barrier', 
    name: 'Crash Barrier', 
    price: 5499, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/3.png', 
    description: 'Reinforced protective barriers engineered to safeguard the station against vehicular impact and ensure operational safety.'
  },
  { 
    id: 'fire-suppression', 
    name: 'Fire Suppression System', 
    price: 2999, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/ShortPixelOptimized/2.png', 
    description: 'Safety-focused package featuring an integrated fire extinguisher for emergency situations.'
  },
  { 
    id: 'advanced-skid', 
    name: 'Advanced Skid', 
    price: 9999, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-7-10-Advanced%20Skid-%20Flowmeter-common-min.png',
    description: 'A Flow Meter is a high-precision instrument used to measure the volume of fuel being unloaded (decanted) into the station. It ensures accurate quantity verification, transparency, and prevents pilferage during the refilling process.'
  },
  { 
    id: 'backup-du', 
    name: 'Additional DU', 
    price: 4999, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-4-3-DU%20with%20rfid2-common-min.png',
    description: 'Standard Nozzle for additional dispensing requirements.'
  },
  { 
    id: 'sampling-kit', 
    name: 'Sampling Kit', 
    price: 0, 
    imageUrl: 'https://drf-media-data.s3.ap-south-1.amazonaws.com/compressor_aws/final/-6-4b-Filteration%20mechanism-option-common-min.png',
    description: 'Essential kit for fuel quality sampling and testing.'
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