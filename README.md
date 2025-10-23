# Museed

**A decentralized music platform built on the blockchain, empowering artists and fans.**

This project is the Minimum Viable Product (MVP) for Museed, a platform that redefines music ownership. It enables artists to directly upload and tokenize their music as NFTs, and allows fans to verifiably purchase and own those tracks.

The core focus of this MVP is to build a working proof of concept demonstrating real blockchain integration, decentralized file storage, and transparent, automated royalty distribution using smart contracts.

---

## Core Features

- **Artist Tokenization:** Artists can connect a wallet (e.g., MetaMask), upload their audio file and cover art, and mint their track as a unique **ERC-721 NFT**.
- **Verifiable Fan Ownership:** Fans can browse and purchase tokenized music tracks. Upon purchase, the NFT is immediately transferred to their wallet, granting provable ownership.
- **Automated Royalties:** Powered by a smart contract, royalties are distributed automatically upon purchase. The MVP logic splits revenue **90% to the artist** and 10% to the platform.
- **Decentralized Storage:** All track metadata, audio files, and cover art are stored on **IPFS**, ensuring the assets are persistent and not controlled by a central entity.
- **User Dashboards:**
  - **Artist Dashboard:** Allows artists to upload, mint, and manage their revenue.
  - **Fan Dashboard:** Allows fans to view their collection of owned tracks and transaction history.

---

## 🛠 How It Works (MVP User Flow)

1.  An artist connects their wallet using **RainbowKit**.
2.  They use the artist dashboard to upload their audio file, cover art, and metadata (title, price, etc.).
3.  The system uploads and pins the files and metadata to **IPFS**.
4.  The smart contract mints a new **ERC-721 token** (NFT) that links to the IPFS hash, representing ownership of the track.
5.  A fan browses the available tracks and initiates a purchase.
6.  The smart contract handles the transaction: it transfers the NFT to the fan's wallet and automatically distributes the royalties (90% to the artist, 10% to the platform).
7.  The fan can now see their newly acquired music NFT in their personal dashboard.

---

## Technical Stack

This project integrates modern web3 and web2 technologies:

| Layer                     | Technology                        | Description                                                        |
| :------------------------ | :-------------------------------- | :----------------------------------------------------------------- |
| **Smart Contract**        | **Solidity + Hardhat**            | Contains all logic for minting, transfers, and royalty splits.     |
| **Blockchain Network**    | **Polygon / Base Testnet**        | Chosen for a low-fee environment for minting and transactions.     |
| **Frontend**              | **Next.js (React + TypeScript)**  | Powers the user interface and routing.                             |
| **Web3 Interaction**      | **Wagmi + RainbowKit**            | Used for seamless wallet connection and interaction.               |
| **Contract Comms**        | **Ethers.js**                     | Used for all read/write functions to the smart contract.           |
| **Decentralized Storage** | **IPFS + Pinata**                 | Stores all audio and metadata files permanently.                   |
| **Backend (Optional)**    | **Node.js + Prisma + PostgreSQL** | Used as a cache for metadata and analytics to improve performance. |

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18+)
- Yarn or npm
- A wallet like MetaMask

### Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/museed-mvp.git](https://github.com/your-username/museed-mvp.git)
    ```
2.  **Install dependencies:**
    ```sh
    cd museed-mvp
    npm install
    ```
3.  **Set up environment variables:**
    - Create a `.env.local` file and add your keys for Pinata, RPC provider (e.g., Alchemy/Infura), and your private key for testnet deployment.
4.  **Run the development server:**
    ```sh
    npm run dev
    ```

---

## 🗺 Roadmap After MVP

This MVP is the foundation for the full Museed ecosystem. Future phases include:

- **Phase 2: Artist Crowdfunding**
  - Allow fans to fund new projects directly.
- **Phase 3: Collaboration Ecosystem**
  - Enable remixing and shared royalties for collaborators.
- **Phase 4: DAO Governance**
  - Transition to community-driven platform decisions.
