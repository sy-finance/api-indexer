import fs from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import contracts from "./lib/contracts/contracts.js";

async function getData(index) {
  const imageData = await contracts.nfts.imageData(index);
  const likes = await contracts.likes.nftLikes(index);
  const diamonds = await contracts.likes.nftDiamonds(index);
  const blacklisted = await contracts.blacklist.getBlackListedNFT(index);

  return {
    index,
    imageData,
    likes,
    diamonds,
    blacklisted,
  };
}

function getBatch(from, to) {
  const promises = [];
  for (let index = from; index >= to; index--) {
    promises.push(getData(index));
  }

  // NOTE: We could use Promise.allSettled() instead and check on status whether
  // getting data failed or not, and retry when failure happens.
  return Promise.all(promises);
}

async function writeNFTList(options) {
  const totalSupply = Number(await contracts.nfts.totalSupply());
  const stats = {
    total: 0,
    blacklisted: 0,
  };

  console.log(
    `Write nftlist (totalSupply: ${totalSupply}) (output: ${options.output}) (forever: ${options.forever})`
  );
  console.time("write-nftlist");

  // open json output file
  const filename = `nft_list_${Date.now()}.json`;
  const fh = await fs.open(filename, "w+");
  await fh.write("[");

  // fetch nft items, and write to file asynchronously
  const batchSize = 10;
  let first = true;
  for (let i = totalSupply - 1; i > 0; i -= batchSize) {
    const from = i;
    const to = i - (batchSize - 1) > 0 ? i - (batchSize - 1) : 0;

    const batch = await getBatch(from, to);
    for (const item of batch) {
      if (item.blacklisted) {
        console.warn(`Skipping blacklisted item with index: ${item.index}`);
        stats.blacklisted += 1;
        continue;
      }
      stats.total += 1;

      if (!first) {
        await fh.write(",");
      }
      first = false;

      const data = {
        id: item.index,
        name: item.imageData.name,
        nftData: item.imageData.nftData,
        mimeType: item.imageData.mimeType,
        category: item.imageData.category,
        price: item.imageData.price,
        likecount: item.likes,
        icecount: item.diamonds,
      };
      await fh.write(JSON.stringify(data));
    }
  }

  // close json output
  await fh.write("]");
  await fh.close();

  await fs.rm(options.output, { force: true });
  await fs.rename(filename, options.output);

  console.timeEnd("write-nftlist");
  console.log("stats:");
  console.log("------");
  console.log(`Total supply: ${totalSupply}`);
  console.log(`Wrote ${stats.total} items to ${options.output}.`);
  console.log(`Skipped ${stats.blacklisted} blacklisted items.`);
  console.log("");
  console.log("");
}

async function main(options) {
  await writeNFTList(options);
  if (options.forever) {
    setTimeout(() => main(options), 1000);
  }
}

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});

main(
  yargs(hideBin(process.argv))
    .scriptName("api.js")
    .option("output", {
      alias: "o",
      type: "string",
      describe: "Specify output filename",
      default: "nftlist.json",
    })
    .option("forever", {
      alias: "f",
      type: "boolean",
      describe: "Run this script forever",
      default: false,
    })
    .help().argv
);
