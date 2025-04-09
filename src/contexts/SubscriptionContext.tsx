import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkSubscriptionStatus } from '../services/stripe';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Define the shape of our subscription state
interface SubscriptionState {
  isActive: boolean;
  plan: string | null;
  expiresAt: string | null;
  subscriptionId: string | null;
}

// Define the shape of our context
interface SubscriptionContextType {
  subscription: SubscriptionState;
  refreshStatus: () => Promise<void>;
  canUseComments: boolean;
  clearSubscriptionData: () => void;
}

// Create the context with default values
const SubscriptionContext = React.createContext<SubscriptionContextType>({
  subscription: {
    isActive: false,
    plan: null,
    expiresAt: null,
    subscriptionId: null
  },
  refreshStatus: async () => { console.log('Default refreshStatus - should be overridden by provider'); },
  canUseComments: false,
  clearSubscriptionData: () => { console.log('Default clearSubscriptionData - should be overridden by provider'); }
});

// Custom hook to use the context
export const useSubscription = () => {
  const context = React.useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Provider component
export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isActive: false,
    plan: null,
    expiresAt: null,
    subscriptionId: null
  });
  const navigate = useNavigate();

  // Function to clear all subscription data and redirect to login
  const clearSubscriptionData = () => {
    // Clear all subscription-related data from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const storageKey = `subscription_${userEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      localStorage.removeItem(storageKey);
    }
    localStorage.removeItem('user_subscription');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('is_test_subscription');
    
    // Clear cookies
    Cookies.remove('wpToken');
    Cookies.remove('userId');
    
    // Reset subscription state
    setSubscription({
      isActive: false,
      plan: null,
      expiresAt: null,
      subscriptionId: null
    });
    
    // Redirect to login page
    navigate('/login');
  };

  // Function to check subscription status
  const refreshStatus = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      // If no user email, clear data and redirect to login
      clearSubscriptionData();
      return;
    }

    try {
      const status = await checkSubscriptionStatus(userEmail);
      setSubscription(status);
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      // If there's an error checking subscription, clear data and redirect to login
      clearSubscriptionData();
    }
  };

  // Check subscription status on mount and whenever the route changes
  useEffect(() => {
    refreshStatus();
  }, []); // Run only once on mount

  // Derived state for premium features
  const canUseComments = subscription.isActive;

  const value = {
    subscription,
    refreshStatus,
    canUseComments,
    clearSubscriptionData
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
