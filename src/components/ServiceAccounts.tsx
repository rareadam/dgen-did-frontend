import React, { useEffect, useState } from 'react';
import { Box, Card, Heading, List, ListItem, Stat, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { useReadContract } from 'wagmi';
import { DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress } from '../contracts';
import AddServiceAccountButton from './AddServiceAccountButton';
import AllowanceButton from './AllowanceButton';
import RemoveServiceAccountButton from './RemoveServiceAccountButton';

interface ServiceAccountsProps {
    did: string;
}

interface ServiceAccount { 
    id: string; 
    types: string[]; 
    endpoints: string[]; 
}

const ServiceAccounts: React.FC<ServiceAccountsProps> = ({ did }) => {
    const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const didAddress = did.replace(/^did:de?gen:.*:/, '') as `0x${string}`;

    const { data, error, refetch } = useReadContract({
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
            setIsLoading(false);
        }
        if (error) {
            setIsError(true);
            setIsLoading(false);
        }
    }, [data, error]);

    if (isLoading) {
        return <Text>Loading service accounts...</Text>;
    }

    if (isError) {
        return <Text>Failed to load service accounts.</Text>;
    }

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">Service Accounts</Heading>
            {serviceAccounts.length > 0 ? (
                <List spacing={3}>
                    {serviceAccounts.map((account, index) => (
                        <Card border="1px solid" borderColor="gray.200" p="4" position="relative">
                            <Box position="absolute" top="2" right="2">
                                <RemoveServiceAccountButton did={did} serviceAccountId={account.id} onRemoveServiceAccount={refetch} />
                            </Box>
                            <Stat>
                                <StatLabel>ID</StatLabel>
                                <StatNumber>{account.id}</StatNumber>
                                <StatHelpText>Types: {account.types.join(', ')}</StatHelpText>
                                <StatHelpText>Endpoints: {account.endpoints.join(', ')}</StatHelpText>
                            </Stat>
                        </Card>
                    ))}
                </List>
            ) : (
                <Text>No service accounts found for this DID.</Text>
            )}
            <AddServiceAccountButton did={did} onAddServiceAccount={refetch} key={serviceAccounts.length} />
        </Card>
    );
};

export default ServiceAccounts;


