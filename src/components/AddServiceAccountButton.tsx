import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast, Box, Flex, FormControl, FormLabel } from '@chakra-ui/react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress } from '../contracts';
import AllowanceButton from './AllowanceButton';

interface AddServiceAccountButtonProps {
    did: string;
    onAddServiceAccount: () => void;
}

interface ServiceAccount { 
    id: string; 
    types: string[]; 
    endpoints: string[]; 
}

const AddServiceAccountButton = ({ did, onAddServiceAccount }: AddServiceAccountButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState('');
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [serviceEndpoints, setServiceEndpoints] = useState<string[]>([]);

    const toast = useToast();

    const didAddress = did.replace(/^did:de?gen:.*:/, '');

    const { writeContract: addAccountCall, isPending: addAccountisLoading, data: addAccountHash, isError: isAddServiceAccountError, error: addAccountError } = useWriteContract();
    const { isLoading: addAccountIsConfirming, isSuccess: addAccountIsConfirmed } = useWaitForTransactionReceipt({ hash: addAccountHash });

    if (addAccountIsConfirming) {
        toast({
            title: 'Transaction is being confirmed',
            description: "Please wait...",
            status: 'info',
            duration: 9000,
            isClosable: false,
        });
    }

    if (addAccountIsConfirmed) {
        if (isOpen) {
            toast({
                title: 'Service Account Added',
                description: "Your service account has been successfully added.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onAddServiceAccount();
        }        
    }

    if (isAddServiceAccountError) {
        toast({
            title: 'Failed to Add Service Account',
            description: addAccountError instanceof Error ? addAccountError.message : "An error occurred",
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }

    const handleAddServiceAccount = async () => {
        if (id === '' || serviceTypes.length === 0 || serviceEndpoints.length === 0) {
            toast({
                title: 'Invalid Input',
                description: "Please fill in all fields",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        const serviceAccount: ServiceAccount = {
            id,
            types: serviceTypes,
            endpoints: serviceEndpoints,
        }

        addAccountCall({
            address: DidServiceAccountRegistryAddress,
            abi: DidServiceAccountRegistryAbi,
            functionName: 'registerServiceAccount',
            args: [didAddress as `0x${string}`, [serviceAccount]],
        });
    };

    return (
        <Box pt={4}>
            <Flex justifyContent="flex-end" >
                <Button onClick={onOpen} colorScheme="teal">Add Service Account</Button>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Service Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='serviceAccountId'>Service Account ID</FormLabel>
                            <Input id='serviceAccountId' placeholder="Enter the unique identifier for the Service Account" value={id} onChange={(e) => setId(e.target.value)} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='serviceAccountTypes'>Service Account Types</FormLabel>
                            <Input id='serviceAccountTypes' placeholder="Enter types separated by commas (e.g., type1,type2)" value={serviceTypes.join(',')} onChange={(e) => setServiceTypes(e.target.value.split(','))} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='serviceAccountEndpoints'>Service Account Endpoints</FormLabel>
                            <Input id='serviceAccountEndpoints' placeholder="Enter endpoints separated by commas (e.g., endpoint1,endpoint2)" value={serviceEndpoints.join(',')} onChange={(e) => setServiceEndpoints(e.target.value.split(','))} mb={3} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <AllowanceButton requiredAllowance={BigInt(100)} spender={DidServiceAccountRegistryAddress}>
                            <Button colorScheme="blue" mr={3} onClick={handleAddServiceAccount} isLoading={addAccountisLoading || addAccountIsConfirming}>
                                Add Service Account
                            </Button>
                        </AllowanceButton>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AddServiceAccountButton;
