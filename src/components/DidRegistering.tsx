import React, { useState } from 'react';
import {
  Box,
  Button,
  useToast,
  Text,
  Select,
  Card,
  Spacer,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { erc20Abi, keccak256 } from 'viem';

import { DidKeyRegistryAbi, DidKeyRegistryAddress, DgenTokenAddress } from '../contracts';
import AllowanceButton from './AllowanceButton';


const KEY_USAGE_AUTH = keccak256(Buffer.from("auth"));

interface DidRegisteringProps {
  onRegisterSuccess?: () => void;
}

const DidRegistering = ({ onRegisterSuccess }: DidRegisteringProps) => {
  const { address: currentAddress, addresses } = useAccount();
  const toast = useToast();

  if (!currentAddress) {
    return (<Text color="red.500">Please connect your wallet</Text>);
  }

  const [address, setAddress] = useState(currentAddress);
  console.log(`selected address ${address}`)

  const { data: didExists, refetch: refetchDidExists } = useReadContract({
    address: DidKeyRegistryAddress,
    abi: DidKeyRegistryAbi,
    functionName: 'didExists',
    args: [address],
  });

  const { writeContract: registerDid, isPending: isRegistering, data: registerDidHash, error: registerError } = useWriteContract();

  const { isLoading: isConfirmingRegistering, isSuccess: isSuccessRegistering } = useWaitForTransactionReceipt({hash: registerDidHash});
  
  const callRegisterDid = async () => {
    console.log('callRegisterDid', { isRegistering });
    if (!address || isRegistering) {
      return;
    }
    console.log(`registering DID`)
    registerDid({
      account: address,
      address: DidKeyRegistryAddress,
      abi: DidKeyRegistryAbi,
      functionName: 'registerDid',
      args: [[{ id: 'default', keyType: 0, keyUsages: [KEY_USAGE_AUTH], publicKey: address, sudo: true }]],
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
    onRegisterSuccess && onRegisterSuccess();
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

  let content;
  if (didExists) {
    content = <Text color="green.500">You already registered your DID</Text>;
  } else {
    content = (
      <Flex direction="column" float="right">
        <AllowanceButton requiredAllowance={BigInt(100)} address={address} spender={DidKeyRegistryAddress}>
          <Button colorScheme='teal' onClick={callRegisterDid} isLoading={isRegistering || isConfirmingRegistering}>Register</Button>
        </AllowanceButton>
      </Flex>
      
    );
  }

  return (
    <Card p="6" m="6" boxShadow="lg">
      <Heading mb="4" fontSize="2xl">Register a DID</Heading>
      <Box p={4}>
        <Select onChange={(e) => setAddress(e.target.value as `0x${string}`)} width="100%">
          {addresses?.map((address, index) => (
            <option key={index} value={address}>
              {address}
            </option>
          ))}
        </Select>
        <Spacer my={4} />
        {content}
        {isSuccessRegistering && <Text color="green.500">Success!</Text>}
        {registerError && <Text color="red.500">{registerError.toString()}</Text>}
      </Box>
    </Card>
  );
};

export default DidRegistering;
