// /lib/thirdwebSetup.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export function initializeThirdwebSDK() {
  // Initialize the SDK on the desired chain
  const sdk = new ThirdwebSDK("ethereum"); // or any other supported chain

  return sdk;
}

export async function connectWallet(sdk) {
  try {
    const wallet = await sdk.wallet.connect();
    return wallet;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
}