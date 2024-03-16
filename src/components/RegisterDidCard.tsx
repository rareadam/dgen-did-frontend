import React from 'react';
import { Button, Text, useToast, Card, Flex, Box, Heading } from '@chakra-ui/react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { DgenTokenAddress, DidKeyRegistryAbi, DidKeyRegistryAddress } from '../contracts';
import { erc20Abi, keccak256 } from 'viem';
import AllowanceButton from './AllowanceButton';
import GetToken from './GetToken';

const KEY_USAGE_AUTH = keccak256(Buffer.from("auth"));

const REQUIRED_DGEN_BALANCE = BigInt(100);

interface RegisterDidCardProps {
    onSuccess: () => void;
}

const RegisterDidCard = ({onSuccess}: RegisterDidCardProps) => {
    const { address } = useAccount();
    const toast = useToast();

    const { data: dgenBalance, isLoading: isDgenBalanceLoading, isError: isDgenBalanceError, error: dgenBalanceError, refetch: refetchDgenBalance } = useReadContract({ address: DgenTokenAddress, abi: erc20Abi, functionName: 'balanceOf', args: [address ?? '0x'] });

    const { writeContract: registerDid, isPending: isRegistering, data: registerDidHash, isError: isRegisteringError, error: registerDidError } = useWriteContract();
    const { isLoading: isConfirmingRegistering, isSuccess: isSuccessRegistering } = useWaitForTransactionReceipt({ hash: registerDidHash });

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
        onSuccess();
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

    if (isRegisteringError) {
        toast({
            title: 'Registration Failed',
            description: registerDidError instanceof Error ? registerDidError.message : "An unknown error occurred",
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }

    if (isDgenBalanceError) {
        toast({
            title: 'Error fetching DGEN balance',
            description: dgenBalanceError instanceof Error ? dgenBalanceError.message : "An unknown error occurred",
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
                    Hey there, Degens! 🌟 Embark on your journey to digital sovereignty by first claiming some free $DGEN tokens. These tokens are your key to unlocking the next steps in the process. <br />
                    Once you've got your $DGEN, you'll need to grant allowance to our contract. This is a crucial step to ensure your transactions are smooth and secure. <br />
                    With your tokens ready and allowance set, you're all set to register your unique dgenDID. This isn't just any ID; it's your passport to the DeFi universe, elevating your presence in the digital realm. <br />
                    Ready to claim your identity on the blockchain? Follow these steps, and let's embark on this adventure together! 🌊
                </Text>
            </Box>
            <Flex justifyContent="center">
                {(dgenBalance ?? BigInt(0)) >= REQUIRED_DGEN_BALANCE && (
                <AllowanceButton width="50%" requiredAllowance={REQUIRED_DGEN_BALANCE} spender={DidKeyRegistryAddress}>
                    <Button width="50%" colorScheme='teal' onClick={handleRegisterDid} isLoading={isRegistering || isConfirmingRegistering}>Register DID</Button>
                </AllowanceButton>
                )}
                {(dgenBalance ?? BigInt(0)) < REQUIRED_DGEN_BALANCE && (
                <GetToken width="50%" onSuccess={refetchDgenBalance}/>
                )}
            </Flex>
        </Card>
    );
};

export default RegisterDidCard;
