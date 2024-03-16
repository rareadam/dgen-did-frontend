import React from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { Button, Box, useToast } from '@chakra-ui/react';
import { FaucetAbi, FaucetAddress } from '../contracts';

interface GetTokenProps {
    onSuccess?: () => void;
    [x: string]: any; // Allows any other prop
}

const GetToken = ({onSuccess, ...rest}: GetTokenProps) => {

    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
    const { isSuccess , isLoading} = useWaitForTransactionReceipt({hash});

    const toast = useToast();

    if (isSuccess) {
        toast({
            title: 'Tokens requested successfully!',
            status: 'success',
            duration: 9000,
            isClosable: true,
        });
        onSuccess && onSuccess();
    }

    if (isError) {
        toast({
            title: 'Error requesting tokens!',
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }

    if (isLoading) {
        toast({
            title: 'Requesting tokens...',
            status: 'info',
            duration: 9000,
            isClosable: true,
        });
    }

    const getTokens = async () => {
        writeContract({
            address: FaucetAddress,
            abi: FaucetAbi,
            functionName: 'requestTokens',
            args: [],
        });
    };

    return (
        <Box  {...rest}>
            <Button colorScheme='teal' w="100%" onClick={getTokens} isLoading={isPending || isLoading}>
                {'Get free $DGEN'}
            </Button>
            {isError && <p style={{ color: 'red' }}>{error?.message}</p>}
        </Box>
    );
};

export default GetToken;
