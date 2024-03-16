import React, { useEffect, useState } from 'react';
import { Box, Card, Flex, Heading, Text } from '@chakra-ui/react';
import { useReadContract } from 'wagmi';
import { DidNameRegistryAbi, DidNameRegistryAddress } from '../contracts';
import RegisterDgenNameButton from './RegisterDgenNameButton';
import AllowanceButton from './AllowanceButton';
import UnregisterDgenNameButton from './UnregisterDgenNameButton';

interface DgenNameProps {
    did: string;
    name: string;
    isLoading: boolean;
    error: Error | null;
    hasWriteAccess: boolean;
    onUnregister: () => void;
    onRegister: () => void;
}

const DgenName: React.FC<DgenNameProps> = ({ did, hasWriteAccess, name, isLoading, error, onUnregister, onRegister }) => {
    return (
        <Card p="6" m="6" boxShadow="lg">
            <Flex direction={"column"} alignItems={"start"}>
                <Heading mb="4" fontSize="2xl">Dgen Name</Heading>
                {isLoading && <Text>Loading name...</Text>}
                {error && <Text>Failed to load name ({error.message}).</Text>}
                {name ? <Heading as="h3" size="lg" textAlign={"center"} mb={10}>{name}</Heading> : <Text color="gray.500" mb={2}>No name registered for this DID.</Text>}
                <Flex justifyContent="flex-end" width="100%">
                    {name && hasWriteAccess && <UnregisterDgenNameButton did={did} onUnregister={onUnregister} name={name} />}
                    {!name && hasWriteAccess && <AllowanceButton requiredAllowance={BigInt(100)} spender={DidNameRegistryAddress}>
                        <RegisterDgenNameButton did={did} onRegisterSuccess={onRegister} />
                    </AllowanceButton>}
                </Flex>
            </Flex>
            
        </Card>
    );
};

export default DgenName;
