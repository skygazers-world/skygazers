const gwListURL = "https://raw.githubusercontent.com/ipfs/public-gateway-checker/master/src/gateways.json";
const axios = require("axios");
const main = async () => {
    const gwList = (await axios.get(gwListURL))?.data
        .reduce((accum, line) => {
            if (!(/\.onion/i).test(line)) {
                accum.push(line.replace(":hash", ""));
            }
            return accum;
        }, []);
    console.log(`Gateways loaded`);
    console.log(gwList);
};

main();