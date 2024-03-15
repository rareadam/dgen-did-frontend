import React from 'react';
import { Button, Text, useToast, Card, Flex, Box, Heading } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress } from '../contracts';
import { keccak256 } from 'viem';
import AllowanceButton from './AllowanceButton';

const KEY_USAGE_AUTH = keccak256(Buffer.from("auth"));

const RegisterDidCard = () => {
  const { address } = useAccount();
  const toast = useToast();

  const { writeContract: registerDid, isPending: isRegistering, data: registerDidHash, isError, error } = useWriteContract();
  const { isLoading: isConfirmingRegistering, isSuccess: isSuccessRegistering } = useWaitForTransactionReceipt({hash: registerDidHash});

  const handleRegisterDid = async () => {
    if (!address || isRegistering) {
      return;
    }
    registerDid({
      account: address,
      address: DidKeyRegistryAddress,
      abi: DidKeyRegistryAbi,
      functionName: 'registerDid',
      args: [[{ id: 'default', keyType: 0, keyUsage: KEY_USAGE_AUTH, publicKey: address }]],
    });
  };

  if (isSuccessRegistering) {
    toast({
      title: 'Registration Successful',
      description: "Your DID has been successfully registered.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  }

  if (isConfirmingRegistering) {
    toast({
      title: 'Confirming registration',
      description: "Please confirm the registration in your wallet.",
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  }

  if (isError) {
    toast({
      title: 'Registration Failed',
      description: error instanceof Error ? error.message : "An unknown error occurred",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Card p="6" m="6" boxShadow="lg">
      <Box mb="6" textAlign="center">
        <Heading color="teal.300" fontSize="3xl" mb="4">Seems you don't have a dgenDID yet, lets change that! 🚀</Heading>
        <Text color="gray.400" fontSize="xl">
          Yo, Degens! 🌟 Ready to level up your digital identity game? You're just one click away from securing your unique dgenDID. <br />
          This ain't your average ID; it's your all-access pass to the DeFi world, making you stand out in the digital crowd. <br />
          It's time to own your identity on the blockchain like the true degen you are. <br />
          Smash that button and let's ride this wave together! 🌊
        </Text>
      </Box>
      <Flex justifyContent="center">
        <AllowanceButton width="50%" requiredAllowance={BigInt(100)} spender={DidKeyRegistryAddress}>
          <Button width="50%" colorScheme='teal' onClick={handleRegisterDid} isLoading={isRegistering || isConfirmingRegistering}>Register DID</Button>
        </AllowanceButton>
      </Flex>
    </Card>
  );
};

export default RegisterDidCard;
