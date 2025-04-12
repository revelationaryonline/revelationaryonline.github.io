import { loadStripe, Stripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";

// Add this configuration at the top level
let stripeClient: Stripe | null = null;

const wpApiUrl = process.env.REACT_APP_WP_JSON_API_URL + '/revelationary/v1/stripe/api';

// Unified API call function to standardize requests to the Stripe proxy
const callStripeAPI = async (endpoint: string, data: any, email: string, method: 'GET' | 'POST' = 'POST') => {
  const wpToken = Cookies.get("wpToken");
  if (!wpToken) {
    throw new Error("Failed to get WordPress token");
  }

  // The Stripe proxy needs to know the endpoint regardless of method
  if (method === 'GET') {
    // For GET, use form-urlencoded via query parameters
    const params = new URLSearchParams();
    params.append('endpoint', endpoint);
    
    // Add parameters directly - Stripe doesn't expect a 'data' wrapper
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        // Append parameters directly without the 'data[]' wrapper
        params.append(key, String(value));
      });
    }
    
    const url = `${wpApiUrl}?${params.toString()}`;
    console.log('GET request URL:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
      }
    });

    if (!response.ok) {
      console.error('GET request failed:', await response.text());
      throw new Error(`Failed GET API call to ${endpoint}: ${response.status}`);
    }
    
    return response.json();
  } else {
    // For POST, use the API format expected by the WordPress proxy
    const response = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: endpoint,
        data: data
      })
    });

    if (!response.ok) {
      console.error('POST request failed:', await response.text());
      throw new Error(`Failed POST API call to ${endpoint}: ${response.status}`);
    }
    
    return response.json();
  }
};

// Initialize Stripe client
export const initializeStripe = async () => {
  if (!stripeClient) {
    stripeClient = await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
    );
  }
  return stripeClient;
};

// Define payment links for subscription plans (placeholder links)
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: "monthly_plan",
    paymentLink: "https://buy.stripe.com/eVa8zz47xccg0Ao5kk", // PROD
    // paymentLink: 'https://buy.stripe.com/test_8wM6rYaSs3kc2nmfYY', // TEST
    name: "Monthly",
    amount: 1.99,
    interval: "month",
    description: "Full access to all premium features",
  },
  YEARLY: {
    id: "yearly_plan",
    paymentLink: "https://buy.stripe.com/14kcPPfQf7W03MA3cd", // PROD
    // paymentLink: 'https://buy.stripe.com/test_eVaaIe2lWdYQ9PO8wx', // TEST
    name: "Yearly",
    amount: 19.99,
    interval: "year",
    description: "Full access to all premium features - 2 months free",
  },
};

// We use Stripe's test mode directly, no custom test mode needed
const TEST_MODE = false;

// Robust function to get or create a customer without duplicates
export const getOrCreateCustomer = async (email: string): Promise<string> => {
  try {
    // Use a proper GET request first to check for existing customer
    const customerData = await callStripeAPI('customers', { email: email }, email, 'GET');
    
    // Log what we found for debugging
    console.log('Checking for existing customer:', email, customerData);
    
    // If we found at least one customer with this email, use the first one
    if (customerData.data && customerData.data.length > 0) {
      const customerId = customerData.data[0].id;
      console.log('Found existing customer:', customerId);
      return customerId;
    }
    
    // If customer truly doesn't exist, create a new one
    console.log('Creating new customer for:', email);
    const newCustomerData = await callStripeAPI('customers', {
      email: email,
      metadata: { source: 'revelationary' }
    }, email, 'POST');
    
    console.log('Created new customer:', newCustomerData.id);
    return newCustomerData.id;
  } catch (error) {
    console.error('Error ensuring customer exists:', error);
    throw error;
  }
};

// Redirects to Stripe Checkout using direct payment links
export const redirectToPaymentLink = async (
  plan: "MONTHLY" | "YEARLY",
  userEmail: string
) => {
  try {
    // Check for existing active subscription first
    const existingSubscription = await getSubscriptionStatus(userEmail);
    if (existingSubscription.isActive) {
      window.location.href =
        window.location.origin + "/#/account?existing_subscription=true";
      return;
    }

    // Get or create customer first to ensure the user exists in Stripe
    const customerId = await getOrCreateCustomer(userEmail);

    // Store customer ID and email in localStorage for reference after redirect
    localStorage.setItem('stripeCustomerId', customerId);
    localStorage.setItem('userEmail', userEmail);

    // Get payment link from subscription plans configuration
    const paymentLink = SUBSCRIPTION_PLANS[plan].paymentLink;
    
    // Modify payment link to include success and cancel URLs
    const successUrl = encodeURIComponent(`${window.location.origin}/#/payment-success?email=${encodeURIComponent(userEmail)}`);
    const cancelUrl = encodeURIComponent(`${window.location.origin}/#/account?payment_error=true`);
    
    // Append success_url and cancel_url as query parameters to the payment link
    // Note: This only works if the Stripe payment link is configured to accept these parameters
    const checkoutUrl = `${paymentLink}?client_reference_id=${customerId}&prefilled_email=${encodeURIComponent(userEmail)}&success_url=${successUrl}&cancel_url=${cancelUrl}`;
    
    console.log('Redirecting to payment page:', checkoutUrl);
    
    // Redirect to the Stripe hosted checkout page
    window.location.href = checkoutUrl;
  } catch (error) {
    console.error("Error handling payment redirection:", error);
    window.location.href =
      window.location.origin + "/#/account?payment_error=true";
  }
};

