import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { activateBrowserWallet, account } = useEthers();

  const userBalance = useEtherBalance(account);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: "none", md: "flex" } }}>3335NFT</Typography>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>3335NFT</Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button component={Link} to="/" sx={{ my: 2, color: "white", display: "block" }}>Item</Button>
            <Button component={Link} to="/profile" sx={{ my: 2, color: "white", display: "block" }}>Profile</Button>
            <Button component={Link} to="/create" sx={{ my: 2, color: "white", display: "block" }}>Create</Button>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            { userBalance && <div>Your Balance: {formatEther(userBalance)}</div> }
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="My Wallet">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://images-ext-1.discordapp.net/external/nmit9B7sJwk3rcrZCXSnNAveRyzO_BTfqdvi_U78juU/%3Frik%3DOENtB8b4TDp6DA%26riu%3Dhttp%253a%252f%252fcdn.onlinewebfonts.com%252fsvg%252fimg_395631.png%26ehk%3D2TZnXCAt2s8AB0xh9sr%252ffFcDGrRyqfSyuBfwjF7ghQk%253d%26risl%3D%26pid%3DImgRaw%26r%3D0/https/th.bing.com/th/id/R.8c65e4c6a069f58203d666c5561a855d?width=575&height=575"
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <button key="Connect Wallet" onClick={() => activateBrowserWallet()}>
                <Typography textAlign="center">Connect Wallet</Typography>
              </button>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
