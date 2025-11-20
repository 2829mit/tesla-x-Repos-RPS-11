
export interface PerformanceSpec {
  value: string;
  label: string;
}

export interface TrimOption {
  id: 'rwd' | 'lr' | 'lr-awd' | 'p-awd';
  name: string;
  drive: string;
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
  consumption: string;
}
