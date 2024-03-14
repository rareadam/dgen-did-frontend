import { DgenTokenAddress } from "../contracts";
import { Card, Heading, Flex, Select, Text } from "@chakra-ui/react";
import { erc20Abi } from "viem";
import { useAccount, useSwitchChain, useBlockNumber, useBalance, useReadContract } from "wagmi";
import SendDgenToken from "./SendDgenToken";
import SendNativeToken from "./SendNativeToken";

function ConnectedCard() {
    const { isConnected, address, chain } = useAccount();
    const { chains, switchChain } = useSwitchChain();
    const { data: blockNumber } = useBlockNumber();
    const { data: balance } = useBalance({
        address,
    });

    // Added for DgenToken balance
    const { data: DgenTokenBalance, error, isLoading } = useReadContract({
        address: DgenTokenAddress, // Replace with actual DgenToken contract address
        abi: erc20Abi, // Replace with actual DgenToken ABI
        functionName: "balanceOf",
        args: [address || '0x'],
    });

    let tokenBalance;
    if (error) {
        tokenBalance = "Error fetching balance";
    } else if (isLoading) {
        tokenBalance = "Loading...";
    } else {
        tokenBalance = DgenTokenBalance?.toString();
    }

    return (
        <Card p="6" m="6" boxShadow="lg">
            <Heading mb="4" fontSize="2xl">
                Connected Wallet
            </Heading>
            <Flex direction="row">
                <Text pt="2">{isConnected ? address : "Not Connected"}</Text>
                {isConnected && (
                    <Select
                        pl="2"
                        w="auto"
                        value={chain?.id}
                        onChange={(e) => {
                            switchChain({
                                chainId: parseInt(e.target.value),
                            });
                        }}
                    >
                        {chains.map((chain) => (
                            <option key={chain.id} value={chain.id}>
                                {chain.name} (ID: {chain.id})
                            </option>
                        ))}
                    </Select>
                )}
            </Flex>
            {isConnected && (
                <>
                    <Text mb="4">Current Block: {blockNumber?.toString()}</Text>
                    <Flex direction={"row"}>
                        <Text pt="2" mb="4">Balance: {balance?.formatted} ${balance?.symbol}</Text>
                        <SendNativeToken />
                    </Flex>
                    <Flex direction={"row"}>
                        <Text pt="2" mb="4">DgenToken Balance: {tokenBalance} $DGN</Text>
                        <SendDgenToken />
                    </Flex>
                </>
            )}
        </Card>
    );
}

export default ConnectedCard;


