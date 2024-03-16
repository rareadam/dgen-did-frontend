import { Text, Card, Heading, List, ListItem, Box, VStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import AddKeyButton from "./AddKeyButton";
import RevokeKeyButton from "./RevokeKeyButton";
import type { DidKey } from "../hooks/useDidKeys";

interface DidKeyProps {
    did: string;
    hasWriteAccess?: boolean;
    didKeys: readonly DidKey[] | undefined;
    isLoading: boolean;
    error: Error | null;
    onAddKey: () => void;
    onRevokeKey: () => void;
}

const DidKeys: React.FC<DidKeyProps> = ({ did, hasWriteAccess, didKeys, isLoading, error, onAddKey, onRevokeKey }) => {
    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">DID Keys</Heading>
            {isLoading && <Text>Loading keys...</Text>}
            {error && <Text>Error fetching keys: {error instanceof Error ? error.message : String(error)}</Text>}
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
                                    {hasWriteAccess && <Th fontSize="lg" width="20%" textAlign="right">Revoke</Th>}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {didKeys.map((key, index) => (
                                    <Tr key={index}>
                                        <Td fontSize="md">{key.id}</Td>
                                        <Td fontSize="md">{key.publicKey}</Td>
                                        <Td fontSize="md">{key.keyUsage}</Td>
                                        <Td fontSize="md">{key.keyType}</Td>
                                        {hasWriteAccess && <Td fontSize="md" textAlign="right"><RevokeKeyButton did={did} keyId={key.id} onRemoveKey={onRevokeKey} /></Td>}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </VStack>
                    {hasWriteAccess && <AddKeyButton did={did} onAddKey={onAddKey} />}
                </>
            ) : (
                <Text color="gray.500">No keys found for this DID.</Text>
            )}
        </Card >
    );
};

export default DidKeys;