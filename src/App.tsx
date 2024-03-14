import {
  Box,
  Button,
  Card,
  ChakraBaseProvider,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Select,
  Spacer,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";

import theme from "./theme";

import { useAccount, useBalance, useBlockNumber, useChainId, useReadContract, useSwitchChain } from "wagmi";
import NavBar from "./components/NavBar";
import { Web3Provider } from "./components/Web3Provider";
import { DidKeyRegistryAbi, DidKeyRegistryAddress, DgenTokenAddress } from "./contracts";
import DidRegistering from "./components/DidRegistering";
import { erc20Abi } from "viem";
import { useEffect, useState } from "react";
import SendDgenToken from "./components/SendDgenToken";
import SendNativeToken from "./components/SendNativeToken";
import RevokeKeyButton from "./components/RevokeKeyButton";
import AddKeyButton from "./components/AddKeyButton";
import AllowanceButton from "./components/AllowanceButton";
import DidKeys from "./components/DidKeys";
import ServiceAccounts from "./components/ServiceAccounts";
import DgenName from "./components/DgenName";
import ConnectedCard from "./components/ConnectedCard";
import LinkedAccounts from "./components/AccountLinking";

export function App() {
  const [did, setDid] = useState<string>("");

  return (
    <ChakraBaseProvider theme={theme}>
      <Web3Provider>
        <NavBar />
        <ConnectedOnly>
          <Main />
        </ConnectedOnly>
      </Web3Provider>
    </ChakraBaseProvider>
  );
}

function Main() {
  const { address, isConnected } = useAccount();

  const [did, setDid] = useState<string>(`did:dgen:zksync:${address}`);
  useEffect(() => {
    setDid(`did:dgen:zksync:${address}`);
  }, [address]);

  const didAddress = did.replace(/^did:de?gen:zksync:/, "");

  return (
    <Box>
      <DidSelector did={did} onDidChange={setDid} />
      <Flex
        direction={{ base: "row" }}
        wrap="wrap"
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <Box w="80%" p="4">
          <DgenName did={did} />
        </Box>
        <Box w="80%" p="4">
          <DidKeys did={did} />
        </Box>
        <Box w="80%" p="4">
          <ServiceAccounts did={did} />
        </Box>
        <Box w="80%" p="4">
          <LinkedAccounts did={did} />
        </Box>

        <Box w="80%" p="4">
          <DidRegistering />
        </Box>
        <Box w="80%" p="4">
          <ConnectedCard />
        </Box>
      </Flex>
    </Box>
  )
}

interface ConnectedOnlyProps {
  children: React.ReactNode;
}

const ConnectedOnly: React.FC<ConnectedOnlyProps> = ({ children }) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  }

  return <>{children}</>;
};

interface DidSelectorProps {
  did: string;
  onDidChange: (did: string) => void;
}

function DidSelector({ did, onDidChange }: DidSelectorProps) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Box w="80%" p="4">
        <Heading mb="4" fontSize="large">Select a DID</Heading>
        <Input value={did} fontSize={"2xl"} onChange={(e) => {
          onDidChange(e.target.value);
        }} />
      </Box>
    </Flex>
  );
}

