
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast, Spinner, Box, Flex } from '@chakra-ui/react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress, DgenTokenAddress } from '../contracts';
import { erc20Abi } from 'viem';
import AllowanceButton from './AllowanceButton';
import KeySelect from './KeySelect';

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
            <Flex justifyContent="flex-end">
                <Button onClick={onOpen} colorScheme="teal">Add Account</Button>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Service Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Input placeholder="Service Account ID" value={id} onChange={(e) => setId(e.target.value)} mb={3} />
                        <Input placeholder="Service Account Types" value={serviceTypes.join(',')} onChange={(e) => setServiceTypes(e.target.value.split(','))} mb={3} />
                        <Input placeholder="Service Account Endpoints" value={serviceEndpoints.join(',')} onChange={(e) => setServiceEndpoints(e.target.value.split(','))} mb={3} />
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
