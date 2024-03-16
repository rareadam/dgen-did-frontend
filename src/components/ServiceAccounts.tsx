import React from 'react';
import { Box, Card, Heading, List, ListItem, Stat, StatHelpText, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import AddServiceAccountButton from './AddServiceAccountButton';
import RemoveServiceAccountButton from './RemoveServiceAccountButton';

interface ServiceAccountsProps {
    did: string;
    hasWriteAccess?: boolean;
    serviceAccounts: readonly ServiceAccount[] | undefined;
    isLoading: boolean;
    error: Error | null;
    onAddServiceAccount: () => void;
    onRemoveServiceAccount: () => void;
}

interface ServiceAccount { 
    id: string; 
    types: readonly string[]; 
    endpoints: readonly string[]; 
}

const ServiceAccounts: React.FC<ServiceAccountsProps> = ({ did, hasWriteAccess, serviceAccounts, isLoading, error, onAddServiceAccount, onRemoveServiceAccount }) => {
    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">Service Accounts</Heading>
            {isLoading && <Text>Loading service accounts...</Text>}
            {error && <Text>Failed to load service accounts: {error instanceof Error ? error.message : String(error)}.</Text>}
            {serviceAccounts && serviceAccounts.length > 0 ? (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th fontSize="lg" width="20%">ID</Th>
                            <Th fontSize="lg" width="20%">Types</Th>
                            <Th fontSize="lg" width="20%">Endpoints</Th>
                            {hasWriteAccess && <Th fontSize="lg" width="100%" textAlign="right">Remove</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {serviceAccounts.map((account, index) => (
                            <Tr key={index}>
                                <Td fontSize="md">{account.id}</Td>
                                <Td fontSize="md">{account.types.join(', ')}</Td>
                                <Td fontSize="md">{account.endpoints.join(', ')}</Td>
                                {hasWriteAccess && <Td fontSize="md" textAlign="right">
                                    <RemoveServiceAccountButton did={did} serviceAccountId={account.id} onRemoveServiceAccount={onRemoveServiceAccount} />
                                </Td>}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Text color="gray.500">No service accounts found for this DID.</Text>
            )}
            
            { hasWriteAccess && <AddServiceAccountButton did={did} onAddServiceAccount={onAddServiceAccount} key={serviceAccounts?.length} />}
        </Card>
    );
};

export default ServiceAccounts;
