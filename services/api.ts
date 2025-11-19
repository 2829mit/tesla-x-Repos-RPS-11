
import { CustomerDetails, TrimOption, TankOption, AccessoryOption, DispensingUnitOption, IotOption, WarrantyOption, SafetyUpgradeOption, LicenseOption } from "../types";

// In a real production build, this would be an environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.reposenergy.com/v1';

/**
 * Simulates an API call delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface QuoteData {
  customerDetails: CustomerDetails | null;
  configuration: {
    trim: TrimOption;
    tank: TankOption['id'];
    dispensingUnit: DispensingUnitOption;
    decantation: IotOption;
    accessories: {
      fuelLevel: AccessoryOption;
      reposOs: AccessoryOption[];
      mechanical: AccessoryOption[];
      safetyUnits: AccessoryOption[];
      safetyUpgrades: SafetyUpgradeOption[];
    };
    licenses: LicenseOption[];
    warranty: WarrantyOption;
  };
  totalPrice: number;
}

/**
 * Submits lead form data to the backend CRM or Database
 */
export const submitLead = async (data: CustomerDetails): Promise<{ success: boolean; message: string }> => {
  try {
    // PRODUCTION CODE:
    // const response = await fetch(`${API_BASE_URL}/leads`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Failed to submit lead');
    // return await response.json();

    // SIMULATION:
    console.log('API: Submitting lead...', data);
    await delay(1500); // Simulate network latency
    return { success: true, message: 'Lead submitted successfully' };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Logs a quote generation event for analytics
 */
export const logQuoteGeneration = async (data: QuoteData): Promise<void> => {
  try {
    // PRODUCTION CODE:
    // navigator.sendBeacon(`${API_BASE_URL}/quotes/log`, JSON.stringify(data));

    // SIMULATION:
    console.log('API: Logging quote generation...', data);
  } catch (error) {
    // Non-blocking error logging
    console.error('Failed to log quote', error);
  }
};