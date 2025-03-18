import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkSubscriptionStatus } from '../services/stripe';
import Cookies from 'js-cookie';
import { getAuth } from 'firebase/auth';

// Define the shape of our subscription state
interface SubscriptionState {
  isActive: boolean;
  plan: string | null;
  expiresAt: string | null;
  subscriptionId: string | null;
}

// Define the context interface
interface SubscriptionContextType {
  subscription: SubscriptionState;
  refreshStatus: () => Promise<void>;
  canUseComments: boolean;
}

// Create the context with default values
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: {
    isActive: false,
    plan: null,
    expiresAt: null,
    subscriptionId: null
  },
  refreshStatus: async () => { console.log('Default refreshStatus - should be overridden by provider'); },
  canUseComments: false
});

// Export a hook for using this context
export const useSubscription = () => useContext(SubscriptionContext);

// Provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isActive: false,
    plan: null,
    expiresAt: null,
    subscriptionId: null
  });

  // Function to check subscription status
  const refreshStatus = async () => {
    const userEmail = getUserEmail();
    if (!userEmail) {
      setSubscription({
        isActive: false,
        plan: null,
        expiresAt: null,
        subscriptionId: null
      });
      return;
    }

    try {
      const status = await checkSubscriptionStatus(userEmail);
      setSubscription(status);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
    }
  };

  // Helper to get user email from auth
  const getUserEmail = () => {
    // Get email from Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user && user.email) {
      // Store in localStorage as fallback for easier testing
      localStorage.setItem('userEmail', user.email);
      return user.email;
    }
    
    // Fallback to localStorage if Firebase auth is not available
    // This helps with testing and persistence between page refreshes
    return localStorage.getItem('userEmail') || null;
  };

  // Check subscription status on mount
  useEffect(() => {
    refreshStatus();
    // Set up periodic refresh (optional)
    const interval = setInterval(refreshStatus, 60 * 60 * 1000); // refresh every hour
    return () => clearInterval(interval);
  }, []);

  // Derived state for premium features
  const canUseComments = subscription.isActive;

  // Context value
  const value = {
    subscription,
    refreshStatus,
    canUseComments
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
