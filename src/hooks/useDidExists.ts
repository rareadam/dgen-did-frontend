import { useReadContract } from 'wagmi';
import { DidKeyRegistryAbi, DidKeyRegistryAddress } from '../contracts';

const useDidExists = (did: string) => {
  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: didExists, isError, isLoading, error, refetch } = useReadContract({
    abi: DidKeyRegistryAbi,
    address: DidKeyRegistryAddress,
    functionName: "didExists",
    args: [didAddress],
  });

  return { didExists, isError, isLoading, error, refetch };
};

export default useDidExists;
