const { expect, use } = require("chai");
const { exec } = require("child_process");

describe("PARTH ERC20 Token",function(){

  let token,tokenInstance,owner,user1,user2,user3,users;
  
  beforeEach(async function(){
    token=await ethers.getContractFactory("ParthToken");
    [owner,user1,user2,user3, ...users] =await ethers.getSigners();
    tokenInstance=await token.deploy(1000);
  });

  describe("Deployment",()=>{
    it("Should supply tokens to owner",async ()=>{
    expect(await tokenInstance.balanceOf(owner.address)).to.eq(1000);
    });
  });

  describe("Transactions",()=>{

   it("Should transfer tokens between accounts",async ()=>{
     //owner =100=> user1
      await tokenInstance.transfer(user1.address,100);
      const user1Balance = await tokenInstance.balanceOf(user1.address);
      expect(user1Balance).to.equal(100);

    //user1 =50=>user2
      await tokenInstance.connect(user1).transfer(user2.address,50);
      const user2balance = await tokenInstance.balanceOf(user2.address);
      expect(user2balance).to.equal(50);

   }); 

   it("Should fail if sender doesn’t have enough tokens",async ()=>{
    const user1balance = await tokenInstance.balanceOf(user1.address);
    const user3balance = await tokenInstance.balanceOf(user3.address);
    console.log("User1 balance:-"+user1balance.toNumber());
    console.log("User3 balance:-"+user3balance.toNumber());
     
      await expect(
        tokenInstance.connect(user1).transfer(user3.address,100)
      ).to.be.revertedWith("insufficient tokens in this account");

      expect(await tokenInstance.balanceOf(user3.address)).to.equal(user3balance);

  }); 

  it("Should update tokens after transfer",async ()=>{

    //owner have  1000 ERC20
    //user1 have 0 ERC20

    await tokenInstance.connect(owner).transfer(user1.address,100);
    expect(await tokenInstance.balanceOf(user1.address)).to.eq(100);

    await tokenInstance.connect(user1).transfer(user2.address,50);
    expect(await tokenInstance.balanceOf(user2.address)).to.eq(50);

    //owner must have 900
    expect(await tokenInstance.balanceOf(owner.address)).to.eq(900);
  }); 

  });

  describe("Approv and allowance",()=>{

    it("Should approve amount between accounts",async ()=>{
      //owner approve 500 to user
      await tokenInstance.connect(owner).approve(user1.address,500);
      const amount= await tokenInstance.allowance(owner.address,user1.address);
      expect(await tokenInstance.allowance(owner.address,user1.address)).to.eq(500);
    });

    it("Should fail if owner doesn’t have enough tokens to approve",async ()=>{
      //owner have 1000 ERC20
      await expect(
        tokenInstance.connect(owner).approve(user1.address,1001)
      ).to.be.revertedWith("you cannot approve tokens more than your current balance");
    });

    it("Should revert if tokens are already approved",async ()=>{
      //owner approve 100 ERC20 to user1

      await tokenInstance.connect(owner).approve(user1.address,100);
      expect(await tokenInstance.allowance(owner.address,user1.address)).to.eq(100);

      //now again owner wants to approve user1 100 ERC20
      await expect(
        tokenInstance.connect(owner).approve(user1.address,100)
      ).to.be.revertedWith("tokens are already approved");
    });

  });

  describe("transferFrom",()=>{
  
    it("Should transfer tokens between accounts",async ()=>{
    //owner approve 100 ERC20 to USER1
    await tokenInstance.connect(owner).approve(user1.address,100);
    expect(await tokenInstance.allowance(owner.address,user1.address)).to.eq(100);

    //user1 tranfer 100 ERC20 to user2 from owner accounts
      await tokenInstance.connect(user1).transferFrom(owner.address,user2.address,100);
      expect(await tokenInstance.balanceOf(user2.address)).to.eq(100);  
    });

    it("Should revert if user do not have permission",async ()=>{
      //user1 wants to transfer 100 ERC20 to USER2 without owner's permission
      await expect(
        tokenInstance.connect(user1).transferFrom(owner.address,user2.address,100)
      ).to.be.revertedWith("You do not have permission to transfer tokens from owner address");
    });

    it("Should revert if user wants to transfer more than approve limit",async ()=>{ 
      //owner approve 100 ERC20 to USER1
    await tokenInstance.connect(owner).approve(user1.address,100);
    expect(await tokenInstance.allowance(owner.address,user1.address)).to.eq(100);

      //user1 wants to transfer 101 ERC20 to USER2 which is more than approve limit
        await expect(
          tokenInstance.connect(user1).transferFrom(owner.address,user2.address,101)
        ).to.be.revertedWith("you cannot transfer tokens more than your approved limit");
    });

    it("Should revert if owner of allowance has insufficient funds",async ()=>{ 
    //owner approve 500 ERC20 to USER1
    await tokenInstance.connect(owner).approve(user1.address,500);
    expect(await tokenInstance.allowance(owner.address,user1.address)).to.eq(500);
    
    //owner tranfer 600 tokens to user3
    await tokenInstance.connect(owner).transfer(user3.address,600);
    expect(await tokenInstance.balanceOf(user3.address)).to.eq(600);
    //so current balance of owner is 400

    //user1 wants to transfer 500 tokens to user2 from owner's wallet
    await expect(
      tokenInstance.connect(user1).transferFrom(owner.address,user2.address,500)
    ).to.be.revertedWith("your owner has insufficient tokens in his wallet"); 
    });
    

  });
  


});