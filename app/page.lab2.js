"use client";

import { useState, useEffect } from 'react';
import Web3 from 'web3';
import styles from './styles.module.css';

const tokenAddress = "0x1659279CB36ca962799e799d6ad5E9BC0e9190DB"; // Укажите ваш адрес контракта

export default function Home() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [decimals, setDecimals] = useState(0);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      await window.ethereum.enable();
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const abi = [ { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" }, { "name": "Approval", "type": "event", "inputs": [ { "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "spender", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" } ], "anonymous": false }, { "name": "OwnershipTransferred", "type": "event", "inputs": [ { "name": "previousOwner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "newOwner", "type": "address", "indexed": true, "internalType": "address" } ], "anonymous": false }, { "name": "Transfer", "type": "event", "inputs": [ { "name": "from", "type": "address", "indexed": true, "internalType": "address" }, { "name": "to", "type": "address", "indexed": true, "internalType": "address" }, { "name": "value", "type": "uint256", "indexed": false, "internalType": "uint256" } ], "anonymous": false }, { "name": "allowance", "type": "function", "inputs": [ { "name": "_owner", "type": "address", "internalType": "address" }, { "name": "_spender", "type": "address", "internalType": "address" } ], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" }, { "name": "approve", "type": "function", "inputs": [ { "name": "spender", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [ { "name": "", "type": "bool", "internalType": "bool" } ], "stateMutability": "nonpayable" }, { "name": "balanceOf", "type": "function", "inputs": [ { "name": "account", "type": "address", "internalType": "address" } ], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" }, { "name": "decimals", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "uint8", "internalType": "uint8" } ], "stateMutability": "view" }, { "name": "mint", "type": "function", "inputs": [ { "name": "_account", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [], "stateMutability": "nonpayable" }, { "name": "name", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "string", "internalType": "string" } ], "stateMutability": "view" }, { "name": "owner", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "address", "internalType": "address" } ], "stateMutability": "view" }, { "name": "symbol", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "string", "internalType": "string" } ], "stateMutability": "view" }, { "name": "totalSupply", "type": "function", "inputs": [], "outputs": [ { "name": "", "type": "uint256", "internalType": "uint256" } ], "stateMutability": "view" }, { "name": "transfer", "type": "function", "inputs": [ { "name": "to", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [ { "name": "", "type": "bool", "internalType": "bool" } ], "stateMutability": "nonpayable" }, { "name": "transferFrom", "type": "function", "inputs": [ { "name": "from", "type": "address", "internalType": "address" }, { "name": "to", "type": "address", "internalType": "address" }, { "name": "amount", "type": "uint256", "internalType": "uint256" } ], "outputs": [ { "name": "", "type": "bool", "internalType": "bool" } ], "stateMutability": "nonpayable" }, { "name": "transferOwnership", "type": "function", "inputs": [ { "name": "_newOwner", "type": "address", "internalType": "address" } ], "outputs": [], "stateMutability": "nonpayable" } ];
      const tokenContract = new web3Instance.eth.Contract(abi, tokenAddress);
      setContract(tokenContract);

      const fetchedBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
      setBalance(web3Instance.utils.fromWei(fetchedBalance, 'ether'));

      const contractOwner = await tokenContract.methods.owner().call();
      setIsOwner(contractOwner.toLowerCase() === accounts[0].toLowerCase());

      const decimalsValue = await tokenContract.methods.decimals().call();
      setDecimals(decimalsValue);
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleTransfer = async () => {
    if (contract && transferAmount && recipientAddress) {
      const amountInWei = web3.utils.toWei(transferAmount, 'ether');
      await contract.methods.transfer(recipientAddress, amountInWei).send({ from: account });
      setTransferAmount('');
      loadBlockchainData(); // Обновляем баланс после перевода
    }
  };

  const handleMint = async () => {
    if (contract && mintAmount && account) {
      const amountInWei = web3.utils.toWei(mintAmount, 'ether');
      await contract.methods.mint(account, amountInWei).send({ from: account });
      setMintAmount('');
      loadBlockchainData(); // Обновляем баланс после чеканки
    }
  };

  const addTokenToWallet = async () => {
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (accounts.length > 0) {
                // Кошелёк поддерживает аккаунты, теперь проверяем поддержку EIP-747
                const tokenData = {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress, // Замените на адрес вашего токена
                        symbol: 'LOL', // Замените на символ вашего токена
                        decimals: 18, // Замените на количество десятичных знаков вашего токена
                    },
                };

                // Пытаемся вызвать wallet_watchAsset
                const wasSupported = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: tokenData,
                });

                // Если не было ошибок, то EIP-747 поддерживается
                if (wasSupported) {
                    console.log('Кошелёк поддерживает EIP-747!');
                    return true;
                } else {
                    console.log('Кошелёк не поддерживает EIP-747.');
                    return false;
                }
            }
  };


  return (
    <div className={styles.container}>
        <h1 className={styles.title}>Token Management dApp</h1>
        <p className={styles.account}>Account: {account}</p>
        <p style={{ color: 'black', fontSize: '18px', margin: '10px 0' }}>
            Balance: {balance} LOL
        </p>

        <div className={styles.transferContainer}>
            <h2 style={{ color: 'black', fontSize: '18px', margin: '10px 0' }}>Transfer Tokens</h2>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className={styles.input}
            />
            <input
                type="number"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className={styles.input}
            />
            <button onClick={handleTransfer} className={styles.button}>Transfer</button>
        </div>

        {isOwner && (
            <div className={styles.mintContainer}>
                <h2 style={{ color: 'black', fontSize: '18px', margin: '10px 0' }}>Mint Tokens</h2>
                <input
                    type="number"
                    placeholder="Mint Amount"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleMint} className={styles.button}>Mint</button>
            </div>
        )}

        <button onClick={addTokenToWallet} className={styles.button}>Add Token to Wallet</button>
    </div>
);

}
