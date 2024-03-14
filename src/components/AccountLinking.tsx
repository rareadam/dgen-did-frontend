import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Button, useToast, Card, Heading, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useAccount, useReadContract } from 'wagmi';
import { DidAccountLinkRegistryAddress, DidAccountLinkRegistryAbi } from '../contracts';
import AddLinkedAccountButton from './AddLinkedAccountButton';
import RemoveLinkedAccountButton from './RemoveLinkedAccountButton';

interface LinkedAccountsProps {
    did: string;
}

const LinkedAccounts = ({did}: LinkedAccountsProps) => {
  const didAddress = did.replace(/^did:de?gen:.*:/, '');

  const { data: linkedAccounts, isError, refetch } = useReadContract({
    address: DidAccountLinkRegistryAddress,
    // Assuming the ABI is correctly imported and contains a function to get linked accounts
    abi: DidAccountLinkRegistryAbi, // This ABI needs to be defined/imported in your project
    functionName: 'getLinkedAccounts',
    args: [didAddress as `0x${string}`],
  });

  return (
    <Card p="6" m="6" boxShadow="lg">
        <Heading mb="4" fontSize="2xl">Linked Accounts</Heading>
        {linkedAccounts && linkedAccounts.length > 0 ? (
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Account</Th>
                        <Th>Purpose</Th>
                        <Th>Remove</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {linkedAccounts.map((account, index) => (
                        <Tr key={index}>
                            <Td>{account.id}</Td>
                            <Td>{account.account}</Td>
                            <Td>{account.purpose}</Td>
                            <Td>
                                <RemoveLinkedAccountButton did={did} onRemoveLinkedAccount={refetch} linkedAccountId={account.id} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        ) : (
            <Text>No accounts linked.</Text>
        )}
        <Box mt={4}>
          <Flex justifyContent="flex-end">
            <AddLinkedAccountButton did={did} onSuccess={refetch} />
          </Flex>
        </Box>
    </Card>
  );
};

export default LinkedAccounts;
