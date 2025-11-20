
export interface PerformanceSpec {
  value: string;
  label: string;
}

// Renamed from TrimOption to RfidOption to match domain
export interface RfidOption {
  id: '1-active-reader' | '2-active-reader' | 'performance-test'; 
  name: string;
  drive: string; // Keeping 'drive' as a generic subtitle field for now, could be renamed to 'tagCapacity'
  price: number;
  financePerMonth: number;
  specs: PerformanceSpec[];
  imageUrl?: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
}

export interface IotOption {
  id: string;
  name: string;
  price: number;
  subtext: string;
  description?: string;
  imageUrl?: string;
}

export interface TankOption {
  id: string;
  name: string;
  price: number;
  dimensions?: string;
}

export interface LicenseOption {
  id: string;
  name: string;
  price: number;
  isCompulsory?: boolean;
  subtext?: string;
}

export interface DispensingUnitOption {
  id: string;
  name: string;
  subtext: string;
  price: number;
}

export interface SafetyUpgradeOption extends AccessoryOption {
  imageUrl: string;
  description?: string;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  email: string;
  company: string;
  industry: string;
  state: string;
  consumption: string;
}
