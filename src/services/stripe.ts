import { loadStripe, Stripe } from "@stripe/stripe-js";
import Cookies from "js-cookie";

// Add this configuration at the top level
let stripeClient: Stripe | null = null;

const wpApiUrl = process.env.REACT_APP_WP_JSON_API_URL + '/revelationary/v1/stripe/api';

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

// First, create a function to create or get a customer
export const getOrCreateCustomer = async (email: string): Promise<string> => {
  try {
    const wpToken = Cookies.get("wpToken");
    if (!wpToken) {
      throw new Error("Failed to get WordPress token");
    }

    // First try to get existing customer
    const customerResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'customers',
        data: {
          email: email
        }
      })
    });

    if (customerResponse.ok) {
      const customerData = await customerResponse.json();
      const customerId = customerData.data[0]?.id;
      if (customerId) {
        return customerId;
      }
    }

    // If no customer exists, create one
    const createResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'customers',
        data: {
          email: email,
          metadata: {
            source: 'revelationary'
          }
        }
      })
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create customer');
    }

    const createData = await createResponse.json();
    return createData.id;
  } catch (error) {
    console.error('Error getting/creating customer:', error);
    throw error;
  }
};

// Then modify redirectToPaymentLink to use Checkout Session
export const redirectToPaymentLink = async (
  plan: "MONTHLY" | "YEARLY",
  userEmail: string
) => {
  try {
    const existingSubscription = await checkSubscriptionStatus(userEmail);
    if (existingSubscription.isActive) {
      window.location.href =
        window.location.origin + "/account?existing_subscription=true";
      return;
    }

    const wpToken = Cookies.get("wpToken");
    if (!wpToken) {
      throw new Error("Failed to get WordPress token");
    }

    // Get or create customer first
    const customerId = await getOrCreateCustomer(userEmail);

    // Store customer ID in localStorage
    localStorage.setItem('stripeCustomerId', customerId);

    // Create Checkout Session
    const checkoutResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(userEmail + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'checkout/sessions',
        data: {
          customer: customerId,
          line_items: [{
            price: plan === 'MONTHLY' ? 'price_monthly' : 'price_yearly',
            quantity: 1
          }],
          mode: 'subscription',
          success_url: `${window.location.origin}/payment-success?email=${encodeURIComponent(userEmail)}`,
          cancel_url: `${window.location.origin}/account?payment_error=true`
        }
      })
    });

    if (!checkoutResponse.ok) {
      throw new Error('Failed to create checkout session');
    }

    const checkoutData = await checkoutResponse.json();
    window.location.href = checkoutData.url;
  } catch (error) {
    console.error("Error handling payment redirection:", error);
    window.location.href =
      window.location.origin + "/account?payment_error=true";
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
  try {
    const wpToken = Cookies.get("wpToken");

    if (!wpToken) {
      throw new Error("Failed to get WordPress token");
    }

    // Get both customer and subscriptions in one request
    const response = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'customers/search',
        data: {
          query: `email:"${email}"`,
          include: 'subscriptions'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer and subscriptions');
    }

    const data = await response.json();
    const customer = data.data[0];

    if (!customer) {
      return {
        isActive: false,
        plan: null,
        expiresAt: null,
        subscriptionId: null
      };
    }

    const activeSubscription = customer.subscriptions.data.find(
      (s: any) => s.status === "active" || s.status === "trialing"
    );

    if (!activeSubscription) {
      return {
        isActive: false,
        plan: null,
        expiresAt: null,
        subscriptionId: null
      };
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
    console.error("Error verifying subscription:", error);
    return {
      isActive: false,
      plan: null,
      expiresAt: null,
      subscriptionId: null
    };
  }
};

// Check subscription status by email - using existing relational data
export const checkSubscriptionStatus = async (email: string): Promise<SubscriptionState> => {
  try {
    const wpToken = Cookies.get('wpToken');
    if (!wpToken) {
      throw new Error('Failed to get WordPress token');
    }

    // Get customer ID
    const customerResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'customers',
        data: {
          email: email
        }
      })
    });

    if (!customerResponse.ok) {
      throw new Error('Failed to fetch customer');
    }

    const customerData = await customerResponse.json();
    const customerId = customerData.data[0]?.id;

    if (!customerId) {
      return {
        isActive: false,
        plan: null,
        expiresAt: null,
        subscriptionId: null
      };
    }

    // Get subscriptions
    const subscriptionsResponse = await fetch(wpApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(email + ':' + wpToken)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: 'subscriptions',
        data: {
          customer: customerId
        }
      })
    });

    if (!subscriptionsResponse.ok) {
      throw new Error('Failed to fetch subscriptions');
    }

    const subscriptionsData = await subscriptionsResponse.json();
    const activeSubscription = subscriptionsData.data.find(
      (s: any) => s.status === 'active' || s.status === 'trialing'
    );

    if (!activeSubscription) {
      return {
        isActive: false,
        plan: null,
        expiresAt: null,
        subscriptionId: null
      };
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
    return {
      isActive: false,
      plan: null,
      expiresAt: null,
      subscriptionId: null
    };
  }
};

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
