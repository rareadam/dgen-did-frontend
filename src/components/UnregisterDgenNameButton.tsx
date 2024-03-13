import { DidNameRegistryAbi, DidNameRegistryAddress } from '../contracts';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

interface UnregisterDgenNameButtonProps {
    did: string;
    name: string;
    onUnregister: () => void;
}

const UnregisterDgenNameButton = ({ did, onUnregister, name }: UnregisterDgenNameButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const didAddress = did.replace(/^did:de?gen:.*:/, '');

    const [isLoading, setIsLoading] = useState(false);

    const { writeContract, data: hash, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({hash});;

    const handleUnregisterDgenName = async () => {
        setIsLoading(true);
        writeContract({
            address: DidNameRegistryAddress,
            abi: DidNameRegistryAbi,
            functionName: 'unregisterName',
            args: [didAddress as `0x${string}`],
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
                title: 'Name unregistered',
                description: "The name has been successfully unregistered.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onUnregister();
            setIsLoading(false);
        }
    }

    if (isError) {
        if (isOpen) {
            toast({
                title: 'Failed to unregister name',
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
            <Button onClick={onOpen} colorScheme="red" isLoading={isLoading}>
                <TrashIcon/>{'  '}Unregister Name
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove Service Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text>Are you sure you want to remove the name from this DID?</Text>
                        <Text fontWeight="bold">Name:</Text>
                        <Text>{name}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={handleUnregisterDgenName} isLoading={isLoading}>
                            Unregister Name
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


export default UnregisterDgenNameButton;
