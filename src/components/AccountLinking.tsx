import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Button, useToast, Card, Heading, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useAccount, useReadContract } from 'wagmi';
import { DidAccountLinkRegistryAddress, DidAccountLinkRegistryAbi } from '../contracts';
import AddLinkedAccountButton from './AddLinkedAccountButton';
import RemoveLinkedAccountButton from './RemoveLinkedAccountButton';

interface LinkedAccountsProps {
    did: string;
    hasWriteAccess?: boolean;
}

const LinkedAccounts = ({did, hasWriteAccess}: LinkedAccountsProps) => {
  const didAddress = did.replace(/^did:de?gen:.*:/, '');

  const { data: linkedAccounts, isError, error, isLoading, refetch } = useReadContract({
    address: DidAccountLinkRegistryAddress,
    // Assuming the ABI is correctly imported and contains a function to get linked accounts
    abi: DidAccountLinkRegistryAbi, // This ABI needs to be defined/imported in your project
    functionName: 'getLinkedAccounts',
    args: [didAddress as `0x${string}`],
  });

  return (
    <Card p="6" m="6" boxShadow="lg">
        <Heading mb="4" fontSize="2xl">Linked Accounts</Heading>
        {isError && <Text>Error fetching linked accounts: {error?.message}.</Text>}
        {isLoading && <Text>Loading linked accounts...</Text>}
        {linkedAccounts && linkedAccounts.length > 0 ? (
            <Table variant="simple" width="full">
                <Thead>
                    <Tr>
                        <Th fontSize="lg" width="20%">ID</Th>
                        <Th fontSize="lg" width="20%">Account</Th>
                        <Th fontSize="lg" width="20%">Purpose</Th>
                        {hasWriteAccess && <Th fontSize="lg" width="100%" textAlign="right">Remove</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {linkedAccounts.map((account, index) => (
                        <Tr key={index}>
                            <Td fontSize="md">{account.id}</Td>
                            <Td fontSize="md">{account.account}</Td>
                            <Td fontSize="md">{account.purpose}</Td>
                            {hasWriteAccess && <Td fontSize="md" textAlign="right">
                                <RemoveLinkedAccountButton did={did} onRemoveLinkedAccount={refetch} linkedAccountId={account.id} />
                            </Td>}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        ) : (
            <Text color="gray.500">No accounts linked.</Text>
        )}
        {hasWriteAccess && <Box mt={4}>
          <Flex justifyContent="flex-end">
            <AddLinkedAccountButton did={did} onSuccess={refetch} />
          </Flex>
        </Box>}
    </Card>
  );
};

export default LinkedAccounts;
