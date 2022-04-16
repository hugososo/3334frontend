import React from 'react';
import Grid from '@mui/material/Grid';
import './item.css';
import Card from '@mui/material/Card';
import { Button, CardContent } from '@mui/material';
import { useState } from 'react'

const Items = [
  { id: 1, name: 'Name1', description: 'description1', img: 'https://cdn6.f-cdn.com/contestentries/1960262/56130916/60e8ea95cd307_thumb900.jpg', Price: '$5' },
];


const UserItemDetail = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [descr, setdescr] = useState("");
  const [status, setStatus] = useState(null);


  console.log(status);
  const handleSubmit = (e) => {

  }
  return (
    <div className="gg" style={{ width: '100%', padding: '3rem 4rem' }}>
      {Items.map((item) => (
        <Grid container justify="center" spacing={4}>
          <Grid xs={2}></Grid>
          <Grid item key={item.id} xs={4} className="GridPadd">
            <img alt="leftimg" className='leftImg' src={item.img} style={{ width: '100%' }} />
          </Grid>
          <Grid item key="2" xs={2}>
            <Card sx={{ minWidth: 400, minHeight: '100%' }}>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="formInput">
                    Status: 
                    <br/>
                    <input
                      type="radio"
                      name='status'
                      value={"onSeals"}
                      id="onSealsStatus"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label for="onSealsStatus">On Seals</label>
                    <br/>
                    <input
                      type="radio"
                      name='status'
                      value={"nonSeals"}
                      id="nonSealsStatus"
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <label for="nonSealsStatus">Non Seals</label>
                  </div>
                  <div className="formInput">
                    Item Name: 
                    <input placeholder='Name' onChange  ={(e) => setName(e.target.value)} required value={item.name} />
                  </div>
                  <div className="formInput">
                    Price: 
                    <input placeholder='Price' onChange={(e) => setPrice(e.target.value)} required value={item.Price} />
                  </div>
                  <div className="formInput">
                    Description: 
                    <input placeholder='Description' onChange={(e) => setdescr(e.target.value)} required value={item.description} />
                  </div>
                  <Button variant="contained">Modify</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={4}></Grid>
        </Grid>
      ))}
    </div>
  )
}

export default UserItemDetail