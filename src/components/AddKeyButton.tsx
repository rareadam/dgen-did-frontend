import React, { useState, useEffect } from 'react';
import { Button, Text, Modal, ModalOverlay, ModalContent, Stack, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast, Spinner, Box, Flex, Tooltip, FormControl, FormLabel, Select, Switch, Menu, Checkbox, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, VStack, HStack } from '@chakra-ui/react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress, DgenTokenAddress } from '../contracts';
import { erc20Abi, etherUnits, keccak256 } from 'viem';
import AllowanceButton from './AllowanceButton';
import KeySelect from './KeySelect';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface AddKeyButtonProps {
    did: string;
    onAddKey: () => void;
}

const AddKeyButton = ({ did, onAddKey }: AddKeyButtonProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [id, setId] = useState('');
    const [keyType, setKeyType] = useState(0);
    const [keyUsages, setKeyUsages] = useState<string[]>([]);
    const [publicKey, setPublicKey] = useState('');
    const [sudoKey, setSudoKey] = useState(false);

    const toast = useToast();

    const didAddress = did.replace(/^did:de?gen:.*:/, '');

    const { writeContract: addKeyCall, isPending: addKeyisLoading, data: addKeyHash, isError: isAddKeyError, error: addKeyError, reset } = useWriteContract();
    const { isLoading: addKeyIsConfirming, isSuccess: addKeyIsConfirmed } = useWaitForTransactionReceipt({ hash: addKeyHash });

    useEffect(() => {
        if (addKeyIsConfirming) {
            toast({
                title: 'Transaction is being confirmed',
                description: "Please wait...",
                status: 'info',
                duration: 9000,
                isClosable: false,
            });
        }
    }, [addKeyIsConfirming, toast]);

    useEffect(() => {
        if (addKeyIsConfirmed && isOpen) {
            toast({
                title: 'Key Added',
                description: "Your key has been successfully added.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            reset();
            onClose();
            onAddKey();
        }
    }, [addKeyIsConfirmed, isOpen, toast, onClose, onAddKey]);

    useEffect(() => {
        if (isAddKeyError) {
            toast({
                title: 'Failed to Add Key',
                description: addKeyError instanceof Error ? addKeyError.message : "An error occurred",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            reset();
        }
    }, [isAddKeyError, addKeyError, toast]);

    const handleAddKey = async () => {
        const finalKeyUsages = keyUsages.map((u) => keccak256(Buffer.from(u)));

        console.log({ id, keyType, keyUsages, finalKeyUsages, publicKey, sudoKey })

        if (keyType === undefined || finalKeyUsages.length === 0 || !publicKey || !publicKey.startsWith('0x')) {
            toast({
                title: 'Invalid Key',
                description: "Please ensure all fields are correctly filled",
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }
        const key = {
            id,
            keyType: keyType,
            keyUsages: finalKeyUsages,
            publicKey: publicKey as `0x${string}`,
            sudo: sudoKey,
        } as { id: string; keyType: number; keyUsages: readonly `0x${string}`[]; publicKey: `0x${string}`; sudo: boolean; }

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
                            <FormLabel htmlFor='keyType'>Key Type</FormLabel>
                            <Input id='keyType' value={keyType} onChange={(e) => setKeyType(parseInt(e.target.value))} mb={3} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='keyUsages'>Key Usages</FormLabel>
                            <KeyUsageSelector keyUsages={keyUsages} setKeyUsages={setKeyUsages} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel htmlFor='sudoKey'>Sudo Key</FormLabel>
                            <Switch id='sudoKey' onChange={(e) => setSudoKey(e.target.checked)} isChecked={sudoKey} />
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

interface KeyUsageSelectorProps {
    keyUsages: string[];
    setKeyUsages: (usages: string[]) => void;
}

const KeyUsageSelector: React.FC<KeyUsageSelectorProps> = ({ keyUsages, setKeyUsages }) => {
    const [customUsage, setCustomUsage] = useState('');

    const predefinedUsages = [
        { label: 'Authentication', value: 'auth' },
        { label: 'Attestation', value: 'attestation' },
        // Add more predefined usages here
    ];

    const handleUsageChange = (usage: string) => {
        const newKeyUsages = keyUsages.includes(usage)
            ? keyUsages.filter((u) => u !== usage)
            : [...keyUsages, usage];
        setKeyUsages(newKeyUsages);
    };

    const handleCustomUsageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomUsage(e.target.value);
    };

    const addCustomUsage = () => {
        if (customUsage && !keyUsages.includes(customUsage)) {
            setKeyUsages([...keyUsages, customUsage]);
            setCustomUsage('');
        }
    };

    return (
        <VStack align="start" spacing={4}>
            {predefinedUsages.map((usage) => (
                <Checkbox key={usage.value} isChecked={keyUsages.includes(usage.value)} onChange={() => handleUsageChange(usage.value)}>
                    {usage.label}
                </Checkbox>
            ))}
            {keyUsages.filter(usage => !predefinedUsages.some(predefined => predefined.value === usage)).map((usage, index) => (
                <Checkbox key={index} isChecked={keyUsages.includes(usage)} onChange={() => handleUsageChange(usage)}>
                    {usage}
                </Checkbox>
            ))}
            <HStack width="full">
                <Input placeholder="Enter custom key usage" value={customUsage} onChange={handleCustomUsageChange} />
                <Button onClick={addCustomUsage}>Add</Button>
            </HStack>
        </VStack>
    );
};


export default AddKeyButton;
