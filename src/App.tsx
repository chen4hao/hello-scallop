import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import {
  ConnectButton,
  useWallet,
  useAccountBalance,
  useCoinBalance,
  useChain,
  SuiChainId,
  ErrorCode
} from "@suiet/wallet-kit";
import '@suiet/wallet-kit/style.css';

function App() {
  const wallet = useWallet();
  
  const { balance } = useAccountBalance();
  const { data: coinBalance } = useCoinBalance();
  const chain = useChain(SuiChainId.DEVNET);

  useEffect(() => {
    console.log('devnet chain config', chain)
    console.log('coin balance', coinBalance)
  }, [chain, coinBalance])

  useEffect(() => {
    if (!wallet.connected) return;
    console.log('listen to all change event')
    const off = wallet.on('change', (...args) => {
      console.log('wallet changed', ...args)
    })
    return () => {
      off()
    }
  }, [wallet.connected])

  async function handleExecuteMoveCall() {
    try {
      const data = {
        packageObjectId: '0x518f12b1b84e4351d05de4e50f7f41635473c229',
        module: 'mint_nft',
        function: 'mint',
        typeArguments: [],
        arguments: [
          'scallop',
          'Scallop swim under the Sui.',
          'https://www.scallop.io/images/logo192.png',
        ],
        gasBudget: 10000,
      };
      const resData = await wallet.signAndExecuteTransaction({
        transaction: {
          kind: 'moveCall',
          data
        }
      });
      
      console.log('Mint scallop NFT success', resData);
      alert('Mint scallop NFT succeeded (See it in your wallet)');
    } catch (e) {
      console.error('executeMoveCall failed', e);
      alert('executeMoveCall failed (see response in the console)');
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://scallop.io/" target="_blank">
          <img src="https://www.scallop.io/images/logo192.png" className="logo" alt="Scallop logo" />
        </a>

        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Hello Scallop</h1>
      <h2>Simple Sui dApp to Mint NFT</h2>
      <div className="wallet-btn">
        <ConnectButton 
          onConnectError={(error) => {
            if (error.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED) {
              console.warn('user rejected the connection to ' + error.details?.wallet)
            } else {
              console.warn('unknown connect error: ', error)
            }
          }}
        >Connect Wallet</ConnectButton>
      </div>
            

      <div className="card">

        {!wallet.connected ? (
          <p>Connect your wallet to mint NFT!</p>
        ) : (
          <div>
            <div>
              <button onClick={handleExecuteMoveCall}>Mint Scallop NFT</button>
            </div>

            <div>
              <p>Current Wallet: <b>{wallet.adapter?.name}</b></p>
              <p>
                Wallet Status:{' '}
                <b>{wallet.connecting
                  ? 'Connecting'
                  : wallet.connected
                    ? 'Connected'
                    : 'Disconnected'}</b>
              </p>
              <p>Wallet Address:  <b>{wallet.account?.address}</b></p>
              <p>Current Network: <b>{wallet.chain?.name}</b></p>
              <p>Wallet Balance:  <b>{String(balance)}</b> SUI</p>
            </div>
          </div>
        )}  
        
        <p>
          
        </p>
      </div>
      <p className="read-the-docs">
        
      </p>
    </div>
  )
}

export default App
