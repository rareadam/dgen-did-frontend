import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Select, useToast, Input, FormControl, FormLabel, Box, useDisclosure } from '@chakra-ui/react';
import { useAccount, useSignMessage, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { DidAccountLinkRegistryAbi, DidAccountLinkRegistryAddress } from '../contracts';
import { ethers } from 'ethers';
import AllowanceButton from './AllowanceButton';
import { encodePacked, hexToBytes, keccak256 } from 'viem';

interface AddLinkedAccountButtonProps {
    did: string;
    onSuccess?: () => void;
}

const AddLinkedAccountButton = ({ did, onSuccess }: AddLinkedAccountButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isConnected, address: connectedAddress, addresses } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const toast = useToast();
    const [address, setAddress] = useState(connectedAddress);
    const [id, setId] = useState('');
    const [purpose, setPurpose] = useState('');

    const didAddress = did.replace(/^did:de?gen:.*:/, '') as `0x${string}`;

    const handleOpen = () => onOpen();
    const handleClose = () => onClose();

    const { data: hash, isPending, writeContract, isError, error } = useWriteContract();
    const { isSuccess, isLoading } = useWaitForTransactionReceipt({ hash });

    if (isLoading) {
        toast({
            title: 'Transaction in Progress',
            description: 'Your transaction is being processed. Please wait.',
            status: 'info',
            duration: 9000,
            isClosable: true,
        })
    }

    if (isSuccess && isOpen) {
        toast({
            title: 'Account linked',
            description: 'Your account was successfully linked to your DID',
            status: 'success',
            duration: 9000,
            isClosable: true,
        })
        onSuccess && onSuccess();
        handleClose();
    }

    if (isError) {
        toast({
            title: 'Transaction Failed',
            description: error?.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
        });
    }

    const handleLinkAccount = async () => {
        if (!isConnected || !address) {
            toast({
                title: 'Error',
                description: 'Please connect your wallet.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        const message = keccak256(encodePacked(['address', 'address', 'string'], [didAddress, address, purpose]));
        const signature = await signMessageAsync({ message: {raw: message}, account: address });
        console.log(`signature is ${signature}`)
        writeContract({
            address: DidAccountLinkRegistryAddress,
            abi: DidAccountLinkRegistryAbi,
            functionName: 'registerLinkedAccount',
            args: [didAddress as `0x${string}`, id, address, purpose, signature],
        })
    };

    return (
        <>
            <Button onClick={handleOpen} isLoading={isPending || isLoading} colorScheme="teal">Link New Account</Button>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Link a New Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel htmlFor='id'>ID</FormLabel>
                            <Input id='id' type='text' onChange={(e) => setId(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='purpose'>Purpose</FormLabel>
                            <Input id='purpose' type='text' onChange={(e) => setPurpose(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='address'>Account</FormLabel>
                            <Select id="address" onChange={(e) => setAddress(e.target.value as `0x${string}`)} width="100%">
                                {addresses?.map((address, index) => (
                                    <option key={index} value={address}>
                                        {address}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                        <Box mt={4}>
                            <AllowanceButton requiredAllowance={BigInt(100)} spender={DidAccountLinkRegistryAddress}>
                                <Button mt={4} colorScheme='teal' onClick={handleLinkAccount}>Link Account</Button>
                            </AllowanceButton>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddLinkedAccountButton;
