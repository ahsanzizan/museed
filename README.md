# Museed 🎹

**A decentralized music platform built on the blockchain, empowering artists and fans.**

[cite_start]This project is the Minimum Viable Product (MVP) for Museed, a platform that redefines music ownership[cite: 3]. [cite_start]It enables artists to directly upload and tokenize their music as NFTs, and allows fans to verifiably purchase and own those tracks[cite: 4].

[cite_start]The core focus of this MVP is to build a working proof of concept demonstrating real blockchain integration, decentralized file storage, and transparent, automated royalty distribution using smart contracts[cite: 5, 8, 58].

---

## 🚀 Core Features

- [cite_start]**Artist Tokenization:** Artists can connect a wallet (e.g., MetaMask) [cite: 11][cite_start], upload their audio file and cover art [cite: 12][cite_start], and mint their track as a unique **ERC-721 NFT**[cite: 14].
- [cite_start]**Verifiable Fan Ownership:** Fans can browse and purchase tokenized music tracks[cite: 16]. [cite_start]Upon purchase, the NFT is immediately transferred to their wallet, granting provable ownership[cite: 17].
- [cite_start]**Automated Royalties:** Powered by a smart contract, royalties are distributed automatically upon purchase[cite: 18, 20]. [cite_start]The MVP logic splits revenue **90% to the artist** and 10% to the platform[cite: 18].
- [cite_start]**Decentralized Storage:** All track metadata, audio files, and cover art are stored on **IPFS**[cite: 13, 38], ensuring the assets are persistent and not controlled by a central entity.
- **User Dashboards:**
  - [cite_start]**Artist Dashboard:** Allows artists to upload, mint, and manage their revenue[cite: 23].
  - [cite_start]**Fan Dashboard:** Allows fans to view their collection of owned tracks and transaction history[cite: 24].

---

## 🛠 How It Works (MVP User Flow)

1.  [cite_start]An artist connects their wallet using **RainbowKit**[cite: 40].
2.  [cite_start]They use the artist dashboard to upload their audio file, cover art, and metadata (title, price, etc.)[cite: 41].
3.  [cite_start]The system uploads and pins the files and metadata to **IPFS**[cite: 42].
4.  [cite_start]The smart contract mints a new **ERC-721 token** (NFT) that links to the IPFS hash, representing ownership of the track[cite: 43].
5.  [cite_start]A fan browses the available tracks and initiates a purchase[cite: 44].
6.  [cite_start]The smart contract handles the transaction: it transfers the NFT to the fan's wallet and automatically distributes the royalties (90% to the artist, 10% to the platform)[cite: 45].
7.  [cite_start]The fan can now see their newly acquired music NFT in their personal dashboard[cite: 46].

---

## 💻 Technical Stack

[cite_start]This project integrates modern web3 and web2 technologies[cite: 48]:

| Layer                     | Technology                        | Description                                                                                  |
| :------------------------ | :-------------------------------- | :------------------------------------------------------------------------------------------- |
| **Smart Contract**        | **Solidity + Hardhat**            | [cite_start]Contains all logic for minting, transfers, and royalty splits[cite: 34, 35, 48]. |
| **Blockchain Network**    | **Polygon / Base Testnet**        | [cite_start]Chosen for a low-fee environment for minting and transactions[cite: 36, 48].     |
| **Frontend**              | **Next.js (React + TypeScript)**  | [cite_start]Powers the user interface and routing[cite: 27, 48].                             |
| **Web3 Interaction**      | **Wagmi + RainbowKit**            | [cite_start]Used for seamless wallet connection and interaction[cite: 28, 48].               |
| **Contract Comms**        | **Ethers.js**                     | [cite_start]Used for all read/write functions to the smart contract[cite: 29].               |
| **Decentralized Storage** | **IPFS + Pinata**                 | [cite_start]Stores all audio and metadata files permanently[cite: 38, 48].                   |
| **Backend (Optional)**    | **Node.js + Prisma + PostgreSQL** | [cite_start]Used as a cache for metadata and analytics to improve performance[cite: 32, 48]. |

---

## 🏁 Getting Started

_(This section is a placeholder. You would typically fill this out with your project's specific setup instructions.)_

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

This MVP is the foundation for the full Museed ecosystem. [cite_start]Future phases include[cite: 54, 55]:

- **Phase 2: Artist Crowdfunding**
  - [cite_start]Allow fans to fund new projects directly[cite: 54].
- **Phase 3: Collaboration Ecosystem**
  - [cite_start]Enable remixing and shared royalties for collaborators[cite: 55].
- **Phase 4: DAO Governance**
  - [cite_start]Transition to community-driven platform decisions[cite: 55].
