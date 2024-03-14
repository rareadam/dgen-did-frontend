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

    // if (!isEthAddress) {
    //     return (
    //         <Card p="6" m="6" boxShadow="lg">
    //             <Heading mb="4" fontSize="2xl">DID Keys of {did}</Heading>
    //             <Text color="red.500">Invalid DID</Text>
    //         </Card>
    //     )
    // }

    const { data: didKeys, isLoading: isLoadingDidKeys, isError, error, refetch } = useReadContract({
        address: DidKeyRegistryAddress,
        abi: DidKeyRegistryAbi,
        functionName: 'getKeys',
        args: [didAddress as `0x${string}`],
    });

    // if (isLoadingDidKeys) return <Text>Loading keys...</Text>;

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">DID Keys</Heading>
            {isError && error && <Text>Error fetching keys: {error.message}</Text>}
            {isLoadingDidKeys && <Text>Loading keys...</Text>}
            {didKeys && didKeys.length > 0 ? (
                <>
                    <VStack spacing={4}>
                        <Table variant="simple" width="full">
                            <Thead>
                                <Tr>
                                    <Th fontSize="lg" width="20%">Key ID</Th>
                                    <Th fontSize="lg" width="20%">Public Key</Th>
                                    <Th fontSize="lg" width="20%">Key Usage</Th>
                                    <Th fontSize="lg" width="20%">Key Type</Th>
                                    {hasWriteAccess && <Th fontSize="lg" width="100%" textAlign="right">Revoke</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {didKeys.map((key, index) => (
                                    <Tr key={index}>
                                        <Td fontSize="md">{key.id}</Td>
                                        <Td fontSize="md">{key.publicKey}</Td>
                                        <Td fontSize="md">{key.keyUsage}</Td>
                                        <Td fontSize="md">{key.keyType}</Td>
                                        {hasWriteAccess && <Td fontSize="md" textAlign="right"><RevokeKeyButton did={did} keyId={key.id} onRemoveKey={refetch} /></Td>}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </VStack>
                    {hasWriteAccess && <AddKeyButton did={did} onAddKey={refetch} />}
                </>
            ) : (
                <Text color="gray.500">No keys found for this DID.</Text>
            )
            }
        </Card >
    );
};

export default DidKeys;