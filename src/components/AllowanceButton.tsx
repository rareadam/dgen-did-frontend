import React, { useState, useEffect } from 'react';
import { Box, Button, Text, Tooltip, useToast } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { DgenTokenAddress, DidKeyRegistryAddress } from '../contracts';
import { erc20Abi } from 'viem';

interface AllowanceButtonProps {
    requiredAllowance: bigint;
    spender: `0x${string}`;
    children: React.ReactNode;
    address?: `0x${string}`;
    [x: string]: any; // Allows for arbitrary properties for styling
}

const AllowanceButton: React.FC<AllowanceButtonProps> = ({ requiredAllowance, children, address, spender, ...props }) => {
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

    const { writeContract, data: hash, isError, error, isSuccess, isPending } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isError && error) {
            toast({
                title: 'Failed to Add Allowance',
                description: error instanceof Error ? error.message : "An error occurred",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }, [isError, error]);

    useEffect(() => {
        if (isSuccess && !isConfirming) {
            toast({
                title: 'Allowance Added',
                description: "You have successfully added the allowance.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            setAllowance(requiredAllowance);
        }
    }, [isSuccess, isConfirming]);

    const handleAddAllowance = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
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

    if (allowance < requiredAllowance) {
        return (
            <Tooltip label="Click to add allowance" hasArrow placement="top">
                <Button onClick={handleAddAllowance} isLoading={isPending || isConfirming} colorScheme="blue" {...props}>
                    Add Allowance
                </Button>
            </Tooltip>
        );
    }

    return <>{children}</>;
};

export default AllowanceButton;
