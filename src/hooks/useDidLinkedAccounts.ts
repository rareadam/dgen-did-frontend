import { useReadContract } from 'wagmi';
import { DidAccountLinkRegistryAbi, DidAccountLinkRegistryAddress } from '../contracts';

interface LinkedAccount {
  id: string;
  account: `0x${string}`;
  purpose: string;
}

const useDidLinkedAccounts = (did: string) => {
  const didAddress = did.replace(/^did:de?gen:zksync:/, "") as `0x${string}`;

  const { data: linkedAccounts, isError, isLoading, error, refetch } = useReadContract({
    abi: DidAccountLinkRegistryAbi,
    address: DidAccountLinkRegistryAddress,
    functionName: "getLinkedAccounts",
    args: [didAddress],
  });

  return { linkedAccounts, isError, isLoading, error, refetch };
};

export default useDidLinkedAccounts;
export type { LinkedAccount, useDidLinkedAccounts };

