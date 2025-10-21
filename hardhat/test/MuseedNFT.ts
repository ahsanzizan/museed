import { expect } from "chai";
import { ethers } from "hardhat";
import { MuseedNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("MuseedNFT", function () {
  let museedNFT: MuseedNFT;
  let owner: HardhatEthersSigner;
  let artist: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let addr3: HardhatEthersSigner;

  const TRACK_PRICE = ethers.parseEther("1.0"); // 1 ETH
  const TRACK_URI = "ipfs://QmTest123";

  beforeEach(async function () {
    [owner, artist, buyer, addr3] = await ethers.getSigners();

    const MuseedNFT = await ethers.getContractFactory("MuseedNFT");
    museedNFT = await MuseedNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await museedNFT.name()).to.equal("Museed");
      expect(await museedNFT.symbol()).to.equal("MSED");
    });

    it("Should set the correct owner", async function () {
      expect(await museedNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting Tracks", function () {
    it("Should mint a track successfully", async function () {
      const tx = await museedNFT.mintTrack(
        artist.address,
        TRACK_URI,
        TRACK_PRICE
      );
      await tx.wait();

      expect(await museedNFT.ownerOf(0)).to.equal(artist.address);
      expect(await museedNFT.tokenURI(0)).to.equal(TRACK_URI);
      expect(await museedNFT.trackPrice(0)).to.equal(TRACK_PRICE);
      expect(await museedNFT.trackArtist(0)).to.equal(artist.address);
    });

    it("Should emit TrackMinted event", async function () {
      await expect(museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE))
        .to.emit(museedNFT, "TrackMinted")
        .withArgs(0, artist.address, TRACK_PRICE);
    });

    it("Should increment token IDs correctly", async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
      await museedNFT.mintTrack(
        artist.address,
        "ipfs://QmTest456",
        TRACK_PRICE
      );

      expect(await museedNFT.ownerOf(0)).to.equal(artist.address);
      expect(await museedNFT.ownerOf(1)).to.equal(artist.address);
    });

    it("Should revert if non-owner tries to mint", async function () {
      await expect(
        museedNFT
          .connect(artist)
          .mintTrack(artist.address, TRACK_URI, TRACK_PRICE)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Purchasing Tracks", function () {
    beforeEach(async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
    });

    it("Should allow purchasing a track with exact payment", async function () {
      const artistBalanceBefore = await ethers.provider.getBalance(
        artist.address
      );
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      expect(await museedNFT.ownerOf(0)).to.equal(buyer.address);

      const artistBalanceAfter = await ethers.provider.getBalance(
        artist.address
      );
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      const expectedArtistShare = (TRACK_PRICE * 90n) / 100n;
      const expectedPlatformShare = (TRACK_PRICE * 10n) / 100n;

      expect(artistBalanceAfter - artistBalanceBefore).to.equal(
        expectedArtistShare
      );
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(
        expectedPlatformShare
      );
    });

    it("Should handle overpayment and refund excess", async function () {
      const overpayment = ethers.parseEther("1.5");
      const buyerBalanceBefore = await ethers.provider.getBalance(
        buyer.address
      );

      const tx = await museedNFT
        .connect(buyer)
        .purchaseTrack(0, { value: overpayment });
      const receipt = await tx.wait();

      if (!receipt) throw new Error("Transaction receipt is null");

      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const buyerBalanceAfter = await ethers.provider.getBalance(buyer.address);

      const expectedDeduction = TRACK_PRICE + gasUsed;
      expect(buyerBalanceBefore - buyerBalanceAfter).to.equal(
        expectedDeduction
      );
    });

    it("Should emit TrackPurchased event", async function () {
      await expect(
        museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE })
      )
        .to.emit(museedNFT, "TrackPurchased")
        .withArgs(0, buyer.address, TRACK_PRICE);
    });

    it("Should update artist earnings", async function () {
      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      const expectedEarnings = (TRACK_PRICE * 90n) / 100n;
      expect(await museedNFT.artistEarnings(0)).to.equal(expectedEarnings);
    });

    it("Should revert if payment is insufficient", async function () {
      const insufficientPayment = ethers.parseEther("0.5");

      await expect(
        museedNFT
          .connect(buyer)
          .purchaseTrack(0, { value: insufficientPayment })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should revert if buyer is already the owner", async function () {
      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      await expect(
        museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE })
      ).to.be.revertedWith("Already owner");
    });

    it("Should allow resale between users", async function () {
      // First purchase
      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });
      expect(await museedNFT.ownerOf(0)).to.equal(buyer.address);

      // Second purchase from new buyer
      await museedNFT.connect(addr3).purchaseTrack(0, { value: TRACK_PRICE });
      expect(await museedNFT.ownerOf(0)).to.equal(addr3.address);
    });

    it("Should accumulate artist earnings across multiple sales", async function () {
      const expectedShare = (TRACK_PRICE * 90n) / 100n;

      // First sale
      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });
      expect(await museedNFT.artistEarnings(0)).to.equal(expectedShare);

      // Second sale
      await museedNFT.connect(addr3).purchaseTrack(0, { value: TRACK_PRICE });
      expect(await museedNFT.artistEarnings(0)).to.equal(expectedShare * 2n);
    });
  });

  describe("Track Details", function () {
    beforeEach(async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
    });

    it("Should return correct track details", async function () {
      const [trackArtist, price, currentOwner, uri] =
        await museedNFT.getTrackDetails(0);

      expect(trackArtist).to.equal(artist.address);
      expect(price).to.equal(TRACK_PRICE);
      expect(currentOwner).to.equal(artist.address);
      expect(uri).to.equal(TRACK_URI);
    });

    it("Should update owner after purchase", async function () {
      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      const [trackArtist, price, currentOwner, uri] =
        await museedNFT.getTrackDetails(0);

      expect(trackArtist).to.equal(artist.address);
      expect(currentOwner).to.equal(buyer.address);
    });
  });

  describe("Royalty Split", function () {
    beforeEach(async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
    });

    it("Should split payment 90/10 correctly", async function () {
      const artistBalanceBefore = await ethers.provider.getBalance(
        artist.address
      );
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      const artistBalanceAfter = await ethers.provider.getBalance(
        artist.address
      );
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

      const artistIncrease = artistBalanceAfter - artistBalanceBefore;
      const ownerIncrease = ownerBalanceAfter - ownerBalanceBefore;

      expect(artistIncrease).to.equal(ethers.parseEther("0.9"));
      expect(ownerIncrease).to.equal(ethers.parseEther("0.1"));
    });
  });

  describe("Multiple Tracks", function () {
    it("Should handle multiple tracks from different artists", async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
      await museedNFT.mintTrack(
        addr3.address,
        "ipfs://QmTest456",
        ethers.parseEther("2.0")
      );

      expect(await museedNFT.trackArtist(0)).to.equal(artist.address);
      expect(await museedNFT.trackArtist(1)).to.equal(addr3.address);
      expect(await museedNFT.trackPrice(1)).to.equal(ethers.parseEther("2.0"));
    });

    it("Should track earnings separately for each track", async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
      await museedNFT.mintTrack(
        artist.address,
        "ipfs://QmTest456",
        ethers.parseEther("2.0")
      );

      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });
      await museedNFT
        .connect(buyer)
        .purchaseTrack(1, { value: ethers.parseEther("2.0") });

      expect(await museedNFT.artistEarnings(0)).to.equal(
        ethers.parseEther("0.9")
      );
      expect(await museedNFT.artistEarnings(1)).to.equal(
        ethers.parseEther("1.8")
      );
    });
  });

  describe("ERC721 Standard Functions", function () {
    beforeEach(async function () {
      await museedNFT.mintTrack(artist.address, TRACK_URI, TRACK_PRICE);
    });

    it("Should support ERC721 interface", async function () {
      // ERC721 interface ID
      expect(await museedNFT.supportsInterface("0x80ac58cd")).to.be.true;
    });

    it("Should return correct balance", async function () {
      expect(await museedNFT.balanceOf(artist.address)).to.equal(1);

      await museedNFT.connect(buyer).purchaseTrack(0, { value: TRACK_PRICE });

      expect(await museedNFT.balanceOf(artist.address)).to.equal(0);
      expect(await museedNFT.balanceOf(buyer.address)).to.equal(1);
    });
  });
});
