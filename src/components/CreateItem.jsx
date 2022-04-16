import React, { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import './CreateItem.css';
import { contractAddress } from "./contract";
import DigitalAssetsMarketABI from '../abi/DigitalAssetsMarketABI.json';
import { useContractFunction} from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateItem = () => {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const contractInterface = new ethers.utils.Interface(DigitalAssetsMarketABI);
  const contract = new Contract(contractAddress, contractInterface);
  
  function useContractMethod(methodName, transactionName) {
    const { state, send, resetState } = useContractFunction(contract, methodName, {transactionName:{transactionName}});
    return { state, send, resetState };
  }

  const { state, send, resetState } = useContractMethod("createToken", "createToken");

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();

    // let xyz = new Web3.providers.HttpProvider("http://161.81.156.141:7545/");
    // const provider = new ethers.providers.Web3Provider(xyz);
    // const provider = new ethers.providers.JsonRpcProvider("http://161.81.156.141:7545/");
    // const signer = provider.getSigner();
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    // const contract = new ethers.Contract(contractAddress, DigitalAssetsMarketABI, signer);
    send(url, price);
  }

  return (
    <div>
      <div className='top'>
        Create Your Item!
      </div>
    <div className="createForm">
    {
          fileUrl && (
            <img alt="file" className="rounded mt-4" width="350" src={fileUrl} />
          )
        }

      <div className="formInput">
      <input
          type="file"
          name="Asset"
          onChange={onChange}
        />
        </div>
        <div className="formInput">
        <input 
          placeholder="Asset Name"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        </div>
        <div className="formInput">
        <input
          placeholder="Asset Price in Eth"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        </div>
        <div className="formInput">
        <textarea
          placeholder="Asset Description"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        </div>
        <button onClick={listNFTForSale}>
          Create NFT
        </button>
    </div>
    </div>
  )
}

export default CreateItem
 