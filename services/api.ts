
import { CustomerDetails, QuoteData } from "../types";

// Base URL for the Django Backend
// Ensure your Django server is running on port 8000
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Submits lead form data to the Django Backend
 * Payload: CustomerDetails
 */
export const submitLead = async (data: CustomerDetails): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    return { success: true, message: 'Lead submitted successfully' };
  } catch (error) {
    console.error('API Error submitting lead:', error);
    // Fallback for demo purposes if backend is not running
    if ((error as any).message?.includes('Failed to fetch')) {
        console.warn('Backend not reachable. Simulating success for demo.');
        return { success: true, message: 'Lead submitted (Offline Mode)' };
    }
    throw error;
  }
};

/**
 * Logs a quote generation event to the Django Backend
 * Payload: QuoteData (mapped to snake_case for backend)
 */
export const logQuoteGeneration = async (data: QuoteData): Promise<void> => {
  try {
    // Map camelCase frontend data to snake_case for Django
    const payload = {
      customer_details: data.customerDetails,
      payment_mode: data.paymentMode,
      configuration: data.configuration,
      total_price: data.totalPrice,
      monthly_price: data.monthlyPrice,
      gst_amount: data.gstAmount,
      total_contract_value: data.totalContractValue
    };

    const response = await fetch(`${API_BASE_URL}/quotes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to log quote');
    }
  } catch (error) {
    console.error('API Error logging quote:', error);
  }
};

/**
 * Authenticates a user
 * Note: For a real app, this should hit a JWT token endpoint (e.g., /api/token/)
 */
export const login = async (userId: string, password: string): Promise<{ success: boolean; role?: 'sales' | 'guest'; message?: string }> => {
  // Simulating login for now, as Auth setup requires more complex backend token handling
  // In a full implementation, call `${API_BASE_URL}/login/`
  return new Promise(resolve => {
    setTimeout(() => {
        if (userId === 'salesrepos' && password === 'Repos@123') {
            resolve({ success: true, role: 'sales' });
        } else {
            resolve({ success: false, message: 'Invalid credentials' });
        }
    }, 800);
  });
};
