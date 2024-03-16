import React from 'react';
import { Box, Text, VStack, Button, useToast, Card, Heading, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import AddLinkedAccountButton from './AddLinkedAccountButton';
import RemoveLinkedAccountButton from './RemoveLinkedAccountButton';
import { LinkedAccount } from '@/hooks/useDidLinkedAccounts';
import LongString from './LongString';

interface LinkedAccountsProps {
    did: string;
    hasWriteAccess?: boolean;
    linkedAccounts: readonly LinkedAccount[] | undefined;
    isLoading: boolean;
    error: Error | null;
    onAddLinkedAccount: () => void;
    onRemoveLinkedAccount: () => void;
}

const LinkedAccounts = ({did, hasWriteAccess, linkedAccounts, isLoading, error, onAddLinkedAccount, onRemoveLinkedAccount}: LinkedAccountsProps) => {
  return (
    <Card p="6" m="6" boxShadow="lg">
        <Heading mb="4" fontSize="2xl">Linked Accounts</Heading>
        {error && <Text>Error fetching linked accounts: {error.message}.</Text>}
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
                            <Td fontSize="md"><LongString text={account.account} maxLength={20} /></Td>
                            <Td fontSize="md">{account.purpose}</Td>
                            {hasWriteAccess && <Td fontSize="md" textAlign="right">
                                <RemoveLinkedAccountButton did={did} onRemoveLinkedAccount={onRemoveLinkedAccount} linkedAccountId={account.id} />
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
            <AddLinkedAccountButton did={did} onSuccess={onAddLinkedAccount} />
          </Flex>
        </Box>}
    </Card>
  );
};

export default LinkedAccounts;
