import { ethers } from "ethers";
import provider from "../../providers/json-rpc-provider.mjs";

import abi from "./abi.mjs";

const contract = new ethers.Contract(
  "0xfBA3E2C37A8F199c22eF9bD331f09023D2110c98",
  abi,
  provider
);

/**
 * Get status whether nft is blacklisted or not
 *
 * @param {number} index
 * @returns {Promise<boolean>}
 */
export function getBlackListedNFT(index) {
  return contract.callStatic.getBlackListedNFT(index);
}

export default {
  getBlackListedNFT,
};
