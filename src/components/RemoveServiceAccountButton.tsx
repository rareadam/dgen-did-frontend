import React, { useState, useEffect } from 'react';
import { Text, Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, useDisclosure } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress, DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress } from '../contracts';

interface RemoveServiceAccountButtonProps {
    did: string;
    serviceAccountId: string;
    onRemoveServiceAccount: () => void;
}

const RemoveServiceAccountButton = ({ did, onRemoveServiceAccount, serviceAccountId }: RemoveServiceAccountButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { address } = useAccount();
    const toast = useToast();

    const didAddress = did.replace(/^did:de?gen:.*:/, '');

    const [isLoading, setIsLoading] = useState(false);

    const { writeContract, data: hash, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({hash});;

    const handleRemoveServiceAccount = async () => {
        setIsLoading(true);

        if (!serviceAccountId) {
            toast({
                title: 'Invalid Key ID',
                description: "Please enter a valid key ID",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        writeContract({
            address: DidServiceAccountRegistryAddress,
            abi: DidServiceAccountRegistryAbi,
            functionName: 'removeServiceAccount',
            args: [didAddress as `0x${string}`, serviceAccountId],
        });

    };

    if (isConfirming) {
        toast({
            title: 'Waiting for confirmation',
            description: "Waiting for the transaction to be confirmed.",
            status: 'info',
            duration: 9000,
            isClosable: true,
        });
    }

    if (isSuccess) {
        if (isOpen) {
            toast({
                title: 'Service Account Removed',
                description: "The service account has been successfully removed.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onRemoveServiceAccount();
            setIsLoading(false);
        }
    }

    if (isError) {
        if (isOpen) {
            toast({
                title: 'Failed to Remove Service Account',
                description: error instanceof Error ? error.message : "An error occurred",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            onClose();
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button onClick={onOpen} size="sm" colorScheme="red" variant="ghost" isLoading={isLoading}>
                <TrashIcon/>
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove Service Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure you want to remove this service account?</Text>
                        <Text fontWeight="bold">Account ID:</Text>
                        <Text>{serviceAccountId}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleRemoveServiceAccount} isLoading={isLoading}>
                            Remove Service Account
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const TrashIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export default RemoveServiceAccountButton;
