// Stripe service for payment links and subscription management
import { loadStripe } from '@stripe/stripe-js';

// Define payment links for subscription plans (placeholder links)
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly_plan',
    paymentLink: 'https://buy.stripe.com/eVa8zz47xccg0Ao5kk', // PROD
    // paymentLink: 'https://buy.stripe.com/test_8wM6rYaSs3kc2nmfYY', // TEST
    name: 'Monthly',
    amount: 1.99,
    interval: 'month',
    description: 'Full access to all premium features'
  },
  YEARLY: {
    id: 'yearly_plan',
    paymentLink: 'https://buy.stripe.com/14kcPPfQf7W03MA3cd', // PROD
    // paymentLink: 'https://buy.stripe.com/test_eVaaIe2lWdYQ9PO8wx', // TEST
    name: 'Yearly',
    amount: 19.99,
    interval: 'year',
    description: 'Full access to all premium features - 2 months free'
  }
};

// We use Stripe's test mode directly, no custom test mode needed
const TEST_MODE = false;

// Redirect to the appropriate payment link
export const redirectToPaymentLink = (plan: 'MONTHLY' | 'YEARLY', userEmail: string) => {
  try {
    if (TEST_MODE) {
      console.log('TEST MODE: Simulating successful payment');
      // Store fake subscription data in localStorage for testing
      localStorage.setItem('test_subscription', JSON.stringify({
        isActive: true,
        subscriptionId: 'sub_test_' + Math.random().toString(36).substring(2, 15),
        plan: plan === 'YEARLY' ? 'yearly' : 'monthly',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }));
      
      // Redirect to success page 
      window.location.href = window.location.origin + '/account?subscription=success';
      return;
    }

    // Get the payment link URL
    const paymentLinkUrl = SUBSCRIPTION_PLANS[plan].paymentLink;
    
    // Append email parameter if needed
    const url = new URL(paymentLinkUrl);
    url.searchParams.append('prefilled_email', userEmail);
    
    // Redirect to the payment link
    window.location.href = url.toString();
  } catch (error) {
    console.error('Error redirecting to payment link:', error);
    throw error;
  }
};

// Create a safe storage key from email
export const getStorageKeyFromEmail = (email: string): string => {
  return `subscription_${email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
};

// Check subscription status by email - using existing relational data
export const checkSubscriptionStatus = async (userEmail: string) => {
  try {
    if (!userEmail) {
      console.warn('No email provided for subscription check');
      return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
    }
    
    // Create storage key based on email
    const storageKey = getStorageKeyFromEmail(userEmail);
    
    // Check for subscription in localStorage with email-based key
    const subscriptionData = localStorage.getItem(storageKey);
    if (subscriptionData) {
      try {
        const subscription = JSON.parse(subscriptionData);
        return {
          isActive: subscription.isActive,
          plan: subscription.plan,
          expiresAt: subscription.expiresAt,
          subscriptionId: subscription.subscriptionId
        };
      } catch (e) {
        console.error('Error parsing subscription data:', e);
      }
    }
    
    // Also check the old storage key for backward compatibility
    const oldSubscriptionData = localStorage.getItem('user_subscription');
    if (oldSubscriptionData) {
      try {
        const subscription = JSON.parse(oldSubscriptionData);
        // Migrate old data to new email-based key
        localStorage.setItem(storageKey, oldSubscriptionData);
        return {
          isActive: subscription.isActive,
          plan: subscription.plan,
          expiresAt: subscription.expiresAt,
          subscriptionId: subscription.subscriptionId
        };
      } catch (e) {
        console.error('Error parsing old subscription data:', e);
      }
    }

    // In production, would make an API call to your backend
    // The backend would use WordPress/Firebase user data and Stripe API 
    // to check subscription status by email
    
    // Example endpoint might be:
    // const response = await fetch('/wp-json/custom/v1/check-subscription', {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `JWT ${Cookies.get('wpToken')}`
    //   },
    //   body: JSON.stringify({ email: userEmail })
    // });
    // const data = await response.json();
    // return data;
    
    // For now, return inactive as default
    return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
  }
};

// Cancel subscription - Redirects to Stripe Customer Portal
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    // For testing mode
    if (TEST_MODE) {
      localStorage.removeItem('test_subscription');
      return { success: true };
    }

    // For production, use Stripe Customer Portal
    // This is the recommended approach by Stripe for handling subscription management
    // without exposing API keys in frontend code
    
    // Production implementation - redirect to Stripe Customer Portal
    // The URL below should be your live Stripe Customer Portal link
    const stripeCustomerPortalUrl = 'https://billing.stripe.com/p/login/00g14P1th6YseVaaEE';
    
    // Open the portal in a new tab
    window.open(stripeCustomerPortalUrl, '_blank');
    
    // Return success with message that user was redirected
    return { 
      success: true, 
      redirected: true,
      message: 'Redirected to Stripe Customer Portal for subscription management.'
    };
  } catch (error) {
    console.error('Error with subscription cancellation:', error);
    return { 
      success: false, 
      error: 'Failed to open Stripe Customer Portal. Please try again or visit https://billing.stripe.com/p/login/00g14P1th6YseVaaEE directly.'
    };
  }
};