// Function to get subscription ID from Stripe using email
export const getSubscriptionIdFromStripe = async (
  email: string
): Promise<string | null> => {
  try {
    const wpToken = Cookies.get("wpToken");

    if (!wpToken) {
      throw new Error("Failed to get WordPress token");
    }

    // Use the WordPress proxy to get customer ID
    const customerResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `endpoint=customers&data[email]=${encodeURIComponent(email)}`
    });

    if (!customerResponse.ok) {
      throw new Error('Failed to fetch customer');
    }

    const customerData = await customerResponse.json();
    const customerId = customerData.data[0]?.id;

    if (!customerId) {
      return null;
    }

    // Use the WordPress proxy to get subscriptions
    const subscriptionsResponse = await fetch(
      wpApiUrl,
      {
        method: "POST",
        headers: {
          'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `endpoint=subscriptions&data[customer]=${encodeURIComponent(customerId)}`
      }
    );

    if (!subscriptionsResponse.ok) {
      throw new Error("Failed to fetch subscriptions");
    }

    const subscriptionsData = await subscriptionsResponse.json();
    const activeSubscription = subscriptionsData.data.find(
      (s: any) => s.status === "active" || s.status === "trialing"
    );

    return activeSubscription?.id || null;
  } catch (error) {
    console.error("Error fetching subscription ID:", error);
    return null;
  }
};

// Create a safe storage key from email
export const getStorageKeyFromEmail = (email: string): string => {
  return `subscription_${email.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
};

// Define subscription state interface
export interface SubscriptionState {
  isActive: boolean;
  plan: string | null;
  expiresAt: string | null;
  subscriptionId: string | null;
}

// Verify subscription with Stripe using email
export const verifyStripeSubscription = async (
  email: string
): Promise<SubscriptionState> => {
  // Note: Once the backend is updated to include 'customers/search' in allowed_endpoints,
  // you can implement a more efficient version that gets everything in one request.
  // For now, use the getSubscriptionStatus function which works with currently allowed endpoints
  return getSubscriptionStatus(email);
};

// Consolidated subscription status checking using GET requests
export const getSubscriptionStatus = async (email: string): Promise<SubscriptionState> => {
  try {
    // Get customer with GET request
    const customerData = await callStripeAPI('customers', { email: email }, email, 'GET');
    
    // Debug log
    console.log('Customer lookup result:', customerData);
    
    if (!customerData.data || customerData.data.length === 0) {
      return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
    }
    
    const customerId = customerData.data[0].id;
    
    // Get subscriptions with GET request
    const subscriptionsData = await callStripeAPI('subscriptions', { customer: customerId }, email, 'GET');
    
    // Debug log
    console.log('Subscription lookup result:', subscriptionsData);
    
    const activeSubscription = subscriptionsData.data.find(
      (s: any) => s.status === 'active' || s.status === 'trialing'
    );
    
    if (!activeSubscription) {
      return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
    }
    
    const planType = activeSubscription.items.data[0].plan.interval === 'year'
      ? 'yearly'
      : 'monthly';
      
    return {
      isActive: true,
      plan: planType,
      expiresAt: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      subscriptionId: activeSubscription.id
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false, plan: null, expiresAt: null, subscriptionId: null };
  }
};

// Alias checkSubscriptionStatus to getSubscriptionStatus for backward compatibility
export const checkSubscriptionStatus = getSubscriptionStatus;

// Cancel subscription - Redirects to Stripe Customer Portal
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    // For testing mode
    if (TEST_MODE) {
      localStorage.removeItem("test_subscription");
      return { success: true };
    }

    // For production, use Stripe Customer Portal
    // This is the recommended approach by Stripe for handling subscription management
    // without exposing API keys in frontend code

    // Production implementation - redirect to Stripe Customer Portal
    // The URL below should be your live Stripe Customer Portal link
    const stripeCustomerPortalUrl =
      "https://billing.stripe.com/p/login/00g14P1th6YseVaaEE";

    // Open the portal in a new tab
    window.open(stripeCustomerPortalUrl, "_blank");

    // Return success with message that user was redirected
    return {
      success: true,
      redirected: true,
      message:
        "Redirected to Stripe Customer Portal for subscription management.",
    };
  } catch (error) {
    console.error("Error with subscription cancellation:", error);
    return {
      success: false,
      error:
        "Failed to open Stripe Customer Portal. Please try again or visit https://billing.stripe.com/p/login/00g14P1th6YseVaaEE directly.",
    };
  }
};
