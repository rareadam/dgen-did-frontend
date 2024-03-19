import {
  Box,
  ChakraBaseProvider,
  Flex,
  Heading,
  Input
} from "@chakra-ui/react";

import theme from "./theme";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import LinkedAccounts from "./components/AccountLinking";
import ConnectedCard from "./components/ConnectedCard";
import DgenName from "./components/DgenName";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import RegisterDidCard from "./components/RegisterDidCard";
import ServiceAccounts from "./components/ServiceAccounts";
import { Web3Provider } from "./components/Web3Provider";
import { DidAccountLinkRegistryAbi, DidAccountLinkRegistryAddress, DidKeyRegistryAbi, DidKeyRegistryAddress, DidNameRegistryAbi, DidNameRegistryAddress } from "./contracts";
import useDidExists from "./hooks/useDidExists";
import useDidKeys from "./hooks/useDidKeys";
import useDidLinkedAccounts from "./hooks/useDidLinkedAccounts";
import useDidName from "./hooks/useDidName";
import useDidServiceAccounts from "./hooks/useDidServiceAccounts";
import DidKeysResponsive from "./components/DidKeys";
import PeekingPepe from "./components/PeekingPepe";

export function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <Web3Provider>
        <NavBar />
        <Main />
      </Web3Provider>
    </ChakraBaseProvider>
  );
}

function Main() {
  const { address, isConnected } = useAccount();
  const { didExists: connectedAccountHasDid, isLoading: connectedAccountHasDidLoading, refetch: refetchConnectedAccountHasDid } = useDidExists(`did:dgen:zksync:${address}`);

  let defaultDid = isConnected ? `did:dgen:zksync:${address}` : "";
  const queryParams = new URLSearchParams(window.location.search);
  const queryDid = queryParams.get('q');
  if (queryDid) {
    defaultDid = queryDid;
  }

  const [did, setDid] = useState<string>(defaultDid);

  useEffect(() => {
    if (isConnected) {
      setDid(`did:dgen:zksync:${address}`);
    }
  }, [address, isConnected]);

  const [writeAccess, setWriteAccess] = useState<boolean>(false);
  const [didFound, setDidFound] = useState<boolean>(false);

  const { didKeys, isLoading: isDidKeysLoading, error: didKeysError, refetch: refetchDidKeys } = useDidKeys(did);
  const { serviceAccounts, isLoading: isServiceAccountsLoading, error: serviceAccountsError, refetch: refetchServiceAccounts } = useDidServiceAccounts(did);
  const { didName, isLoading: isDidNameLoading, error: didNameError, refetch: refetchDidName } = useDidName(did);
  const { linkedAccounts, isLoading: isLinkedAccountsLoading, error: linkedAccountsError, refetch: refetchLinkedAccounts } = useDidLinkedAccounts(did);

  const onDidChange = (newDid: string) => {
    console.log({newDid});
    setDid(newDid);
    if (newDid === '0x0000000000000000000000000000000000000000') {
      setDidFound(false);
      return;
    }
  };

  useEffect(() => {
    console.log({didKeys})
    const hasWriteAccess = didKeys?.some((k) => k.publicKey === address?.toLowerCase() && k.keyUsages.includes('0xb9208574d39bc6b85a528191d39d983f3a0bc58ef7129343fde819f64f7268cd'));
    setWriteAccess(!!hasWriteAccess);
    setDidFound(!!didKeys?.length);
  }, [didKeys, address]);

  return (
    <Box >
      <DidSelector did={did} onDidChange={onDidChange} />
      <Flex
        direction={{ base: "row" }}
        wrap="wrap"
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <Box w="90%" p="4">
          {didFound && <Heading as="h2" size="xl" textAlign={"center"}>{did}</Heading>}
          {isConnected && !connectedAccountHasDidLoading && !connectedAccountHasDid && (
            <RegisterDidCard onSuccess={() => {
              refetchDidKeys();
              refetchConnectedAccountHasDid();
            }} />
          )}
        </Box>
        <CardBox>
          <DgenName
            did={did}
            name={didName}
            hasWriteAccess={writeAccess}
            error={didNameError}
            isLoading={isDidNameLoading}
            onUnregister={refetchDidName}
            onRegister={refetchDidName} />
        </CardBox>
        <CardBox>
          <DidKeysResponsive
            did={did}
            didKeys={didKeys}
            hasWriteAccess={writeAccess}
            isLoading={isDidKeysLoading}
            error={didKeysError}
            onAddKey={refetchDidKeys}
            onRevokeKey={refetchDidKeys}
          />
        </CardBox>
        <CardBox>
          <ServiceAccounts
            did={did}
            serviceAccounts={serviceAccounts}
            hasWriteAccess={writeAccess}
            isLoading={isServiceAccountsLoading}
            error={serviceAccountsError}
            onAddServiceAccount={refetchServiceAccounts}
            onRemoveServiceAccount={refetchServiceAccounts}
          />
        </CardBox>
        <CardBox>
          <LinkedAccounts
            did={did}
            linkedAccounts={linkedAccounts}
            hasWriteAccess={writeAccess}
            isLoading={isLinkedAccountsLoading}
            error={linkedAccountsError}
            onAddLinkedAccount={refetchLinkedAccounts}
            onRemoveLinkedAccount={refetchLinkedAccounts}
          />
        </CardBox>
        <ConnectedOnly>
          <CardBox>
            <ConnectedCard />
          </CardBox>
        </ConnectedOnly>
      </Flex>
      <Footer />
    </Box>
  );
}

function CardBox({ children }: { children: React.ReactNode }) {
  return (
  <Box w="90%" p="4">
    <PeekingPepe peekDuration={2000} averagePeekInterval={120000} standardDeviation={20000}>
      {children}
    </PeekingPepe>
  
  </Box>);
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

  useEffect(() => {
    if (didByName && didByName !== '0x0000000000000000000000000000000000000000') {
      console.log("DID found by name:", didByName);
      onDidChange(`did:dgen:zksync:${didByName}`);
    } else if (didByAccount) {
      console.log("DID found by account:", didByAccount);
      onDidChange(`did:dgen:zksync:${didByAccount}`);
    } else if (didByLookup && value.startsWith("did:")) {
      console.log("DID found by lookup and starts with 'did:'", value);
      onDidChange(value);
    } else if (didByLookup) {
      console.log("DID found by lookup:", value);
      onDidChange(`did:dgen:zksync:${value}`);
    } else {
      onDidChange('0x0000000000000000000000000000000000000000');
    }
  }, [didByName, didByAccount, didByLookup, value, onDidChange]);

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box w="80%" p="4">
        <Heading mb="4" fontSize="large">Search by DID, name or linked account</Heading>
        <Input 
          value={value}
          size="lg"
          fontSize={"3xl"}
          border="2px" // Makes the border of the input thick
          placeholder="Enter DID, name, or account"
          onChange={(e) => {
            setValue(e.target.value);
            refetchDidByName();
            refetchDidByAccount();
            refetchDidByLookup();
          }} 
        />
      </Box>
    </Flex>
  );
}

