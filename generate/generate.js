const RNG = require("./rng");
const Hash = require('ipfs-only-hash');
var fs = require("fs");

const inpath = "./in";
const outpath = "./out";

// generate the same dummy image for all NFT's
const dummyMode = false;

// do image generation or not
const createImages = false;

// png 2500x2500
const traits_raw = [{
    name: "eyes",
    items: [
        {
            "file": "1.1.png",
            "name": "oneone"
        },
        {
            "file": "1.2.png",
            "name": "onetwo"
        },
        {
            "file": "1.3.png",
            "name": "onethree"
        },
        {
            "file": "1.4.png",
            "name": "onefour"
        },
        {
            "file": "1.5.png",
            "name": "onefive"
        }
    ]
},
{
    name: "mouths",
    items: [
        {
            "file": "2.1.png",
            "name": "twoone"
        },
        {
            "file": "2.2.png",
            "name": "twotwo"
        },
        {
            "file": "2.3.png",
            "name": "twothree"
        },
        {
            "file": "2.4.png",
            "name": "twofour"
        },
        {
            "file": "2.5.png",
            "name": "twofive"
        },
        {
            "file": "2.6.png",
            "name": "twosix"
        }
    ]
},
{
    name: "body",
    items: [
        {
            "file": "3.1.png",
            "name": "threeone"
        },
        {
            "file": "3.2.png",
            "name": "threetwo"
        },
        {
            "file": "3.3.png",
            "name": "threethree"
        },
        {
            "file": "3.4.png",
            "name": "threefour"
        },
        {
            "file": "3.5.png",
            "name": "threefive"
        },
        {
            "file": "3.6.png",
            "name": "threesix"
        },
        {
            "file": "3.7.png",
            "name": "threeseven"
        },
        {
            "file": "3.9.png",
            "name": "threenine"
        }
    ]
},
{
    name: "base",
    items: [
        {
            "file": "4.png",
            "name": "four"
        }
    ]
},
{
    name: "situation",  //sky
    items: [{
        "file": "5.1.png",
        "name": "fiveone"
    },
    {
        "file": "5.2.png",
        "name": "fivetwo"
    },
    {
        "file": "5.3.png",
        "name": "fivethree"
    },
    {
        "file": "5.4.png",
        "name": "fivefour"
    },
    {
        "file": "5.5.png",
        "name": "fivefive"
    },
    {
        "file": "5.6.png",
        "name": "fivesix"
    },
    {
        "file": "5.7.png",
        "name": "fiveseven"
    },
    {
        "file": "5.8.png",
        "name": "fiveeight"
    },
    {
        "file": "5.9.png",
        "name": "fivenine"
    },
    {
        "file": "5.11.png",
        "name": "fiveeleven"
    },
    {
        "file": "5.13.png",
        "name": "fivethirteen"
    }
    ]
},

{
    name: "locations", // location = backgrounds
    items: [
        {
            "file": "6.1.png",
            "name": "sixone"
        },
        {
            "file": "6.2.png",
            "name": "sixtwo"
        },
        {
            "file": "6.3.png",
            "name": "sixthree"
        },
        {
            "file": "6.4.png",
            "name": "sixfour"
        },
        {
            "file": "6.5.png",
            "name": "sixfive"
        },
        {
            "file": "6.6.png",
            "name": "sixsix"
        },
        {
            "file": "6.7.png",
            "name": "sixseven"
        }
    ]
},
];

const traits = traits_raw.reduce(({ offset, traits }, trait, i) => {
    const trait_new = trait.items.map((trait_item, i) => {
        return {
            ...trait_item,
            bitmask: offset + i
        }

    });

    trait.offset = offset;
    traits.push({ name: trait.name, items: trait_new });
    return ({ offset: offset + trait.items.length, traits })
}, { offset: 0, traits: [] })

console.log(JSON.stringify(traits, 0, 2));
process.exit();

// return total length of all possible permutations
const plength = () => {
    return traits.reduce((total, trait, i) => {
        total = total * trait.items.length;
        console.log(`trait ${trait.name} has ${trait.items.length} variations. total=${total}`)
        return total;
    }, 1);
}

