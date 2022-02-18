import { useState } from 'react';
import { ethers } from 'ethers';
import  Token  from './artifacts/contracts/ERC20.sol/ParthToken.json'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css';

const tokenAddress="0x20Cb33BA53e813a5aD1a67a48a7964695C988Ea3";

function App() {
  let provider;
  let signer;
  let current_address;

  async function connect_to_metamask() 
  {
     if (typeof window.ethereum !== 'undefined') 
   {
    var current_address_span = document.getElementById("currentaddress")
     provider = new ethers.providers.Web3Provider(window.ethereum)           
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    current_address=account;
    signer = provider.getSigner();
    current_address_span.innerHTML = `METAMASK ACCOUNT:- : ${account}`
    console.log(account);      
    return true;
    }
    else
    {
    alert("Please Install Metamask !");
      return false;
   }
  }
  document.addEventListener('DOMContentLoaded', async () => {
   var connected = await connect_to_metamask();
   });  

   window.ethereum.on('accountsChanged', async function (accounts) {
    var connected = await connect_to_metamask();
  })


async function check_a_balance() {
  if (connect_to_metamask()) {
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
    const balance = await contract.balanceOf(current_address);
    document.getElementById('a_balance').innerHTML="You have "+balance+" Tokens";
  }
}


async function send_token() {
  if (connect_to_metamask()) {
    signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const recipient_address = document.getElementById("recaddress").value;
    const amount = document.getElementById("amount").value;
    const transaction = await contract.transfer(recipient_address,amount);
    await transaction.wait(document.getElementById("txnstatus").innerHTML="your txn is under process wait....");
    document.getElementById("txnstatus").innerHTML="Transcation Hash:-"+transaction['hash'];
  }
}


async function approve_spender() {
  if (connect_to_metamask()) {
    signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const spender_address = document.getElementById("speaddress").value;
    const limit_amount = document.getElementById("samount").value;
    try{
      const transaction = await contract.approve(spender_address,limit_amount);
      await transaction.wait(document.getElementById("approvestatus").innerHTML="your approve request is under process wait....");
      document.getElementById("approvestatus").innerHTML="Token Approved <br> your Transcation Hash:-"+transaction['hash'];
      console.log(transaction);
    }
    catch(error)
    {
      document.getElementById("approvestatus").innerHTML=error["message"];

    }
    
  }
}



async function transfer_from() {
  if (connect_to_metamask()) {
    signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const owner_address = document.getElementById("oaddress").value;
    const reciver_address = document.getElementById("reciaddress").value;
    const amount = document.getElementById("tfamount").value;

    try{
      const transaction = await contract.transferFrom(owner_address,reciver_address,amount);
      await transaction.wait(document.getElementById("tfstatus").innerHTML="your Transcation request is under process wait....");
      document.getElementById("tfstatus").innerHTML="You successfully transfer token from owner account. <br> Your Transcation Hash:-"+transaction['hash'];
      console.log(transaction);
    }
    catch(error)
    {
      document.getElementById("tfstatus").innerHTML=error["message"];

    }
    
  }
}


async function findDetails() {
  if (connect_to_metamask()) {
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
    const name = await contract.name();
    const standard = await contract.standard();
    const symbol = await contract.symbol();
    const totalSupply = await contract.totalSupply();
    let token_details= document.createElement('table');
    token_details.innerHTML=`
          <table className="table1">
    <tr>
      <td>Token name</td>
      <td>${name}</td>
    </tr>
    <tr>
      <td>Token standard</td>
      <td>${standard}</td>
    </tr>
    <tr>
      <td>Token symbol</td>
      <td>${symbol}</td>
    </tr>
    <tr>
      <td>Total Supply</td>
      <td>${totalSupply}</td>
    </tr>
  </table>
    `;
    document.getElementById('tokendetails').appendChild(token_details);

  }
}


  return (
    <body>
<div className="container">
        <h3 className="text-muted">ERC20 Functions</h3>
        <div className="breadcrumb">        
        <p ><a className="btn btn-lg btn-success" href="#"  id="currentaddress" role="button">Metamask Is Not Connected</a></p>
      </div>


<fieldset className="form-horizontal">
<legend>Function for Token Details()</legend>

<div className="form-group">
  <div className="col-md-4">
    <button id="subscribe" name="subscribe" onClick={findDetails}  className="btn btn-primary">See Token Details</button>
  </div>
</div>

<div className="form-group" >
  <br></br>
<div className='table' id="tokendetails"> </div>
</div>
</fieldset>
<hr className='mt-3'></hr>

<fieldset className="form-horizontal">
<legend>Function balanceOf()</legend>
<div className="form-group">
  <label className="col-md-4 control-label" ></label>
  <div className="col-md-4">
    <button id="" name="" className="btn btn-primary" onClick={check_a_balance} >check your account balance</button>
    <br></br><label ><p id="a_balance">0</p></label>
  </div>
</div>
</fieldset>
<hr className='mt-3'></hr>


<fieldset className="form-horizontal">
<legend>Function transfer()</legend>
<div className="form-group">
  <label className="col-md-4 control-label" >recipient address</label>  
  <div className="col-md-4">
  <input id="recaddress" name="recaddress" type="text" placeholder="enter recipient address" className="form-control input-md" />
  </div>
</div>

<div className="form-group">
    <label className="col-md-4 control-label" >Amount</label>  
    <div className="col-md-4">
    <input id="amount" name="amount" type="text" placeholder="enter token amount" className="form-control input-md" />
      
    </div>
  </div>

  <div className="form-group">
  <label className="col-md-4 control-label" ></label>
  <div className="col-md-4">
    <button id="subscribe" name="subscribe" onClick={send_token}  className="btn btn-primary">Send Tokens</button>
  </div>
  <span id="txnstatus"></span>
</div>
</fieldset>
<hr className='mt-3'></hr>

<fieldset className="form-horizontal">
<legend>Function Approve()</legend>
<div className="form-group">
  <label className="col-md-4 control-label" >Spender address</label>  
  <div className="col-md-4">
  <input id="speaddress" name="speaddress" type="text" placeholder="enter spender address" className="form-control input-md" />
  </div>
</div>

<div className="form-group">
    <label className="col-md-4 control-label" >amount limit</label>  
    <div className="col-md-4">
    <input id="samount" name="samount" type="text" placeholder="enter maximum amount which spender can transfer" className="form-control input-md" />
      
    </div>
  </div>

  <div className="form-group">
  <label className="col-md-4 control-label" ></label>
  <div className="col-md-4">
    <button id="approve" name="approve" onClick={approve_spender}  className="btn btn-primary">Approve</button>
  </div>
  <span id="approvestatus"></span>
</div>
</fieldset>
<hr className='mt-3'></hr>


<fieldset className="form-horizontal">
<legend>Function TransferFrom()</legend>
<div className="form-group">
  <label className="col-md-4 control-label" >Owner address</label>  
  <div className="col-md-4">
  <input id="oaddress" name="oaddress" type="text" placeholder="enter tokens owner address" className="form-control input-md" />
  </div>
</div>

<div className="form-group">
  <label className="col-md-4 control-label" >recipient address</label>  
  <div className="col-md-4">
  <input id="reciaddress" name="reciaddress" type="text" placeholder="enter recipient address" className="form-control input-md" />
  </div>
</div>

<div className="form-group">
    <label className="col-md-4 control-label">amount</label>  
    <div className="col-md-4">
    <input id="tfamount" name="tfamount" type="text" placeholder="enter amount which you want transfer from owner account" className="form-control input-md" />
      
    </div>
  </div>

  <div className="form-group">
  <label className="col-md-4 control-label" ></label>
  <div className="col-md-4">
    <button id="transferf" name="transferf" onClick={transfer_from}  className="btn btn-primary">Transfer From</button>
  </div>
  <span id="tfstatus"></span>
</div>
</fieldset>
<hr className='mt-3'></hr>


</div>
</body>
  );
}

export default App;
