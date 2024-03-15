import React, { useEffect, useState } from 'react';
import { Box, Card, Flex, Heading, Text } from '@chakra-ui/react';
import { useReadContract } from 'wagmi';
import { DidNameRegistryAbi, DidNameRegistryAddress } from '../contracts';
import RegisterDgenNameButton from './RegisterDgenNameButton';
import AllowanceButton from './AllowanceButton';
import UnregisterDgenNameButton from './UnregisterDgenNameButton';

interface DgenNameProps {
    did: string;
    hasWriteAccess: boolean;
}

const DgenName: React.FC<DgenNameProps> = ({ did, hasWriteAccess }) => {

    console.log('DgenName render', {did, hasWriteAccess});

    const didAddress = did.replace(/^did:de?gen:.*:/, '') as `0x${string}`;

    const { data: name, error, isError, isLoading, refetch } = useReadContract({
        address: DidNameRegistryAddress,
        abi: DidNameRegistryAbi,
        functionName: 'getNameForDid',
        args: [didAddress],
    });

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Flex direction={"column"} alignItems={"start"}>
                <Heading mb="4" fontSize="2xl">Dgen Name</Heading>
                {isLoading && <Text>Loading name...</Text>}
                {isError && <Text>Failed to load name ({error?.message}).</Text>}
                {name ? <Heading as="h3" size="lg" textAlign={"center"} mb={10}>{name}</Heading> : <Text color="gray.500" mb={2}>No name registered for this DID.</Text>}
                <Flex justifyContent="flex-end" width="100%">
                    {name && hasWriteAccess && <UnregisterDgenNameButton did={did} onUnregister={refetch} name={name} />}
                    {!name && hasWriteAccess && <AllowanceButton requiredAllowance={BigInt(100)} spender={DidNameRegistryAddress}>
                        <RegisterDgenNameButton did={did} onRegisterSuccess={refetch} />
                    </AllowanceButton>}
                </Flex>
            </Flex>
            
        </Card>
    );
};

export default DgenName;
