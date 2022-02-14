import { ethers } from "ethers";

// TODO: Read provider url from environment variable/script argument.
const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools/");

export default provider;
