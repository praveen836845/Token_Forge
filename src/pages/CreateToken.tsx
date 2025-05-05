import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, ArrowRight, CheckCircle2, Info, HelpCircle, PlusCircle,ImageIcon, Shield, CreditCard ,Copy, ExternalLink} from 'lucide-react';
import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { BACKEND_URL } from '../config'; // Make sure to configure this
import toast from 'react-hot-toast';
const FACTORY_PACKAGE_ID = "0xc17a461ed86747587def7cd511e42f63fa147fa73d085ebb936162ab6465529a";
const FACTORY_MODULE = "factory";
const FACTORY_FUNCTION = "create_token";
// Token types
const TOKEN_TYPES = [
  {
    id: 'standard',
    name: 'Standard Token',
    description: 'Basic ERC-20/BEP-20 token with transfer and balance functionality',
    features: ['Transfers', 'Balances', 'Approvals'],
    recommended: false,
    disabled: true
  },
  {
    id: 'mintable',
    name: 'Mintable Token',
    description: 'Create new tokens after deployment with minting capability',
    features: ['Transfers', 'Balances', 'Approvals', 'Minting'],
    recommended: false,
    disabled: true
  },
  {
    id: 'burnable',
    name: 'Burnable Token',
    description: 'Allows token holders to destroy their tokens',
    features: ['Transfers', 'Balances', 'Approvals', 'Burning'],
    recommended: false,
    disabled: true
  },
  {
    id: 'full',
    name: 'Full Featured Token',
    description: 'Complete token with all features and customizable tax mechanism',
    features: ['Transfers', 'Balances', 'Approvals', 'Minting', 'Burning', 'Tax Mechanism', 'Blacklisting'],
    recommended: true,
    disabled: false
  }
];

// Blockchain networks
const NETWORKS = [
  { id: 'sui', name: 'Sui', logo: 'SUI', color: 'from-blue-500 to-indigo-600', disabled: false }
];

