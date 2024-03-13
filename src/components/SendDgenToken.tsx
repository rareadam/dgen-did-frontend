import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast } from '@chakra-ui/react';
import { useAccount, useWriteContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { DgenTokenAddress } from '@/contracts';


const SendDgenToken = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const toast = useToast();

  const { writeContract, isPending: isLoading } = useWriteContract();

  const handleSend = async () => {
    // check that receipient is a valid eth address
    if (!recipient) {
      toast({
        title: 'Invalid recipient',
        description: "Please enter a valid recipient address",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      await writeContract({
        address: DgenTokenAddress,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, BigInt(amount)],
      });
      toast({
        title: 'Transaction submitted',
        description: "Your transaction to send Dgen Token has been submitted.",
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : "An error occurred",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} variant="ghost">
        Send
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Dgen Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} mb={3} />
            <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSend} isLoading={isLoading}>
              Send
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SendDgenToken;
