import { ethers, BigNumber } from "ethers";
import provider from "../../providers/json-rpc-provider.js";

import abi from "./abi.js";

const contract = new ethers.Contract(
  "0x954d9EC10bb19B64EF07603c102f5BBd75216276",
  abi,
  provider
);

/**
 * @typedef {Object} ImageData
 * @property {string} name
 * @property {string} mimeType
 * @property {string} nftData
 * @property {string} category
 * @property {string} description
 * @property {string} url
 * @property {string} price
 */

/**
 * Get total supply
 * @returns {Promise<bigint>
 */
export async function totalSupply() {
  /** @type {import('ethers').BigNumber} */
  const totalSupply = await contract.callStatic.totalSupply();
  return totalSupply.toBigInt();
}

/**
 * Get image data for given index
 * @param {number} index
 * @returns {Promise<ImageData>}
 */
export async function imageData(index) {
  const { name, mimeType, nftData, category, description, url, price } =
    await contract.callStatic.imageData(index);

  return {
    name,
    mimeType,
    nftData,
    category,
    description,
    url,
    price: price.toString(),
  };
}

export default {
  totalSupply,
  imageData,
};
