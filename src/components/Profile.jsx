import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import './Items.css';
import './Profile.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import { ethers } from "ethers";
import DigitalAssetsMarketABI from '../abi/DigitalAssetsMarketABI.json';
import { contractAddress } from "./contract";
import axios from 'axios';
import { useContractFunction, useCall, useEthers } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";

const Profile = () => {

  const contractInterface = new ethers.utils.Interface(DigitalAssetsMarketABI);


  const provider = new ethers.providers.JsonRpcProvider("http://161.81.156.141:7545/");

  const contract = new ethers.Contract(contractAddress, DigitalAssetsMarketABI, provider);

  const { activateBrowserWallet, account } = useEthers()

  const Nfts = useFetchMyNFTs();

  function useContractMethod(methodName, transactionName) {
    const { state, send, resetState } = useContractFunction(contract, methodName, { transactionName: { transactionName } });
    return { state, send, resetState };
  }

  const { state, send, resetState } = useContractMethod("sellToken", "sellToken");

  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [NftPrice, setNftPrice] = useState();


  function useFetchMyNFTs() {
    const { value, error } = useCall(contractAddress && {
      contract: new Contract(contractAddress, contractInterface),
      method: 'fetchMyNFTs',
      args: [account]
    }) ?? {}
    if (error) {
      return undefined
    }
    return value?.[0];
  }

  async function loadNfts() {
    if (Nfts !== undefined) {
      const items = await Promise.all(Nfts.map(async i => {
        let tokenURI = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        // console.log(meta);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image
        }
        return item
      }))
      console.log(items);
      setNfts(items);
      setLoadingState('loaded')
      // console.log(items);
      // console.log(nfts);
    }
  }

  async function sellNft(nft) {
    const price = ethers.utils.parseUnits(NftPrice.toString(), 'ether')
    send(nft.tokenId, price);
    loadNfts();
  }

  useEffect(() => {
    console.log(account);
    activateBrowserWallet();
    loadNfts();
    // console.log(nfts);
  }, []);

  if (loadingState === 'loaded' && !nfts.length) return (
    <main>
      <div className='profileTop'>
        <div className='profileCover'>
          <img alt="coverimg" className='profileCoverImg' src="https://img.youtube.com/vi/5tOfEcs1Xjc/maxresdefault.jpg" />
          <img alt="userimg" className='profileUserImg' src="https://images-ext-2.discordapp.net/external/F9UeV9ecaT23O2yXD8ylxWOIoqpY6tv9lrzDAvnaK-4/%3Fpid%3DImgDet%26rs%3D1/https/th.bing.com/th/id/OIP.UvwuaGut_R9E6Y5P1vTr2wHaE7" />
        </div>
        <div className='profileInfo'>
          <h4 className='profileInfoName'>{account}</h4>
          <br />
          <h5 className='profileInfoSName'>What you had created</h5>
          <br />
          <br />
          <h1>No NFTs owned</h1>
        </div>
      </div>
    </main>
  )
  return (
    <main>
      <div className='profileTop'>
        <div className='profileCover'>
          <img alt="coverimg" className='profileCoverImg' src="https://img.youtube.com/vi/5tOfEcs1Xjc/maxresdefault.jpg" />
          <img alt="userimg" className='profileUserImg' src="https://images-ext-2.discordapp.net/external/F9UeV9ecaT23O2yXD8ylxWOIoqpY6tv9lrzDAvnaK-4/%3Fpid%3DImgDet%26rs%3D1/https/th.bing.com/th/id/OIP.UvwuaGut_R9E6Y5P1vTr2wHaE7" />
        </div>
        <div className='profileInfo'>
          <h4 className='profileInfoName'>{account}</h4>
          <br />
          <h5 className='profileInfoSName'>What you had created</h5>
        </div>
      </div>

      <Grid container justify="center" sapcing={4}>
        {
          nfts.map((item, index) => {
            return (
              <Grid item key={item.id} xs={12} sm={6} md={4} lg={3} className="GridPadd">
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      image={item.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.tokenId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="body3" color="text.secondary">
                        Bought Price - {item.price} Eth
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <input placeholder='Asset Price in Eth' onChange={e => setNftPrice(e.target.value)} pattern="[0-9]" />
                  </CardActions>
                  <br />
                  <button className='butBtutton' onClick={() => sellNft(item)}>Sell</button>
                </Card>
              </Grid>
            )
          })
        }
      </Grid>
    </main>
  )
}

export default Profile
