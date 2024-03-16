import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast, Spinner, Box, Flex, Tooltip, FormControl, FormLabel } from '@chakra-ui/react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress, DgenTokenAddress } from '../contracts';
import { erc20Abi } from 'viem';
import AllowanceButton from './AllowanceButton';
import KeySelect from './KeySelect';

interface AddKeyButtonProps {
    did: string;
    onAddKey: () => void;
}

const AddKeyButton = ({ did, onAddKey }: AddKeyButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState('');
    const [keyType, setKeyType] = useState(0);
    const [keyUsage, setKeyUsage] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const toast = useToast();

    const didAddress = did.replace(/^did:de?gen:.*:/, '');

    const { writeContract: addKeyCall, isPending: addKeyisLoading, data: addKeyHash, isError: isAddKeyError, error: addKeyError } = useWriteContract();
    const { isLoading: addKeyIsConfirming, isSuccess: addKeyIsConfirmed } = useWaitForTransactionReceipt({ hash: addKeyHash });

    if (addKeyIsConfirming) {
        toast({
            title: 'Transaction is being confirmed',
            description: "Please wait...",
            status: 'info',
            duration: 9000,
            isClosable: false,
        });
    }

    if (addKeyIsConfirmed) {
        if (isOpen) {
            toast({
                title: 'Key Added',
                description: "Your key has been successfully added.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            onClose();
            onAddKey();
        }        
    }

    if (isAddKeyError) {
        toast({
            title: 'Failed to Add Key',
            description: addKeyError instanceof Error ? addKeyError.message : "An error occurred",
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }


    const handleAddKey = async () => {
        if (!keyType || !keyUsage || !publicKey || !keyUsage.startsWith('0x') || !publicKey.startsWith('0x')) {
            toast({
                title: 'Invalid Key',
                description: "Please enter a valid key",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        const key: { id: string, keyType: number; keyUsage: `0x${string}`; publicKey: `0x${string}`; } = {
            id,
            keyType: keyType,
            keyUsage: keyUsage as `0x${string}`,
            publicKey: publicKey as `0x${string}`,
        }


        addKeyCall({
            address: DidKeyRegistryAddress,
            abi: DidKeyRegistryAbi,
            functionName: 'addKey',
            args: [didAddress as `0x${string}`, key],
        });
    };

    return (
        <Box pt={4}>
            <Flex justifyContent="flex-end">
                <Button onClick={onOpen} colorScheme="teal">Add Key</Button>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Key</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='keyName'>Key Name</FormLabel>
                            <Input id='keyName' placeholder="Enter the name of the key" value={id} onChange={(e) => setId(e.target.value)} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='keyType'>Key Type (leave it like it is)</FormLabel>
                            <Input id='keyType' defaultValue={0} value={keyType} onChange={(e) => setKeyType(parseInt(e.target.value))} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='keyUsage'>Key Usage</FormLabel>
                            <Input id='keyUsage' placeholder="Specify the key usage hash" value={keyUsage} onChange={(e) => setKeyUsage(e.target.value)} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='publicKey'>Public Key</FormLabel>
                            <KeySelect onKeySubmit={setPublicKey} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <AllowanceButton requiredAllowance={BigInt(100)} spender={DidKeyRegistryAddress}>
                            <Tooltip label="Add a new key to your DID" hasArrow placement="top">
                                <Button colorScheme="blue" mr={3} onClick={handleAddKey} isLoading={addKeyisLoading || addKeyIsConfirming}>
                                    Add Key
                                </Button>
                            </Tooltip>
                        </AllowanceButton>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default AddKeyButton;
