import React, { useState } from 'react';
import { Button, Input, useToast } from '@chakra-ui/react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { DidNameRegistryAbi, DidNameRegistryAddress } from '../contracts';

interface RegisterDgenNameButtonProps {
    did: string;
    onRegisterSuccess?: () => void;
}

const RegisterDgenNameButton: React.FC<RegisterDgenNameButtonProps> = ({ did, onRegisterSuccess }) => {
    const [name, setName] = useState('');
    const toast = useToast();
    const { writeContract, isError, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({hash});

    const didAddress = did.replace(/^did:de?gen:.*:/, '') as `0x${string}`;

    const handleRegisterName = async () => {
        if (!name) {
            toast({
                title: 'Error',
                description: 'Name cannot be empty',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        writeContract({
            address: DidNameRegistryAddress,
            abi: DidNameRegistryAbi,
            functionName: 'registerName',
            args: [didAddress, name],
        });
    };

    if (isConfirming) {
        toast({
            title: 'Waiting for confirmation',
            description: 'Waiting for transaction to be confirmed',
            status: 'info',
            duration: 9000,
            isClosable: true,
        });
    }

    if (isSuccess) {
        toast({
            title: 'Success',
            description: 'Name registered successfully',
            status: 'success',
            duration: 9000,
            isClosable: true,
        });
        onRegisterSuccess && onRegisterSuccess();
    }

    return (
        <>
            <Input
                placeholder="Enter new name for DID"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mb="4"
            />
            <Button
                onClick={handleRegisterName}
                isLoading={isPending || isConfirming}
                colorScheme="teal"
            >
                Register Name
            </Button>
        </>
    );
};

export default RegisterDgenNameButton;
