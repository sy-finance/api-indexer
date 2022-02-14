import { ethers } from "ethers";
import provider from "../../providers/json-rpc-provider.mjs";

import abi from "./abi.mjs";

const contract = new ethers.Contract(
  "0xe145C6Cb2FA344cb9A1335685F844bDfF3470321",
  abi,
  provider
);

/**
 * Get total nft likes for item at index in supply.
 *
 * @param {number} index
 * @returns {Promise<string>}
 */
export async function nftLikes(index) {
  const value = await contract.callStatic.nftLikes(index);
  return value.likes.toString();
}

/**
 * Get total nft diamonds for item at index in supply.
 *
 * @param {number} index
 * @returns {Promise<string>}
 */
export async function nftDiamonds(index) {
  const value = await contract.callStatic.nftDiamonds(index);
  return value.diamonds.toString();
}

export default {
  nftLikes,
  nftDiamonds,
};
