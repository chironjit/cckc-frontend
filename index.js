import React, { useState } from "react";
import CtaButton from '../CtaButton';
import { ethers } from "ethers";
import Artifact from '../../../assets/artifacts/CoolKidsClub.json'




function Mint() {

  const networkSwitch   = 'homestead'
  const contractAddress = networkSwitch === 'homestead' ? '' : '' 
  const contractChainId = networkSwitch === 'homestead' ? '0x1' : '0x4' // '0x4' for rinkeby, '0x1' for mainnet
  const contractNetwork = networkSwitch === 'homestead' ? 'homestead' : 'rinkeby' 
  const providerAccess  = networkSwitch === 'homestead' ? '' : '' 

  const metamaskInstalled = (typeof window.ethereum !== 'undefined')
  const price = 0.079;
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [totalSelected, setTotalSelected] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [saleStatus, setSaleStatus] = useState('Closed')
  const [submittingMintTx, setSubmittingMintTx] = useState(false)

  const provider = new ethers.providers.AlchemyProvider(contractNetwork, providerAccess)
  const abi = Artifact.abi

  const contract = new ethers.Contract(contractAddress, abi, provider)

  const connectToMetaMask = async () => {

    const userAddress = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setSelectedAddress(window.ethereum.selectedAddress)
  }

  const updateTotalSelected = async (amount) => {
    await setTotalSelected (totalSelected => amount )
    await setTotalPrice (totalPrice => price * amount)
  }

  const nftMint = async () => {

    await window.ethereum.request({ method: 'eth_requestAccounts' })
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: contractChainId }]
    })
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    if(submittingMintTx === true) {
      alert ('Another pending transaction already submitted. Please wait for transaction to complete or reload page to try again')
    }

    setSubmittingMintTx(true)
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const signer = provider.getSigner()
        const contractMint = new ethers.Contract(contractAddress, abi, signer)


        const tx = await contractMint.saleMint(
          totalSelected,
          { value: ethers.utils.parseUnits((totalPrice * 1000000000).toString(), 'gwei') }
      )

        alert(`Transaction submitted, please check your metamask wallet for status progress`)

        tx.wait().then(receipt => {
            // console.log(receipt)
            alert(`Transaction hash ${receipt.transactionHash} has been verified`)
        })
    } catch (err) {
        alert(err.message)
    } finally {
        setSubmittingMintTx(false)
    }

  }

  const buttonAction = () => {
    if (!selectedAddress) {
      connectToMetaMask()

    } else if (selectedAddress && totalSelected !==0) {
      nftMint()
    }
    else {
      alert('You havent selected an amount to mint or your wallet was not detected')
    }
  }

  
  



  return (
    <section id="Mint">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pb-12 md:pb-20">

          {/* CTA box */}
          <div className="bg-cckc-text rounded py-10 px-8 md:py-16 md:px-12 shadow-2xl shadow-indigo-500/50" data-aos="zoom-y-out">

            <div className="flex flex-col lg:flex-row justify-between items-center">

              {/* CTA content */}
              <div className="mb-6 lg:mr-16 lg:mb-0 text-center lg:text-left">
                <h3 className="h2 text-4xl text-cckc-bg mb-2">Mint a Cool Kid</h3>
                
                <div>
                  {!metamaskInstalled && `MetaMask Not Found`}
                  {metamaskInstalled && !selectedAddress && 
                  <p className="text-3xl text-cckc-bg text-lg">
                    You will need to connect your Metamask wallet to mint. 
                  </p>}
                  {metamaskInstalled && selectedAddress &&
                  <div>
                    <p className="text-2xl text-cckc-bg text-lg">
                        Connected address: {selectedAddress}
                    </p>
                    
                <label htmlFor="mintNumber" className="text-3xl">Select amount to mint: </label>
                <select
                                    id="mintNumber"
                                    name="Number to mint"
                                    size="1"
                                    className="text-center rounded text-gray-900"
                                    value={totalSelected}
                                    onChange={e => updateTotalSelected(e.target.value)}
                                >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                <br />
                <p className="text-xl">
                  Total price: {totalPrice}
                </p>
                <p className="py-6">
                  Note: The first 690 mints are free - any amounts paid for the first 690 NFTs will be refunded in the same transaction
                </p>
                
                    
                    
                  </div>
                  }
                </div>
              </div>

              {/* CTA button */}
              <div>
                {/*<a className="btn text-blue-600 bg-gradient-to-r from-blue-100 to-white shadow-2xl" href="#0">Mint</a>*/}
                <img style={{width: '25%', maxWidth: '240px', marginLeft:'37.5%', marginBottom:"-25%"}} src={require('../../../assets/svgs/brainJar.svg').default} alt="Brain in jar"/>

                

                <button className="bubbly-button text-cckc-bg" onClick={buttonAction}>
                  {!metamaskInstalled && `MetaMask Not Found`}
                  {metamaskInstalled && !selectedAddress && 
                  <p className="">
                    CONNECT
                  </p>}
                  {metamaskInstalled && selectedAddress &&
                  <p className="">
                    MINT
                  </p>
                  }
                </button>

              </div>

              

              

              


              
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Mint;
