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
  VisuallyHiddenInput,
} from "@chakra-ui/react";

import theme from "./theme";

import { useAccount, useBalance, useBlockNumber, useChainId, useReadContract, useSwitchChain } from "wagmi";
import NavBar from "./components/NavBar";
import { Web3Provider } from "./components/Web3Provider";
import { DidKeyRegistryAbi, DidKeyRegistryAddress, DgenTokenAddress, DidNameRegistryAbi, DidNameRegistryAddress, DidAccountLinkRegistryAddress, DidAccountLinkRegistryAbi } from "./contracts";
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
        {/* <ConnectedOnly> */}
        <Main />
        {/* </ConnectedOnly> */}
      </Web3Provider>
    </ChakraBaseProvider>
  );
}

function Main() {
  const { address, isConnected } = useAccount();

  let defaultDid = `did:dgen:zksync:${address}`
  if (!isConnected) {
    defaultDid = ""
  }
  const queryParams = new URLSearchParams(window.location.search);
  const queryDid = queryParams.get('q');
  if (queryDid) {
    defaultDid = queryDid;
  }

  const [did, setDid] = useState<string>(defaultDid);

  // when initially connecting the app or switching accounts, update the current did
  useEffect(() => {
    setDid(`did:dgen:zksync:${address}`);
  }, [address]);

  const [writeAccess, setWriteAccess] = useState<boolean>(false);
  const [didFound, setDidFound] = useState<boolean>(false);

  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: didKeys, refetch: refetchDidKeys } = useReadContract({
    abi: DidKeyRegistryAbi,
    address: DidKeyRegistryAddress,
    functionName: "getKeys",
    args: [didAddress],
  });

  const onDidChange = (did: string) => {
    setDid(did);
    refetchDidKeys();
  };

  // check if current address is in the list of did keys
  useEffect(() => {
    if (!didKeys) {
      setDidFound(false);
      return;
    }
    if (didKeys.length > 0) {
      const hasWriteAccess = didKeys?.find((k) => k.publicKey === address?.toLowerCase() && k.keyUsage === '0xb9208574d39bc6b85a528191d39d983f3a0bc58ef7129343fde819f64f7268cd') !== undefined
      setWriteAccess(hasWriteAccess)
      setDidFound(true);
    } else {
      setDidFound(false);
    }
  }, [didKeys]);

  console.log(`write access: ${writeAccess}`, { didKeys, address });

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
          {didFound && <Heading as="h2" size="xl" textAlign={"center"}>
            {did}
          </Heading>}
          {!didFound && <Text color="gray.500" textAlign={"center"}>No DID found.</Text>}
        </Box>
        <Box w="80%" p="4">
          <DgenName did={did} hasWriteAccess={writeAccess} />
        </Box>
        <Box w="80%" p="4">
          <DidKeys did={did} hasWriteAccess={writeAccess} />
        </Box>
        <Box w="80%" p="4">
          <ServiceAccounts did={did} hasWriteAccess={writeAccess} />
        </Box>
        <Box w="80%" p="4">
          <LinkedAccounts did={did} hasWriteAccess={writeAccess} />
        </Box>

        <ConnectedOnly>
          <Box w="80%" p="4">
            <DidRegistering />
          </Box>
          <Box w="80%" p="4">
            <ConnectedCard />
          </Box>
        </ConnectedOnly>
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

  const [value, setValue] = useState<string>(did);

  const removeDidPrefix = (did: string) => did.replace(/^did:de?gen:zksync:/, "");

  const { data: didByName, refetch: refetchDidByName } = useReadContract({
    abi: DidNameRegistryAbi,
    address: DidNameRegistryAddress,
    functionName: "getDidForName",
    args: [value],
  });

  const { data: didByAccount, refetch: refetchDidByAccount } = useReadContract({
    abi: DidAccountLinkRegistryAbi,
    address: DidAccountLinkRegistryAddress,
    functionName: "getDidByLinkedAccount",
    args: [value as `0x${string}`],
  });

  const { data: didByLookup, refetch: refetchDidByLookup } = useReadContract({
    abi: DidKeyRegistryAbi,
    address: DidKeyRegistryAddress,
    functionName: "didExists",
    args: [removeDidPrefix(value) as `0x${string}`],
  });

  if (didByName) {
    onDidChange(`did:dgen:zksync:${didByName}`);
  }

  if (didByAccount) {
    onDidChange(`did:dgen:zksync:${didByAccount}`);
  }

  if (didByLookup) {
    if (value.startsWith("did:")) {
      onDidChange(value);
    } else {
      onDidChange(`did:dgen:zksync:${value}`);
    }
  }

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box w="80%" p="4">
        <Heading mb="4" fontSize="large">Search by DID, name or linked account</Heading>
        <Input value={value} fontSize={"2xl"} onChange={(e) => {
          setValue(e.target.value);
          refetchDidByName();
          refetchDidByAccount();
          refetchDidByLookup();
        }} />
      </Box>
    </Flex>
  );
}

