import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import './Items.css';
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

const Items = () => {
    const contractInterface = new ethers.utils.Interface(DigitalAssetsMarketABI);
    // const contract = new Contract(contractAddress, contractInterface);

    const Nfts = useFetchMarketItems();

    const provider = new ethers.providers.JsonRpcProvider("https://kayan9896.com");

    const contract = new ethers.Contract(contractAddress, DigitalAssetsMarketABI, provider);

    const { activateBrowserWallet, account } = useEthers();

    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');

    function useContractMethod(methodName, transactionName) {
        const { state, send, resetState } = useContractFunction(contract, methodName, {transactionName:{transactionName}});
        return { state, send, resetState };
      }
    
      const { state, send, resetState } = useContractMethod("buyToken", "buyToken");

    function useFetchMarketItems() {
        const { value, error } = useCall(contractAddress && {
            contract: new Contract(contractAddress, contractInterface),
            method: 'fetchMarketItems',
            args: []
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
                console.log(meta);
                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description
                }
                return item
            }))
            setNfts(items);
            setLoadingState('loaded')
            // console.log(items);
            // console.log(nfts);
        }
    }

    async function buyNft(nft) {
        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        send(nft.tokenId, { value: price });
        // const transaction = await contract.createMarketSale(nft.tokenId, {
        //     value: price
        // })
        // console.log(transaction);
        // await transaction.wait();
        loadNfts();
    }

    useEffect(() => {
        activateBrowserWallet();
        loadNfts();
        console.log(nfts);
    }, []);

    return (
        <main>
            <div className='top'>
                Item List
            </div>
            <Grid container justifyContent="center" sapcing={4}>
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
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.description}
                                            </Typography>
                                            <Typography variant="body3" color="text.secondary">
                                                Price - {item.price} Eth
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <button className='butBtutton' onClick={() => buyNft(item)}>Buy</button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </main>
    )
}

export default Items;