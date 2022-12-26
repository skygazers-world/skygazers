import pricecurveDroids from "../pricecurve-droids.json";
import { BigNumber } from "ethers";


export const getPrices = (currentIndex: number, amount: number) => {

    let total = BigNumber.from(0);
    let itemPrices: BigNumber[] = [];
    for (let i = currentIndex; i < currentIndex + amount; i++) {
        console.log(`current item ${i} - data point ${pricecurveDroids[i]}`);
        const nftPrice = BigNumber.from(pricecurveDroids[i]);
        console.log(`NFT price = ${typeof nftPrice}`);
        total = total.add(nftPrice);
        itemPrices.push(nftPrice);
    }

    return { total, itemPrices }

}