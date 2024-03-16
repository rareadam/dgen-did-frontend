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

export function App() {
  const [did, setDid] = useState<string>("");

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
  const { didExists: connectedAccountHasDid, isLoading: connectedAccountHasDidLoading, refetch: refetchConnectedAccountHasDid } = useDidExists(`did:dgen:zksync:${address}`)

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

  const { didKeys, isLoading: isDidKeysLoading, error: didKeysError, refetch: refetchDidKeys } = useDidKeys(did);
  const { serviceAccounts, isLoading: isServiceAccountsLoading, error: serviceAccountsError, refetch: refetchServiceAccounts } = useDidServiceAccounts(did);
  const { didName, isLoading: isDidNameLoading, error: didNameError, refetch: refetchDidName } = useDidName(did);
  const { linkedAccounts, isLoading: isLinkedAccountsLoading, error: linkedAccountsError, refetch: refetchLinkedAccounts } = useDidLinkedAccounts(did);

  const onDidChange = (did: string) => {
    setDid(did);
    refetchDidKeys();
    refetchServiceAccounts();
    refetchDidName();
    refetchLinkedAccounts();
  };

  // check if current address is in the list of did keys
  useEffect(() => {
    if (!didKeys) {
      setDidFound(false);
      setWriteAccess(false);
      return;
    }
    if (didKeys.length > 0) {
      const hasWriteAccess = didKeys?.find((k) => k.publicKey === address?.toLowerCase() && k.keyUsage === '0xb9208574d39bc6b85a528191d39d983f3a0bc58ef7129343fde819f64f7268cd') !== undefined
      setWriteAccess(hasWriteAccess)
      setDidFound(true);
    } else {
      setDidFound(false);
      setWriteAccess(false);
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
        <Box w="90%" p="4">
          {didFound && <Heading as="h2" size="xl" textAlign={"center"}>
            {did}
          </Heading>}
          {isConnected && !connectedAccountHasDidLoading && !connectedAccountHasDid && <RegisterDidCard onSuccess={() => {
            refetchDidKeys();
            refetchConnectedAccountHasDid();
          }} />}
        </Box>
        <Box w="90%" p="4"> 
          <DgenName 
            did={did}
            name={didName}
            hasWriteAccess={writeAccess}
            error={didNameError}
            isLoading={isDidNameLoading}
            onUnregister={refetchDidName}
            onRegister={refetchDidName} />
        </Box>
        <Box w="90%" p="4">
          <DidKeysResponsive
            did={did} 
            didKeys={didKeys} 
            hasWriteAccess={writeAccess} 
            isLoading={isDidKeysLoading} 
            error={didKeysError} 
            onAddKey={refetchDidKeys}
            onRevokeKey={refetchDidKeys}
          />
        </Box>
        <Box w="90%" p="4">
          <ServiceAccounts 
            did={did} 
            serviceAccounts={serviceAccounts} 
            hasWriteAccess={writeAccess} 
            isLoading={isServiceAccountsLoading} 
            error={serviceAccountsError} 
            onAddServiceAccount={refetchServiceAccounts} 
            onRemoveServiceAccount={refetchServiceAccounts} 
          />
        </Box>
        <Box w="90%" p="4">
          <LinkedAccounts 
            did={did} 
            linkedAccounts={linkedAccounts} 
            hasWriteAccess={writeAccess} 
            isLoading={isLinkedAccountsLoading} 
            error={linkedAccountsError} 
            onAddLinkedAccount={refetchLinkedAccounts} 
            onRemoveLinkedAccount={refetchLinkedAccounts} 
          />
        </Box>

        <ConnectedOnly>
          {/* <Box w="90%" p="4">
            <DidRegistering />
          </Box> */}
          <Box w="90%" p="4">
            <ConnectedCard />
          </Box>
        </ConnectedOnly>
      </Flex>
      <Footer />
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

