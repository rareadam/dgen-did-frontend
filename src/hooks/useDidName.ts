import { useReadContract } from 'wagmi';
import { DidNameRegistryAbi, DidNameRegistryAddress } from '../contracts';

interface DidName {
  name: string;
}

const useDidName = (did: string) => {
  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: didName, isError, isLoading, error, refetch } = useReadContract({
    abi: DidNameRegistryAbi,
    address: DidNameRegistryAddress,
    functionName: "getNameForDid",
    args: [didAddress],
  });

  return { didName, isError, isLoading, error, refetch };
};

export default useDidName;
