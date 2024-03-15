import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Input, useToast } from '@chakra-ui/react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

const SendNativeToken = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const toast = useToast();

  const { sendTransaction, isPending: isLoading } = useSendTransaction();

  const handleSend = async () => {
    // check that recipient is a valid eth address
    if (!recipient || !recipient.startsWith('0x')) {
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
      await sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
      toast({
        title: 'Transaction submitted',
        description: "Your transaction to send native token has been submitted.",
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
      <Button onClick={onOpen} >
        Send Native Token
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Native Token</ModalHeader>
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

export default SendNativeToken;
