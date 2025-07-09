interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
}

interface Window {
  ethereum?: EthereumProvider;
}
