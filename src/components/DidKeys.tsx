import { Text, Card, Heading, List, ListItem, Box, VStack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import AddKeyButton from "./AddKeyButton";
import RevokeKeyButton from "./RevokeKeyButton";
import type { DidKey } from "../hooks/useDidKeys";
import LongString from "./LongString";

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
                                        <Td fontSize="md"><LongString text={key.publicKey} maxLength={20} /></Td>
                                        <Td fontSize="md">
                                            {key.keyUsages.map((usage, index) => (
                                                <React.Fragment key={index}>
                                                    {index > 0 && ', '}
                                                    <LongString text={usage} maxLength={20} />
                                                </React.Fragment>
                                            ))}
                                        </Td>
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

const DidKeysMobile: React.FC<DidKeyProps> = ({ did, hasWriteAccess, didKeys, isLoading, error, onAddKey, onRevokeKey }) => {
    return (
        <Card p="4" m="4" boxShadow="sm">
            <Heading mb="4" fontSize="xl">DID Keys</Heading>
            {isLoading && <Text>Loading keys...</Text>}
            {error && <Text>Error fetching keys: {error instanceof Error ? error.message : String(error)}</Text>}
            {didKeys && didKeys.length > 0 ? (
                <VStack spacing={4}>
                    {didKeys.map((key, index) => (
                        <Box key={index} p="4" borderWidth="1px" borderRadius="lg" width="full">
                            <Text fontSize="md"><b>Key ID:</b> {key.id}</Text>
                            <Text as="div" fontSize="md"><b>Public Key:</b> <LongString text={key.publicKey} maxLength={20} /></Text>
                            <Text fontSize="md">
                                <b>Key Usage:</b> 
                                {key.keyUsages.map((usage, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && ', '}
                                        <LongString text={usage} maxLength={20} />
                                    </React.Fragment>
                                ))}
                            </Text>
                            <Text fontSize="md"><b>Key Type:</b> {key.keyType}</Text>
                            {hasWriteAccess && <Box textAlign="right"><RevokeKeyButton did={did} keyId={key.id} onRemoveKey={onRevokeKey} /></Box>}
                        </Box>
                    ))}
                </VStack>
            ) : (
                <Text color="gray.500">No keys found for this DID.</Text>
            )}
            {hasWriteAccess && <Box mt={4}><AddKeyButton did={did} onAddKey={onAddKey} /></Box>}
        </Card>
    );
};

import { useBreakpointValue } from '@chakra-ui/react';
import React from "react";

const DidKeysResponsive: React.FC<DidKeyProps> = (props) => {
    const isLargeScreen = useBreakpointValue({ base: false, lg: true });

    return isLargeScreen ? <DidKeys {...props} /> : <DidKeysMobile {...props} />;
};


export default DidKeysResponsive;