import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BarChart3, ArrowUpRight, ArrowDownRight, Copy, ExternalLink, Share2, Settings, Bell } from 'lucide-react';
import { Transaction } from "@mysten/sui/transactions";

import { BACKEND_URL } from '../config';
import { Info } from 'lucide-react'; // Import the Info icon
import { useWallet } from '../WalletContext';
import { Dialog } from '@headlessui/react';
// import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import toast from 'react-hot-toast';


// Add these interfaces for type safety
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";


const Dashboard = () => {
  const { mutateAsync: signTransaction } = useSignTransaction();
  const suiClient = useSuiClient();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const [tokens, setTokens] = useState<any[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const MAX_POLLING_ATTEMPTS = 20;
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedToken, setSelectedToken] = useState(tokens[0] || null); // Default to first token
  // Add these near your other state declarations
  const [mintOpen, setMintOpen] = useState(false);
  const [burnOpen, setBurnOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [mintAmount, setMintAmount] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [coinObjects, setCoinObjects] = useState<CoinObject[]>([]);
  const [burnCoinId, setBurnCoinId] = useState("");
  const [transferCoinId, setTransferCoinId] = useState("");

  // const account = useCurrentAccount();
  const { address: account, isConnected, network } = useWallet();
  console.log("networkType : ", network)

  useEffect(() => {
    // if (!dashboardRef.current) return;

    const ctx = gsap.context(() => {
      // Animate dashboard elements
      gsap.from('.dashboard-header', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.from('.stat-card', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out'
      });

      gsap.from('.token-card', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out'
      });

      gsap.from('.activity-card', {
        x: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out'
      });

      gsap.from('.chart-card', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
        ease: 'power2.out'
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  // Function to poll for deployed tokens
  const pollForDeployedToken = async () => {
    let attempts = 0;
    setIsPolling(true);

    const poll = async () => {
      attempts++;
      setPollingAttempts(attempts);

      try {
        // Update polling status
        // toast.loading(`Checking token deployment status (attempt ${attempts}/${MAX_POLLING_ATTEMPTS})...`, { id: toastId });

        const res = await fetch(
          `${BACKEND_URL}/api/user_tokens?address=${account}`
        );

        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        // Check if we have new tokens that weren't in our previous state
        const newTokens = data.tokens.filter((newToken: any) =>
          !tokens.some(existingToken =>
            existingToken.packageId === newToken.packageId ||
            existingToken.package_id === newToken.package_id
          )
        );

        if (newTokens.length > 0) {
          // New tokens found!
          setTokens(prev => [...prev, ...newTokens]);
          setIsPolling(false);
          setPollingAttempts(0);
          // toast.success(
          //   `New tokens detected!`,
          //   {
          //     id: toastId,
          //     duration: 5000
          //   }
          // );
          return;
        }

        if (attempts >= MAX_POLLING_ATTEMPTS) {
          setIsPolling(false);
          setPollingAttempts(0);
          // toast.error(
          //   'Token deployment verification timed out. Please check the explorer later.',
          //   { id: toastId }
          // );
          return;
        }

        // Continue polling
        setTimeout(poll, 5000);
      } catch (err) {
        setIsPolling(false);
        setPollingAttempts(0);
        // toast.error('Error verifying deployment. Please try again later.', { id: toastId });
      }
    };

    poll();
  };


  const handleMint = async () => {
    if (!selectedToken || !mintAmount || !mintRecipient) {
      toast.error("Missing required fields.");
      return;
    }
  
    const mintToast = toast.loading("Minting in progress...");
  
    try {
      const moduleName = selectedToken.symbol.toLowerCase();
      const tx = new Transaction();
      tx.moveCall({
        target: `${selectedToken.package_id}::${moduleName}::mint`,
        arguments: [
          tx.object(selectedToken.treasury_cap_id),
          tx.pure("u64", BigInt(mintAmount)),
          tx.pure("address", mintRecipient),
        ],
      });
  
      const signedTx = await signTransaction({ transaction: tx });
      await suiClient.executeTransactionBlock({
        transactionBlock: signedTx.bytes,
        signature: signedTx.signature,
        options: { showEffects: true, showEvents: true },
      });
  
      toast.success("Token minted successfully!", { id: mintToast });
  
      // Refresh token data
      pollForDeployedToken();
      setMintOpen(false);
    } catch (error) {
      console.error('Minting failed:', error);
      toast.error("Minting failed. Please try again.", { id: mintToast });
    }
  };
  
  const handleBurn = async () => {
    if (!selectedToken || !burnCoinId) {
      toast.error('Please select a token and coin to burn');
      return;
    }
  
    const toastId = toast.loading('Burning token...');
    console.log("Inside the Burn function", selectedToken);
  
    try {
      const moduleName = selectedToken.symbol.toLowerCase();
      console.log("ModuleName", moduleName);
      const tx = new Transaction();
      console.log('Transaction Hash:', tx);
      
      tx.moveCall({
        target: `${selectedToken.package_id}::${moduleName}::burn`,
        arguments: [
          tx.object(selectedToken.treasury_cap_id), // TreasuryCap object
          tx.object(burnCoinId), // Coin object to burn
        ],
      });
  
      console.log("After transaction Execution");
      const signed = await signTransaction({ transaction: tx });
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: signed.bytes,
        signature: signed.signature,
        options: { showEffects: true, showEvents: true },
      });
  
      // Call backend to delete token record
      await toast.promise(
        fetch(`${BACKEND_URL}/delete_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ package_id: selectedToken.package_id }),
        }),
        {
          loading: 'Updating records...',
          success: 'Records updated!',
          error: 'Failed to update records'
        }
      );
  
      console.log("Result :", result);
      if (result.effects?.status.status === "success") {
        toast.success('Burn successful!', { id: toastId });
        console.log("Burn successful!");
        // Refresh token data and coin objects
        pollForDeployedToken();
        fetchCoinObjects(selectedToken);
        setBurnOpen(false);
        setBurnCoinId("");
      } else {
        throw new Error(result.effects?.status.error || "Burn failed");
      }
    } catch (error) {
      console.error('Burning failed:', error);
      toast.error(`Burning failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
    }
  };
  
  
  const handleTransfer = async () => {
    console.log("Checking the transfer:::");
    if (!selectedToken || !transferCoinId  || !transferRecipient) {
      toast.error('Please fill all transfer fields');
      return;
    }
  
    const toastId = toast.loading('Processing transfer...');
  
    try {
      // Validate the amount is positive and doesn't exceed balance
      const coinToTransfer = coinObjects.find(c => c.coinObjectId === transferCoinId);
      if (!coinToTransfer) {
        throw new Error('Selected coin not found');
      }
  
  
  
      // Create and execute the transfer transaction
      const moduleName = selectedToken.symbol.toLowerCase();
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${selectedToken.package_id}::${moduleName}::transfer`,
        arguments: [
          tx.object(transferCoinId),
          tx.pure("address", transferRecipient),
        ],
      });
  
      const signedTx = await signTransaction({ transaction: tx });
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: signedTx.bytes,
        signature: signedTx.signature,
        options: { showEffects: true },
      });
  
      if (result.effects?.status.status === "success") {
        toast.success('Transfer completed successfully!', { id: toastId });
        
        // Update backend if needed (optional)
        try {
          await fetch(`${BACKEND_URL}/update_token_owner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              package_id: selectedToken.package_id,
              new_owner: transferRecipient,
              amount: transferAmount,
            }),
          });
        } catch (backendError) {
          console.error('Backend update failed:', backendError);
        }
  
        // Refresh data
        await fetchCoinObjects(selectedToken);
        setTransferOpen(false);
        setTransferAmount("");
        setTransferRecipient("");
        setTransferCoinId("");
      } else {
        throw new Error(result.effects?.status.error || "Transfer failed");
      }
    } catch (error) {
      console.error('Transfer failed:', error);
      toast.error(`Transfer failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
    }
  };


  const openTransferDialog = async (token: any) => {
    setSelectedToken(token);
    setTransferCoinId("");
    setTransferAmount("");
    setTransferRecipient("");
    
    try {
      await fetchCoinObjects(token);
      setTransferOpen(true);
    } catch (error) {
      console.error("Failed to fetch coin objects:", error);
      toast.error("Failed to load token balances");
      setTransferOpen(true); // Still open dialog but will show error state
    }
  };
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (activeTooltip &&
        tooltipRefs.current[activeTooltip] &&
        !tooltipRefs.current[activeTooltip]?.contains(event.target as Node)) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTooltip]);

  const toggleTooltip = (tokenId: string) => {
    setActiveTooltip(activeTooltip === tokenId ? null : tokenId);
  };

  // Mock chart data - in a real app this would come from an API
  const chartData = [
    { date: '1 May', value: 65 },
    { date: '2 May', value: 68 },
    { date: '3 May', value: 62 },
    { date: '4 May', value: 75 },
    { date: '5 May', value: 72 },
    { date: '6 May', value: 78 },
    { date: '7 May', value: 85 },
    { date: '8 May', value: 82 },
    { date: '9 May', value: 91 },
    { date: '10 May', value: 98 },
    { date: '11 May', value: 105 },
    { date: '12 May', value: 115 },
    { date: '13 May', value: 120 },
    { date: '14 May', value: 118 },
  ];

  // Calculate chart values
  const maxValue = Math.max(...chartData.map(item => item.value)) * 1.1;
  const minValue = Math.min(...chartData.map(item => item.value)) * 0.9;

  // Chart dimensions
  const chartHeight = 160;
  const chartWidth = 100;

  // Convert data points to SVG path
  const createChartPath = () => {
    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight;
      return `${x},${y}`;
    });

    return `M0,${chartHeight} L${points.join(' L')} L${chartWidth},${chartHeight} Z`;
  };

  useEffect(() => {
    const toastId = 'token-polling';

    if (!account) return;
    // Start polling when component mounts
    pollForDeployedToken();

    // Cleanup function to cancel any ongoing polling when component unmounts
    return () => {
      setIsPolling(false);
      setPollingAttempts(0);
    };
  }, [account]);

  const openBurnDialog = async (token : any ) => {
    setSelectedToken(token);
    setBurnCoinId("");
    try {
      await fetchCoinObjects(token);
      setBurnOpen(true);
    } catch (error) {
      console.error("Failed to fetch coin objects:", error);
      setBurnOpen(true); // Still open dialog but will show error state
    }
  };



  // Fetch user's Coin<TOKEN> objects for the selected token
const fetchCoinObjects = async (token : any ) => {
  if (!account || !token) return;
  
  try {
    const moduleName = token.symbol.toLowerCase();
    const coinType = `${token.package_id}::${moduleName}::${token.symbol}`;
    
    // First try with pagination
    let allCoins : any  = [];
    let cursor = null;
    let hasNextPage = true;
    
    while (hasNextPage) {
      const coins = await suiClient.getCoins({
        owner: account,
        coinType,
        cursor,
        limit: 50 // Fetch in batches of 50
      });
      
      allCoins = [...allCoins, ...coins.data];
      hasNextPage = coins.hasNextPage;
      cursor = coins.nextCursor;
    }
    
    setCoinObjects(allCoins);
    
    if (allCoins.length === 0) {
      // onSnackbar && onSnackbar(`No ${token.symbol} coins found for your address`, "info");
      console.log("Logs are generated", `${token.symbol}` );
    }
  } catch (e) {
    console.error("Error fetching coin objects:", e);
    setCoinObjects([]);
    console.log(`Failed to fetch ${token.symbol} coins: ${e.message}`, "error");
  }
};

  // Create stroke path (without the closing line to the bottom)
  const createStrokePath = () => {
    const points = chartData.map((point, index) => {
      const x = (index / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight;
      return `${x},${y}`;
    });

    return `M${points.join(' L')}`;
  };

  return (
    <div ref={dashboardRef} className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="dashboard-header flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Token Dashboard</h1>
            <p className="text-white/70">Manage and monitor your tokens</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="btn-secondary p-2">
              <Bell size={20} />
            </button>
            <button className="btn-secondary p-2">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stat 1 */}
          <div className="stat-card glass-card p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="text-white/60 text-sm">Total Value</div>
              <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                <ArrowUpRight size={12} className="mr-1" /> 12.5%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">$24,568.80</div>
            <div className="text-xs text-white/50">Across all tokens</div>
          </div>

          {/* Stat 2 */}
          <div className="stat-card glass-card p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="text-white/60 text-sm">24h Volume</div>
              <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center">
                <ArrowDownRight size={12} className="mr-1" /> 3.2%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">$1,245.32</div>
            <div className="text-xs text-white/50">Total trading volume</div>
          </div>

          {/* Stat 3 */}
          <div className="stat-card glass-card p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="text-white/60 text-sm">Total Tokens</div>
              <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                <ArrowUpRight size={12} className="mr-1" /> 2
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">3</div>
            <div className="text-xs text-white/50">Active deployments</div>
          </div>

          {/* Stat 4 */}
          <div className="stat-card glass-card p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="text-white/60 text-sm">Token Holders</div>
              <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                <ArrowUpRight size={12} className="mr-1" /> 5.8%
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">247</div>
            <div className="text-xs text-white/50">Across all tokens</div>
          </div>
        </div>

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Token list */}
          <div className="token-card glass-card p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Your Tokens</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
              {tokens.map((token) => (
                <div
                  key={token.package_id}
                  className={`p-4 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer flex items-center relative ${selectedToken?.package_id === token.package_id
                    ? 'border border-indigo-500/50 animate-glow'
                    : 'border border-transparent'
                    }`}
                  onClick={() => setSelectedToken(token)}
                >

                  {/* Add inner glow effect */}
                  {selectedToken?.package_id === token.package_id && (
                    <div className="absolute inset-0 rounded-lg bg-indigo-500/10 pointer-events-none" />
                  )}
                  {/* Token image */}
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={token.metadata_uri}
                      alt={`${token.name} Token`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // target.src = 'https://via.placeholder.com/40/6d28d9/FFFFFF?text=' + token.symbol.substring(0, 3);
                      }}
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium truncate">{token.name}</div>
                      <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex-shrink-0
               animate-[breathing_3s_ease-in-out_infinite]">
                        {"Active"}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-white/70 truncate mr-2">{token.symbol}</div>
                      <div className="text-white/70 truncate">Initial Supply: {token.initial_supply}</div>
                    </div>
                  </div>

                  {/* Info button with properly positioned tooltip */}
                  <div className="relative flex-shrink-0 ml-2">
                    <button
                      className="text-white/50 hover:text-white transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTooltip(token.package_id);
                      }}
                    >
                      <Info size={16} />
                    </button>

                    {/* Tooltip positioned to appear above the token card */}
                    {activeTooltip === token.package_id && (
                      <div
                        ref={el => tooltipRefs.current[token.package_id] = el}
                        className="absolute z-20 right-full top-1/2 mr-2 transform -translate-y-1/2 w-64 p-3 bg-gray-800 rounded-lg shadow-lg text-sm transition-all duration-200 visible opacity-100"
                      >
                        {token.description}
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-gray-800"></div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full btn-secondary text-sm py-2">
              Create New Token
            </button>
          </div>


          {/* Recent activity */}
          <div className="activity-card glass-card p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Token Activity</h2>

            <div className="space-y-4">
              {/* Activity 1 */}
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Transfer</div>
                    <div className="text-white/70 text-sm">AWE • 1,000 tokens</div>
                  </div>
                  <div className="text-white/50 text-sm">1 hour ago</div>
                </div>
                <div className="text-xs text-white/50 flex items-center mt-2">
                  <span className="block truncate">0x7a23...45e9</span>
                  <ArrowUpRight size={12} className="mx-2" />
                  <span className="block truncate">0x3f89...12c4</span>
                  <button className="ml-2 text-indigo-400 hover:text-indigo-300 transition">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Liquidity Added</div>
                    <div className="text-white/70 text-sm">SUPER • 5,000 tokens</div>
                  </div>
                  <div className="text-white/50 text-sm">3 hours ago</div>
                </div>
                <div className="text-xs text-white/50 flex items-center mt-2">
                  <span className="block truncate">0x7a23...45e9</span>
                  <button className="ml-2 text-indigo-400 hover:text-indigo-300 transition">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">Swap</div>
                    <div className="text-white/70 text-sm">MEGA • 2,500 tokens for 1.5 ETH</div>
                  </div>
                  <div className="text-white/50 text-sm">5 hours ago</div>
                </div>
                <div className="text-xs text-white/50 flex items-center mt-2">
                  <span className="block truncate">0x3f89...12c4</span>
                  <button className="ml-2 text-indigo-400 hover:text-indigo-300 transition">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>

            <button className="mt-4 w-full btn-secondary text-sm py-2">
              View All Activity
            </button>
          </div>
        </div>

        <div className="mt-8 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{selectedToken?.name || 'Token'} Details</h2>
            <div className="flex space-x-2">
              {/* Copy Address Button */}
              <button
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition relative group"
                title="Copy Address"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(selectedToken?.package_id || '');
                    // Show copied tooltip
                    const button = event.currentTarget;
                    button.classList.add('copied');
                    setTimeout(() => button.classList.remove('copied'), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
              >
                <Copy size={16} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-[.copied]:opacity-100 transition-opacity">
                  Copied!
                </span>
              </button>

              {/* View on Explorer Button */}
              <button
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                title="View on Explorer"
                onClick={() => {
                  if (selectedToken?.package_id) {
                    // Use a real blockchain explorer URL based on network
                    let explorerUrl;
                    switch (selectedToken.network) {
                      case 'Ethereum':
                        // explorerUrl = `https://etherscan.io/token/${selectedToken.package_id}`;
                        explorerUrl = `https://suiexplorer.com/object/${selectedToken.package_id}?network=testnet`
                        break;
                      case 'Polygon':
                        explorerUrl = `https://polygonscan.com/token/${selectedToken.package_id}`;
                        break;
                      // Add more networks as needed
                      default:
                        explorerUrl = `https://suiexplorer.com/object/${selectedToken.package_id}?network=testnet`
                    }
                    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <ExternalLink size={16} />
              </button>

              {/* Share Button */}
              <button
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition relative group"
                title="Share"
                onClick={async () => {
                  try {
                    const shareData = {
                      title: `${selectedToken?.name} Token Details`,
                      text: `Check out ${selectedToken?.name} (${selectedToken?.symbol}) token`,
                      Network: `Sui Testnet`,
                      TotalSupply : selectedToken?.initial_supply,
                      Decimals : selectedToken?.decimals,
                      url: window.location.href,
                    };

                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      // Fallback for desktop
                      await navigator.clipboard.writeText(window.location.href);
                      const button = event.currentTarget;
                      button.classList.add('shared');
                      setTimeout(() => button.classList.remove('shared'), 2000);
                    }
                  } catch (err) {
                    console.error('Error sharing:', err);
                  }
                }}
              >
                <Share2 size={16} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-[.shared]:opacity-100 transition-opacity">
                  Link Copied!
                </span>
              </button>
            </div>
          </div>

          {/* Token details card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-white/50 text-sm mb-1">Package ID </h3>
              <div className="text-sm font-mono bg-white/5 p-2 rounded flex items-center justify-between">
                <span className="truncate">{selectedToken?.package_id || 'N/A'}</span>
                <Copy
                  size={14}
                  className="cursor-pointer text-white/70 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(selectedToken?.package_id || '')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-white/50 text-sm mb-1">Network</h3>
              <div className="text-sm">{selectedToken?.network || 'SUI Testnet'}</div>
            </div>

            <div>
              <h3 className="text-white/50 text-sm mb-1">Standard</h3>
              <div className="text-sm">{selectedToken?.standard || 'Fully Fungible-token'}</div>
            </div>

            <div>
              <h3 className="text-white/50 text-sm mb-1">Total Supply</h3>
              <div className="text-sm">
                {selectedToken?.initial_supply
                  ? `${selectedToken.initial_supply.toLocaleString()} ${selectedToken.symbol}`
                  : 'N/A'}
              </div>
            </div>

            <div>
              <h3 className="text-white/50 text-sm mb-1">Decimals</h3>
              <div className="text-sm">{selectedToken?.decimals || '18'}</div>
            </div>
            {/* Add this section inside your Token Details card, after the existing details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="btn-primary py-2 px-4 rounded-lg flex items-center justify-center"
                onClick={() => setMintOpen(true)}
              >
                <ArrowUpRight size={16} className="mr-2" />
                Mint Tokens
              </button>

              <button
                className="btn-secondary py-2 px-4 rounded-lg flex items-center justify-center"
                onClick={() => selectedToken && openBurnDialog(selectedToken)}
                >
                <ArrowDownRight size={16} className="mr-2" />
                Burn Tokens
              </button>

              <button
                className="btn-tertiary py-2 px-4 rounded-lg flex items-center justify-center"
                onClick={() => selectedToken && openTransferDialog(selectedToken)}
              >
                <Share2 size={16} className="mr-2" />
                Transfer Tokens
              </button>
            </div>

          </div>
        </div>
        <br />
        {/* Performance chart */}
        <div className="chart-card glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Token Performance</h2>
            <div className="flex items-center space-x-3">
              <select className="form-input bg-white/5 py-1 px-3 text-sm">
                <option>Awesome Token (AWE)</option>
                <option>Super Coin (SUPER)</option>
                <option>Mega Token (MEGA)</option>
              </select>
              <select className="form-input bg-white/5 py-1 px-3 text-sm">
                <option>Last 14 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-end space-x-2">
              <div className="text-3xl font-bold">$0.42</div>
              <div className="text-green-400 flex items-center">
                <ArrowUpRight size={16} className="mr-1" />
                5.3%
              </div>
            </div>
            <div className="text-white/50 text-sm">Current price</div>
          </div>

          <div className="h-[200px] w-full relative">
            {/* SVG Chart */}
            <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              {/* Chart gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Fill area */}
              <path
                d={createChartPath()}
                fill="url(#chartGradient)"
                stroke="none"
              />

              {/* Line */}
              <path
                d={createStrokePath()}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* X-axis labels - simplified for this example */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/50">
              <span>1 May</span>
              <span>7 May</span>
              <span>14 May</span>
            </div>
          </div>
        </div>
      </div>
{/* Mint Dialog */}
<Dialog open={mintOpen} onClose={() => setMintOpen(false)} className="relative z-50">
  {/* Background overlay */}
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  
  {/* Dialog container */}
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="glass-card p-6 max-w-md w-full rounded-lg">
      <Dialog.Title className="text-xl font-semibold mb-4">Mint Tokens</Dialog.Title>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-1">Amount</label>
          <input
            type="number"
            className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder="Enter amount to mint"
          />
        </div>
        <div>
          <label className="block text-sm text-white/70 mb-1">Recipient Address</label>
          <input
            type="text"
            className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
            value={mintRecipient}
            onChange={(e) => setMintRecipient(e.target.value)}
            placeholder="Enter recipient address"
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="btn-secondary px-4 py-2"
          onClick={() => setMintOpen(false)}
        >
          Cancel
        </button>
        <button 
          className="btn-primary px-4 py-2"
          onClick={handleMint}
        >
          Confirm Mint
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


{/* Burn Dialog */}
<Dialog open={burnOpen} onClose={() => setBurnOpen(false)} className="relative z-50">
  {/* Background overlay */}
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  
  {/* Dialog container */}
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="glass-card p-6 max-w-md w-full rounded-lg">
      <Dialog.Title className="text-xl font-semibold mb-4">Burn Tokens</Dialog.Title>
      
      <div className="space-y-4">
        {coinObjects.length > 0 ? (
          <div>
            <label className="block text-sm text-white/70 mb-1">Select Coin to Burn</label>
            <select
              className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
              value={burnCoinId}
              onChange={(e) => setBurnCoinId(e.target.value)}
            >
              <option value="">Select a coin</option>
              {coinObjects.map((obj) => (
                <option key={obj.coinObjectId} value={obj.coinObjectId}>
                  {obj.coinObjectId.slice(0, 8)}... (Balance: {obj.balance})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-white/70 text-sm py-2">
            No coin objects found for this token
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="btn-secondary px-4 py-2"
          onClick={() => setBurnOpen(false)}
        >
          Cancel
        </button>
        <button 
          className="btn-primary px-4 py-2"
          onClick={handleBurn}
          // disabled={!burnCoinId || coinObjects.length === 0}
        >
          Confirm Burn
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

{/* Transfer Dialog */}
<Dialog open={transferOpen} onClose={() => setTransferOpen(false)} className="relative z-50">
  {/* Background overlay */}
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  
  {/* Dialog container */}
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="glass-card p-6 max-w-md w-full rounded-lg">
      <Dialog.Title className="text-xl font-semibold mb-4">Transfer Tokens</Dialog.Title>
      
      <div className="space-y-4">
        {coinObjects.length > 0 ? (
          <>
            <div>
              <label className="block text-sm text-white/70 mb-1">Select Coin to Transfer</label>
              <select
                className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                value={transferCoinId}
                onChange={(e) => setTransferCoinId(e.target.value)}
              >
                <option value="">Select a coin</option>
                {coinObjects.map((obj) => (
                  <option key={obj.coinObjectId} value={obj.coinObjectId}>
                    {obj.coinObjectId.slice(0, 8)}... (Balance: {obj.balance})
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm text-white/70 mb-1">Amount</label>
              <input
                type="number"
                className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Enter amount to transfer"
              />
            </div> */}
            <div>
              <label className="block text-sm text-white/70 mb-1">Recipient Address</label>
              <input
                type="text"
                className="form-input w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                placeholder="Enter recipient address"
              />
            </div>
          </>
        ) : (
          <div className="text-white/70 text-sm py-2">
            No coin objects found for this token
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button 
          className="btn-secondary px-4 py-2"
          onClick={() => setTransferOpen(false)}
        >
          Cancel
        </button>
        <button 
          className="btn-primary px-4 py-2"
          onClick={handleTransfer}
          disabled={!transferCoinId  || !transferRecipient || coinObjects.length === 0}
        >
          Confirm Transfer
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>


    </div>
  );
};

export default Dashboard;