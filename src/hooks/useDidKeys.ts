import { useReadContract } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress } from '../contracts';

interface DidKey {
  id: string;
  keyType: number;
  keyUsages: readonly `0x${string}`[];
  publicKey: string;
}

const useDidKeys = (did: string) => {
  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: didKeys, isError, isLoading, error, refetch } = useReadContract({
    abi: DidKeyRegistryAbi,
    address: DidKeyRegistryAddress,
    functionName: "getKeys",
    args: [didAddress],
  });

  return { didKeys, isError, isLoading, error, refetch };
};

export default useDidKeys;
export type { DidKey };

