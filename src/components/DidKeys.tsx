import { DidKeyRegistryAddress, DidKeyRegistryAbi } from "../contracts";
import { Text, Card, Heading, List, ListItem, Box, VStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useReadContract } from "wagmi";
import AddKeyButton from "./AddKeyButton";
import RevokeKeyButton from "./RevokeKeyButton";

interface DidKeyProps {
    did: string;
    hasWriteAccess?: boolean;
}

const DidKeys: React.FC<DidKeyProps> = ({ did, hasWriteAccess }) => {

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
                    <VStack spacing={4}>
                        <Table size="md">
                            <Thead>
                                <Tr>
                                    <Th>Key ID</Th>
                                    <Th>Public Key</Th>
                                    <Th>Key Usage</Th>
                                    <Th>Key Type</Th>
                                    {hasWriteAccess && <Th>Revoke</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {didKeys.map((key, index) => (
                                    <Tr>
                                        <Td>{key.id}</Td>
                                        <Td>{key.publicKey}</Td>
                                        <Td>{key.keyUsage}</Td>
                                        <Td>{key.keyType}</Td>
                                        {hasWriteAccess && <Td><RevokeKeyButton did={did} keyId={key.id} onRemoveKey={refetch} /></Td>}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </VStack>
                    {hasWriteAccess && <AddKeyButton did={did} onAddKey={refetch} />}
                </>
            ) : (
                <Text>No keys found for this DID.</Text>
            )
            }
        </Card >
    );
};

export default DidKeys;