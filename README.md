# Syfin NFT Market API Indexer Server

This iterates through all Syfin minted NFTs and then indexes and saves them to a nftlist.json file that is read by the frontend for sorting/filtering.

## To Run

`node api.js`

You can use forever to run it forever also

`npm install -g forever`

`forever start api.js`