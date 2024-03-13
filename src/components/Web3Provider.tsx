import * as React from "react";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, zkSync, hardhat, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [/*mainnet,*/ hardhat, baseSepolia, zkSync],
    transports: {
      // RPC URL for each chain
      // [mainnet.id]: http(),
      [hardhat.id]: http(),
      [zkSync.id]: http(),
      [baseSepolia.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "DgenDID",

    // Optional App Info
    appDescription: "DgenDID is your Degen DID",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
