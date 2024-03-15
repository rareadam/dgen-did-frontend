import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { writeContract } from 'viem/actions';
import { Button, Box, useToast } from '@chakra-ui/react';
import { FaucetAbi, FaucetAddress } from '../contracts';


interface GetTokenProps {
    onSuccess?: () => void;
}

const GetToken = ({onSuccess}: GetTokenProps) => {

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
        <Box>
            <Button onClick={getTokens} isLoading={isPending || isLoading}>
                {'Get free $DGEN'}
            </Button>
            {isError && <p style={{ color: 'red' }}>{error?.message}</p>}
        </Box>
    );
};

export default GetToken;