const CreateToken = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [tokenDetails, setTokenDetails] = useState({
    name: '',
    symbol: '',
    decimals: '18',
    totalSupply: '1000000',
    metadataURI: '',  // Added metadata URI field
    description: ''
  });
  const account = useCurrentAccount();
  const [deploymentCompleted, setDeploymentCompleted] = useState(false);
  const { mutateAsync: signTransaction } = useSignTransaction();
  const suiClient = useSuiClient();
  const [deploying, setDeploying] = useState(false);
  const [deployedToken, setDeployedToken] = useState(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    stepsRef.current = Array(4).fill(null);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(stepsRef.current.map((_, i) => `.step-${i + 1}`), {
        opacity: 0,
        visibility: 'hidden',
        display: 'none'
      });

      gsap.set(`.step-${currentStep}`, {
        display: 'block',
        visibility: 'visible'
      });

      gsap.to(`.step-${currentStep}`, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.to('.progress-bar-inner', {
        width: `${(currentStep / 4) * 100}%`,
        duration: 0.6,
        ease: 'power2.inOut'
      });
    }, pageRef);

    return () => ctx.revert();
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTokenTypeSelect = (typeId: string) => {
    const type = TOKEN_TYPES.find(t => t.id === typeId);
    if (type && !type.disabled) {
      setSelectedType(typeId);
    }
  };

  const handleNetworkSelect = (networkId: string) => {
    const network = NETWORKS.find(n => n.id === networkId);
    if (network && !network.disabled) {
      setSelectedNetwork(networkId);
    }
  };

  const handleTokenDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {  // Updated type to include textarea
    const { name, value } = e.target;
    setTokenDetails({
      ...tokenDetails,
      [name]: value
    });
  };

  const formatNumber = (num: string | number) => {
    return new Intl.NumberFormat('en-US').format(Number(num));
  };

  function pollForDeployedToken(toastId: string) {
    const MAX_ATTEMPTS = 20;
    let attempts = 0;

    async function poll() {
      attempts++;
      try {
        // Update polling status
        console.log("Connected Address", account);
        toast.loading(`Checking deployment status (attempt ${attempts}/${MAX_ATTEMPTS})...`, { id: toastId });

        const res = await fetch(
          `${BACKEND_URL}/api/user_tokens?address=${account?.address}`
        );

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const found = data.tokens.find(
          (t: any) =>
            t.name === tokenDetails.name &&
            t.symbol === tokenDetails.symbol &&
            (t.packageId || t.package_id)
        );

        if (found) {
          setDeploying(false);
          setDeployedToken(found);
          setDeploymentCompleted(true); // Add this line
          toast.success(
            `Token deployed successfully!\nPackage ID: ${found.package_id || found.packageId}`,
            {
              id: toastId,
              duration: 10000 // Show for 10 seconds
            }
          );
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setDeploying(false);
          toast.error(
            'Token deployment verification timed out. Please check the explorer later.',
            { id: toastId }
          );
          return;
        }

        setTimeout(poll, 9000);
      } catch (err) {
        setDeploying(false);
        toast.error('Error verifying deployment. Please try again later.', { id: toastId });
      }
    }

    poll();
  }
  function getDisplayableImageUrl(originalUrl: string) {
    // Handle Contentful URLs specifically
    if (originalUrl.includes('ctfassets.net')) {
      // Remove processing parameters to get the original image
      return originalUrl.split('?')[0] + '?fm=jpg&fl=progressive';
    }
    return originalUrl;
  }

  const handleDeployToken = async () => {
    setDeploying(true);
    console.log("Account Address: ", account);
    if (!account) {
      toast.error("Please connect your wallet first!");
      setDeploying(false);
      return;
    }

    // Show loading toast
    const toastId = toast.loading('Preparing transaction...');

    try {
      const nameBytes = new TextEncoder().encode(tokenDetails.name);
      const symbolBytes = new TextEncoder().encode(tokenDetails.symbol);
      const decimalsNum = Number(tokenDetails.decimals);
      const initialSupplyBig = BigInt(tokenDetails.totalSupply);
      const metadataBytes = new TextEncoder().encode(tokenDetails.metadataURI);
      const descriptionBytes = new TextEncoder().encode(tokenDetails.description);

      // Update toast message
      toast.loading('Building transaction...', { id: toastId });

      const tx = new Transaction();
      tx.moveCall({
        target: `${FACTORY_PACKAGE_ID}::${FACTORY_MODULE}::${FACTORY_FUNCTION}`,
        arguments: [
          tx.pure("vector<u8>",  nameBytes),
          tx.pure("vector<u8>", symbolBytes),
          tx.pure("u8", decimalsNum),
          tx.pure("u64", initialSupplyBig),
          tx.pure("vector<u8>", metadataBytes),
          tx.pure("vector<u8>", descriptionBytes),
        ],
      });
      console.log("checking the Debugging");

      // Update toast message
      toast.loading('Waiting for wallet approval...', { id: toastId });

      const signed = await signTransaction({ transaction: tx });

      // Update toast message
      toast.loading('Executing transaction...', { id: toastId });

      const result = await suiClient.executeTransactionBlock({
        transactionBlock: signed.bytes,
        signature: signed.signature,
        options: { showEffects: true, showEvents: true },
      });

      // Success message
      toast.success('Token deployment initiated!', { id: toastId });

      // Start polling for deployment status
      pollForDeployedToken(toastId);
    } catch (err: any) {
      // Error message
      toast.error(`Transaction failed: ${err.message}`, { id: toastId });
      setDeploying(false);
    }
  };

  const walletConnected = false; // This should be managed by your wallet connection logic

  return (
    <div ref={pageRef} className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Token</h1>
        <p className="text-white/70 mb-10">
          Follow the steps below to create and deploy your custom token.
        </p>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className={currentStep >= 1 ? 'text-indigo-400' : 'text-white/50'}>Token Type</span>
            <span className={currentStep >= 2 ? 'text-indigo-400' : 'text-white/50'}>Network</span>
            <span className={currentStep >= 3 ? 'text-indigo-400' : 'text-white/50'}>Token Details</span>
            <span className={currentStep >= 4 ? 'text-indigo-400' : 'text-white/50'}>Review & Deploy</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="progress-bar-inner h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Step 1: Token Type */}
        <div
          ref={el => stepsRef.current[0] = el}
          className="step-1"
        >
          <h2 className="text-2xl font-semibold mb-6">Select Token Type</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {TOKEN_TYPES.map(type => (
              <div
                key={type.id}
                className={`glass-card p-6 border-2 transition-all relative ${type.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : selectedType === type.id
                    ? 'border-indigo-500 bg-indigo-900/20 cursor-pointer'
                    : 'border-transparent hover:border-white/20 cursor-pointer'
                  }`}
                onClick={() => !type.disabled && handleTokenTypeSelect(type.id)}
              >
                {type.recommended && (
                  <span className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                {type.disabled && (
                  <span className="absolute -top-3 -right-3 bg-gray-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                )}

                <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
                <p className="text-white/70 text-sm mb-4">{type.description}</p>

                <ul className="space-y-2">
                  {type.features.map(feature => (
                    <li key={feature} className="flex items-center text-sm">
                      <CheckCircle2 size={16} className="text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div></div> {/* Empty div for spacing */}
            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!selectedType}
            >
              Continue <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Step 2: Network */}
        <div
          ref={el => stepsRef.current[1] = el}
          className="step-2"
          style={{ display: 'none' }}
        >
          <h2 className="text-2xl font-semibold mb-6">Select Blockchain Network</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {NETWORKS.map(network => (
              <div
                key={network.id}
                className={`glass-card p-6 flex items-center border-2 transition-all ${network.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : selectedNetwork === network.id
                    ? 'border-indigo-500 bg-indigo-900/20 cursor-pointer'
                    : 'border-transparent hover:border-white/20 cursor-pointer'
                  }`}
                onClick={() => !network.disabled && handleNetworkSelect(network.id)}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${network.color} flex items-center justify-center text-white font-bold mr-4`}>
                  {network.logo}
                </div>
                <span className="font-medium">{network.name}</span>
                {network.disabled && (
                  <span className="ml-auto text-xs text-white/50">Coming Soon</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              className="btn-secondary"
              onClick={handlePrevStep}
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>

            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!selectedNetwork}
            >
              Continue <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Step 3: Token Details */}
        <div
          ref={el => stepsRef.current[2] = el}
          className="step-3"
          style={{ display: 'none' }}
        >
          <h2 className="text-2xl font-semibold mb-6">Enter Token Details</h2>

          <div className="glass-card p-6 mb-10">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Token Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={tokenDetails.name}
                  onChange={handleTokenDetailChange}
                  placeholder="e.g., My Awesome Token"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Token Symbol <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={tokenDetails.symbol}
                  onChange={handleTokenDetailChange}
                  placeholder="e.g., MAT"
                  className="form-input"
                  required
                  maxLength={8}
                />
                <p className="text-xs text-white/50 mt-1">
                  Maximum 8 characters. This will be displayed on exchanges.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Metadata URI
                  <span className="ml-2 inline-flex items-center text-white/50">
                    <Info size={14} className="mr-1" />
                    <span className="text-xs">Link to token metadata</span>
                  </span>
                </label>
                <input
                  type="url"
                  name="metadataURI"
                  value={tokenDetails.metadataURI}
                  onChange={handleTokenDetailChange}
                  placeholder="https://example.com/token-metadata.json"
                  className="form-input"
                />
              </div>

              {/* Added Description field */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={tokenDetails.description}
                  onChange={handleTokenDetailChange}
                  placeholder="Describe your token's purpose and features"
                  className="form-input min-h-[100px]"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Decimals
                  <span className="ml-2 inline-flex items-center text-white/50">
                    <Info size={14} className="mr-1" />
                    <span className="text-xs">Standard is 18</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="decimals"
                  value={tokenDetails.decimals}
                  onChange={handleTokenDetailChange}
                  placeholder="18"
                  className="form-input"
                  min="0"
                  max="18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Total Supply <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="totalSupply"
                  value={tokenDetails.totalSupply}
                  onChange={handleTokenDetailChange}
                  placeholder="1000000"
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              className="btn-secondary"
              onClick={handlePrevStep}
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>

            <button
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!tokenDetails.name || !tokenDetails.symbol || !tokenDetails.totalSupply}
            >
              Continue <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Step 4: Review & Deploy */}
        <div
          ref={el => stepsRef.current[3] = el}
          className="step-4"
          style={{ display: 'none' }}
        >
          {deploymentCompleted ? (
<div className="glass-card p-8 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 shadow-lg">
  {/* Header */}
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center bg-green-900/20 text-green-400 px-4 py-2 rounded-full mb-3">
      <CheckCircle2 className="mr-2" size={18} />
      <h3 className="text-xl font-semibold">Token Contract Deployed!</h3>
    </div>
    <p className="text-sm text-white/60">Your token has been successfully deployed to the blockchain</p>
  </div>

  {/* Circular Image Container */}
  <div className="flex flex-col items-center mb-8">
    {deployedToken?.metadata_uri || deployedToken?.metadataUri || tokenDetails.metadataURI ? (
      <div className="relative group">
        <div className="w-40 h-40 rounded-full border-4 border-indigo-500/30 overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shadow-lg transition-all duration-300 group-hover:border-indigo-400">
          <img
            src={getDisplayableImageUrl(deployedToken?.metadata_uri || deployedToken?.metadataUri || tokenDetails.metadataURI)}
            alt="Token logo"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full flex items-center justify-center';
              fallback.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              `;
              img.parentNode?.appendChild(fallback);
            }}
          />
        </div>
        <a
          href={deployedToken?.metadata_uri || deployedToken?.metadataUri || tokenDetails.metadataURI}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-300 hover:text-indigo-200 mt-3 text-center block transition-colors"
        >
          <span className="inline-flex items-center">
            <ExternalLink size={14} className="mr-1" />
            View Full Image
          </span>
        </a>
      </div>
    ) : (
      <div className="w-40 h-40 rounded-full border-2 border-dashed border-gray-500/50 flex items-center justify-center bg-white/5 transition-all hover:border-indigo-400/50">
        <div className="text-center">
          <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
          <span className="text-xs text-gray-400">No Image Provided</span>
        </div>
      </div>
    )}
  </div>

  {/* Token Details Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
    {[
      { label: "Name", value: deployedToken?.name || tokenDetails.name, color: "text-white" },
      { label: "Symbol", value: deployedToken?.symbol || tokenDetails.symbol, color: "text-green-300" },
      { label: "Decimals", value: deployedToken?.decimals || tokenDetails.decimals, color: "text-purple-300" },
      { 
        label: "Total Supply", 
        value: formatNumber(deployedToken?.initial_supply || deployedToken?.initialSupply || tokenDetails.totalSupply),
        color: "text-yellow-300"
      }
    ].map((item, index) => (
      <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-indigo-400/30 transition-colors">
        <p className="text-xs font-medium text-white/50 mb-1 uppercase tracking-wider">{item.label}</p>
        <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
      </div>
    ))}
  </div>

  {/* Description and Package ID */}
  <div className="space-y-6 mb-8">
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Description</p>
      <p className="text-white/90">
        {deployedToken?.description || tokenDetails.description || (
          <span className="text-white/50 italic">No description provided</span>
        )}
      </p>
    </div>

    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Package ID</p>
      <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded">
        <p className="break-all font-mono text-sm text-blue-300">
          {deployedToken?.package_id || deployedToken?.packageId || (
            <span className="text-white/50">Not available</span>
          )}
        </p>
        {deployedToken?.package_id && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(deployedToken.package_id || deployedToken.packageId || '');
              // Add toast notification here if needed
            }}
            className="text-gray-400 hover:text-white transition-colors ml-2"
            title="Copy to clipboard"
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-4">
    <a
      href={`https://suiexplorer.com/object/${deployedToken?.package_id || deployedToken?.packageId}?network=testnet`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary flex-1 text-center py-3 rounded-lg transition-all hover:bg-white/20 flex items-center justify-center gap-2"
    >
      <ExternalLink size={16} />
      View on Explorer
    </a>
    <button
      onClick={() => {
        setDeploymentCompleted(false);
        setDeployedToken(null);
        setCurrentStep(1);
      }}
      className="btn-primary flex-1 py-3 rounded-lg transition-all hover:bg-indigo-500 flex items-center justify-center gap-2"
    >
      <PlusCircle size={16} />
      Create Another Token
    </button>
  </div>
</div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Review & Deploy</h2>

              <div className="glass-card p-6 mb-8">
                <h3 className="text-lg font-medium mb-4">Token Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                  <div>
                    <h4 className="text-sm text-white/50">Token Type</h4>
                    <p className="font-medium">
                      {TOKEN_TYPES.find(t => t.id === selectedType)?.name || '-'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Network</h4>
                    <p className="font-medium">
                      {NETWORKS.find(n => n.id === selectedNetwork)?.name || '-'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Name</h4>
                    <p className="font-medium">{tokenDetails.name || '-'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Symbol</h4>
                    <p className="font-medium">{tokenDetails.symbol || '-'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Decimals</h4>
                    <p className="font-medium">{tokenDetails.decimals || '18'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Total Supply</h4>
                    <p className="font-medium">{tokenDetails.totalSupply || '-'}</p>
                  </div>

                  <div>
                    <h4 className="text-sm text-white/50">Metadata URI</h4>
                    {tokenDetails.metadataURI && (
                      ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].some(ext =>
                        tokenDetails.metadataURI.toLowerCase().includes(`.${ext}`)
                      ) ? (
                        <div className="mt-3">
                          <p className="text-xs text-white/50 mb-1">Image Preview:</p>
                          <div className="max-w-xs border border-white/10 rounded-lg overflow-hidden">
                            <img
                              src={tokenDetails.metadataURI}
                              alt="Token metadata preview"
                              className="w-full h-auto object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                // Show fallback text if image fails to load
                                const fallback = document.createElement('p');
                                fallback.className = 'text-xs text-red-400 p-2';
                                fallback.textContent = 'Image could not be loaded (hotlinking may be blocked)';
                                target.parentNode?.appendChild(fallback);
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-white/50 mt-2">
                          (URL doesn't point to a direct image file)
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm text-white/50">Description</h4>
                    <p className="font-medium">{tokenDetails.description || '-'}</p>
                  </div>
                </div>

                <div className="mb-6 border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium mb-4">Deployment Cost</h3>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Gas Fee (estimated)</span>
                    <span className="font-medium">≈ 0.015 SUI</span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Platform Fee</span>
                    <span className="font-medium">0.01 SUI</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">≈ 0.025 SUI</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
                  <div className="mt-0.5 flex-shrink-0">
                    <Shield size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">
                      Your token will be deployed using audited, secure smart contracts. After deployment, you'll be able to view and manage your token from the dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 mb-10">
                <div className="flex items-center mb-4">
                  <CreditCard size={20} className="text-indigo-400 mr-2" />
                  <h3 className="text-lg font-medium">Payment Method</h3>
                </div>

                <p className="text-white/70 mb-6">
                  You'll need to pay the gas fee and platform fee to deploy your token. {!walletConnected && "Connect your wallet to continue."}
                </p>

                {!walletConnected ? (
                  <button className="btn-primary w-full">
                    Connect Wallet to Deploy
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-400">
                      Wallet connected: {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                    </div>
                    <div className="text-sm">
                      Balance: {/* Add wallet balance display if available */}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  className="btn-secondary"
                  onClick={handlePrevStep}
                  disabled={deploying}
                >
                  <ArrowLeft size={18} className="mr-2" /> Back
                </button>

                <button
                  className="btn-primary flex items-center justify-center min-w-32"
                  onClick={handleDeployToken}
                // disabled={!walletConnected || deploying}
                >
                  {deploying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deploying...
                    </>
                  ) : (
                    <>
                      Deploy Token
                      <ArrowRight size={18} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateToken;