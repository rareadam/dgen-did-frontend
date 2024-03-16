import { useReadContract } from 'wagmi';
import { DidServiceAccountRegistryAbi, DidServiceAccountRegistryAddress } from '../contracts';

interface ServiceAccount {
  id: string;
  serviceType: number;
  serviceEndpoint: string;
}

const useDidServiceAccounts = (did: string) => {
  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: serviceAccounts, isError, isLoading, error, refetch } = useReadContract({
    abi: DidServiceAccountRegistryAbi,
    address: DidServiceAccountRegistryAddress,
    functionName: "getServiceAccounts",
    args: [didAddress],
  });

  return { serviceAccounts, isError, isLoading, error, refetch };
};

export default useDidServiceAccounts;
