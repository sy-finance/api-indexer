# Syfin NFT Market API Indexer Server

This iterates through all Syfin minted NFTs and saves all non blacklisted
NFTS to a nftlist.json file that is read by the frontend for sorting/filtering.

## To Run

```sh
node api.js
```

## Options

- `--help` help
- `--output=filename` specify output filename (default: nftlist.json)
- `--forever` run script forever (default: false)

e.g.:

```sh
node api.js --output=custom-filename.json --forever
```
