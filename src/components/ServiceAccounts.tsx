import React, { useEffect, useState } from 'react';
import { Box, Card, Heading, List, ListItem, Stat, StatHelpText, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useReadContract } from 'wagmi';
import { DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress } from '../contracts';
import AddServiceAccountButton from './AddServiceAccountButton';
import AllowanceButton from './AllowanceButton';
import RemoveServiceAccountButton from './RemoveServiceAccountButton';

interface ServiceAccountsProps {
    did: string;
    hasWriteAccess?: boolean;
}

interface ServiceAccount { 
    id: string; 
    types: string[]; 
    endpoints: string[]; 
}

const ServiceAccounts: React.FC<ServiceAccountsProps> = ({ did, hasWriteAccess }) => {
    const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>([]);

    const didAddress = did.replace(/^did:de?gen:.*:/, '') as `0x${string}`;

    const { data, isLoading, isError, error, refetch } = useReadContract({
        address: DidServiceAccountRegistryAddress,
        abi: DidServiceAccountRegistryAbi,
        functionName: 'getServiceAccounts',
        args: [didAddress],
    });

    useEffect(() => {
        if (data) {
            console.log(data)
            let serviceAccounts: ServiceAccount[] = data.filter(e => e.id != '').map((e) => e as ServiceAccount);
            setServiceAccounts(serviceAccounts);
        }
    }, [data, error]);

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">Service Accounts</Heading>
            { isError && error && <Text>Failed to load service accounts: {error.message}.</Text> }
            { isLoading && <Text>Loading service accounts...</Text> }
            {serviceAccounts.length > 0 ? (
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Types</Th>
                            <Th>Endpoints</Th>
                            {hasWriteAccess && <Th>Remove</Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {serviceAccounts.map((account, index) => (
                            <Tr key={index}>
                                <Td>{account.id}</Td>
                                <Td>{account.types.join(', ')}</Td>
                                <Td>{account.endpoints.join(', ')}</Td>
                                {hasWriteAccess && <Td>
                                    <RemoveServiceAccountButton did={did} serviceAccountId={account.id} onRemoveServiceAccount={refetch} />
                                </Td>}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            ) : (
                <Text color="gray.500">No service accounts found for this DID.</Text>
            )}
            
            { hasWriteAccess && <AddServiceAccountButton did={did} onAddServiceAccount={refetch} key={serviceAccounts.length} />}
        </Card>
    );
};

export default ServiceAccounts;


