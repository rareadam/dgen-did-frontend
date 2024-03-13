import { DidKeyRegistryAddress, DidKeyRegistryAbi } from "@/contracts";
import { Text, Card, Heading, List, ListItem, Stat, StatLabel, StatNumber, Box } from "@chakra-ui/react";
import { useReadContract } from "wagmi";
import AddKeyButton from "./AddKeyButton";
import RevokeKeyButton from "./RevokeKeyButton";

interface DidKeyProps {
    did: string;
}

const DidKeys: React.FC<DidKeyProps> = ({ did }) => {

    const didAddress = did.replace(/^did:de?gen:zksync:/, "");

    // check if didAddress is a valid eth address
    const isEthAddress = didAddress.match(/^0x[0-9a-fA-F]{40}$/);

    if (!isEthAddress) {
        return (
            <Card p="6" m="6" boxShadow="lg">
                <Heading mb="4" fontSize="2xl">DID Keys of {did}</Heading>
                <Text color="red.500">Invalid DID</Text>
            </Card>
        )
    }

    const { data: didKeys, isLoading: isLoadingDidKeys, isError: didKeysError, refetch } = useReadContract({
        address: DidKeyRegistryAddress,
        abi: DidKeyRegistryAbi,
        functionName: 'getKeys',
        args: [didAddress as `0x${string}`],
    });

    if (isLoadingDidKeys) return <Text>Loading keys...</Text>;

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">DID Keys of {did}</Heading>
            {didKeys && didKeys.length > 0 ? (
                <>
                    <List spacing={3}>
                        {didKeys.map((key, index) => (
                            <ListItem key={index}>
                                <Card border="1px solid" borderColor="gray.200" p="4" position="relative">
                                    <Box position="absolute" top="2" right="2">
                                        <RevokeKeyButton did={did} keyId={key.id} onRemoveKey={refetch} />
                                    </Box>
                                    <Stat>
                                        <StatLabel>Key ID</StatLabel>
                                        <StatNumber>{key.id}</StatNumber>
                                        <StatLabel>Public Key</StatLabel>
                                        <StatNumber>{key.publicKey}</StatNumber>
                                        <StatLabel>Key Usage</StatLabel>
                                        <StatNumber>{key.keyUsage}</StatNumber>
                                        <StatLabel>Key Type</StatLabel>
                                        <StatNumber>{key.keyType}</StatNumber>
                                    </Stat>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                    <AddKeyButton did={did} onAddKey={refetch} />
                </>
            ) : (
                <Text>No keys found for this DID.</Text>
            )}
        </Card>
    );
};

export default DidKeys;