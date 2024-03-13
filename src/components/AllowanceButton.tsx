import React, { useState, useEffect } from 'react';
import { Button, Text, useToast } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { DgenTokenAddress, DidKeyRegistryAddress } from '../contracts';
import { erc20Abi } from 'viem';

interface AllowanceButtonProps {
    requiredAllowance: bigint;
    spender: `0x${string}`;
    children: React.ReactNode;
    address?: `0x${string}`;
}

const AllowanceButton: React.FC<AllowanceButtonProps> = ({ requiredAllowance, children, address, spender }) => {
    const { address: connectedAddress } = useAccount();
    if (!connectedAddress) {
        return null;
    }

    if (!address) {
        address = connectedAddress;
    }

    if (!address) {
        return null;
    }

    const toast = useToast();
    const [allowance, setAllowance] = useState<bigint>(BigInt(0));
    const [isLoading, setIsLoading] = useState(false);

    const { data: allowanceData, refetch } = useReadContract({
        address: DgenTokenAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, spender],
    });

    const checkAllowance = async () => {
        if (!address) {
            return;
        }
        await refetch();
        setAllowance(BigInt(allowanceData || 0));
    };

    useEffect(() => {
        checkAllowance();
    }, [address]);

    const { writeContract, data: hash, isError, error, isSuccess } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    const handleAddAllowance = async () => {
        setIsLoading(true);
        writeContract({
            account: address,
            address: DgenTokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [spender, requiredAllowance],
        });
        toast({
            title: 'Waiting for confirmation',
            description: "Waiting for the transaction to be confirmed.",
            status: 'info',
            duration: 9000,
            isClosable: true,
        });
    };

    if (isError) {
        if (isLoading) {
            setIsLoading(false);
            toast({
                title: 'Failed to Add Allowance',
                description: error instanceof Error ? error.message : "An error occurred",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }

    if (isSuccess) {
        if (isLoading) {
            toast({
                title: 'Allowance Added',
                description: "You have successfully added the allowance.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            setAllowance(requiredAllowance);
            setIsLoading(false);
        }
    }

    if (allowance < requiredAllowance) {
        return (
            <>
                <Button onClick={handleAddAllowance} isLoading={isLoading} colorScheme="blue">
                    Add Allowance
                </Button>
                {isError && error && <Text color="red.500">{error.toString()}</Text>}
            </>
        );
    }

    return <>{children}</>;
};

export default AllowanceButton;