// returns any NFT between 0 and length of permutations
const pickIndex = (index) => {
    const pi = traits.reduce(({ modulo, chosentraits }, trait, i) => {
        // console.log(`modulo `, modulo)
        // const index = modulo > 0 ? modulo % trait.items.length : 0;
        const index = modulo % trait.items.length;
        // console.log(`trait ${trait.name} index chosen=${index}`)
        return {
            modulo: Math.floor(modulo / trait.items.length),
            chosentraits: [...chosentraits, { name: trait.name, data: trait.items[index] }]
        };
    }, { modulo: index, chosentraits: [] }).chosentraits;
    console.log(JSON.stringify(pi));
    return pi;
}

mkMetaData = (item, imageHash) => {
    const attributes = item.attributes.map((attribute) => {
        return {
            "trait_type": attribute.name,
            "value": dummyMode ? `Quaak ${item.id}` : `${attribute.data.name}`
        }
    })
    return (
        {
            attributes,
            "description": `Skygazer #${item.id}`,
            // "image": `${item.id}.png`,
            "image": `ipfs://${imageHash}`,
            "name": `Skygazer #${item.id}`
        }
    )
}

const { exec } = require("child_process");

const mkImage = (item) => {
    return new Promise((resolve, reject) => {
        let attributes;
        if (dummyMode) {
            attributes = `${inpath}/6.1.png`;
        } else {
            attributes = item.attributes.reverse().reduce((s, attribute) => {
                return `${s} ${inpath}/${attribute.data.file}`;
            }, "");
        }
        const outFile = `${outpath}/${item.id}.png`
        const cmd = `convert ${attributes} -layers flatten ${outFile}`;
        console.log(`Running conversion ${cmd}`);
        exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }
            console.log(`written image: ${outFile}`);
            const stream = fs.createReadStream(outFile);
            const hash = await Hash.of(stream);
            stream.close();

            console.log(`ipfs hash of ${outFile} = ${hash}`);

            return resolve(hash);
        });
    });
}
const mkThumbnail = (item, size, format) => {
    return new Promise((resolve, reject) => {
        const inFile = `${outpath}/${item.id}.png`
        const outFile = `${outpath}/${item.id}_${size}.${format}`
        const cmd = `convert ${inFile} -resize ${size}x ${outFile}`;
        console.log(`Running conversion ${cmd}`);
        exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }
            console.log(`written image: ${outFile}`);

            const stream = fs.createReadStream(outFile);
            const hash = await Hash.of(stream);
            stream.close();

            console.log(`ipfs hash of ${outFile} = ${hash}`);

            return resolve(hash);
        });
    });
}



const generate = async () => {

    const max_permutations = plength();

    // note: must be lower than max_permutations
    const permutations_limit = 55;

    if (permutations_limit > max_permutations) {
        throw new Error(`Cannot generate more than ${max_permutations} items`);
    }

    let chosen = [];

    var rng = new RNG(2398472398462384);

    while (chosen.length < permutations_limit) {
        index = rng.nextRange(0, max_permutations - 1);
        if (chosen.find((item) => { return index === item.nftId })) {
            console.log(`collision - not adding this one`);
        } else {
            console.log(`adding ${index}`);
            chosen.push({
                index: chosen.length,
                nftId: index
            });
        }
    }

    console.log(`chosen ones`, chosen);
    const items = chosen.map((item, index) => {
        return { id: index, attributes: pickIndex(item.nftId) };
    })

    const fs = require('fs');
    const async = require('async');
    const queue = async.queue(
        async (item, completed) => {
            console.log(`processing item ${item.id}`);

            const imageHash = createImages && await mkImage(item);
            createImages && await mkThumbnail(item, 660, "jpeg");
            createImages && await mkThumbnail(item, 1000, "jpeg");

            const filePath = `${outpath}/${item.id}.json`;
            const metaData = mkMetaData(item, imageHash);
            fs.writeFileSync(filePath, JSON.stringify(metaData, 0, 2), (err) => {
                if (err) {
                    console.error(err);
                }
                console.log(`NFT ${index} written successfully!`);
            });
            completed();
        },
        1);
    items.forEach((item) => { queue.push(item) });
}

generate();





