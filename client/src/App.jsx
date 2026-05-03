import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import HarambeeCoinABI from './HarambeeCoin.json'

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [totalSupply, setTotalSupply] = useState(null)
  const [contract, setContract] = useState(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(false)

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it to use this dApp.')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, HarambeeCoinABI.abi, signer)
      setAccount(accounts[0])
      setContract(contractInstance)
      await loadBalance(contractInstance, accounts[0])
      await loadTotalSupply(contractInstance)
      await loadTransactions(contractInstance, accounts[0], provider)
    } catch (err) {
      setError('Failed to connect wallet. Please try again.')
    }
  }

  const loadBalance = async (contractInstance, address) => {
    try {
      const bal = await contractInstance.balanceOf(address)
      setBalance(ethers.formatUnits(bal, 18))
    } catch (err) {
      console.error('Balance error:', err)
    }
  }

  const loadTotalSupply = async (contractInstance) => {
    try {
      const supply = await contractInstance.totalSupply()
      setTotalSupply(ethers.formatUnits(supply, 18))
    } catch (err) {
      console.error('Supply error:', err)
    }
  }

  const loadTransactions = async (contractInstance, address, provider) => {
    setLoadingTx(true)
    try {
      const sentFilter = contractInstance.filters.Transfer(address, null)
      const receivedFilter = contractInstance.filters.Transfer(null, address)

      const sentEvents = await contractInstance.queryFilter(sentFilter, 0, 'latest')
      const receivedEvents = await contractInstance.queryFilter(receivedFilter, 0, 'latest')

      const allEvents = [...sentEvents, ...receivedEvents]

      const txList = await Promise.all(allEvents.map(async (event) => {
        const block = await provider.getBlock(event.blockNumber)
        return {
          hash: event.transactionHash,
          from: event.args[0],
          to: event.args[1],
          amount: ethers.formatUnits(event.args[2], 18),
          type: event.args[0].toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
          timestamp: block ? new Date(block.timestamp * 1000).toLocaleString() : 'Unknown',
          blockNumber: event.blockNumber,
        }
      }))

      txList.sort((a, b) => b.blockNumber - a.blockNumber)
      setTransactions(txList)
    } catch (err) {
      console.error('Transaction history error:', err)
    } finally {
      setLoadingTx(false)
    }
  }

  const sendTokens = async (e) => {
    e.preventDefault()
    setError(null)
    setTxHash(null)
    if (!recipient || !amount) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18))
      await tx.wait()
      setTxHash(tx.hash)
      await loadBalance(contract, account)
      await loadTransactions(contract, account, provider)
      setRecipient('')
      setAmount('')
    } catch (err) {
      setError(err.message || 'Transaction failed.')
    } finally {
      setLoading(false)
    }
  }

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const formatBalance = (bal) => parseFloat(bal).toLocaleString()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
            <span className="font-bold text-gray-900 text-lg">HarambeeCoin</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">HBC</span>
          </div>
          {account ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700 font-medium">{formatAddress(account)}</span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-5 py-2 rounded-xl transition-all text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!account ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-6">H</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to HarambeeCoin</h1>
            <p className="text-gray-500 mb-8 max-w-md">Connect your MetaMask wallet to check your HBC balance and send tokens to anyone.</p>
            <button
              onClick={connectWallet}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-xl transition-all"
            >
              Connect MetaMask
            </button>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Your HBC Balance</p>
                <p className="text-4xl font-bold text-gray-900">{balance ? formatBalance(balance) : '...'}</p>
                <p className="text-sm text-gray-400 mt-1">HarambeeCoin</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-sm text-gray-500 mb-1">Total Supply</p>
                <p className="text-2xl font-bold text-gray-900">{totalSupply ? formatBalance(totalSupply) : '...'}</p>
                <p className="text-sm text-gray-400 mt-1">HBC</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Send HBC Tokens</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              {txHash && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                  Transaction sent! Hash: {formatAddress(txHash)}
                </div>
              )}

              <form onSubmit={sendTokens} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (HBC)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-200 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send HBC'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                <button
                  onClick={async () => {
                    const provider = new ethers.BrowserProvider(window.ethereum)
                    await loadTransactions(contract, account, provider)
                  }}
                  className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                >
                  Refresh
                </button>
              </div>

              {loadingTx ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${tx.type === 'sent' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                          {tx.type === 'sent' ? '-' : '+'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{tx.type}</p>
                          <p className="text-xs text-gray-400 font-mono">
                            {tx.type === 'sent' ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${tx.type === 'sent' ? 'text-red-500' : 'text-green-500'}`}>
                          {tx.type === 'sent' ? '-' : '+'}{parseFloat(tx.amount).toLocaleString()} HBC
                        </p>
                        <p className="text-xs text-gray-400">{tx.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Token Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Contract</span>
                  <span className="font-mono text-gray-700">{formatAddress(CONTRACT_ADDRESS)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Symbol</span>
                  <span className="font-medium text-gray-700">HBC</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Decimals</span>
                  <span className="font-medium text-gray-700">18</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium text-gray-700">Local Hardhat</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
