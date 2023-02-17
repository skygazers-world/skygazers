const RNG = require("./rng");
const Hash = require('ipfs-only-hash');
var fs = require("fs");

const inpath = "./in";
const outpath = "./out";

const dummyMode = true;

// png 2500x2500
const traits = [{
    name: "eyes",
    items: [
        {
            "file": "1.1.png",
            "name": "Blue sunglasses"
        },
        {
            "file": "1.2.png",
            "name": "Green sunglasses"
        },
        {
            "file": "1.3.png",
            "name": "Goggles"
        },
        {
            "file": "1.4.png",
            "name": "Third eye painted"
        }
    ]
},
{
    name: "mouths",
    items: [
        {
            "file": "2.1.png",
            "name": "Goatee and smile"
        },
        {
            "file": "2.2.png",
            "name": "Big beard"
        },
        {
            "file": "2.3.png",
            "name": "Muttonchops"
        },
        {
            "file": "2.4.png",
            "name": "Martial arts master"
        },
        {
            "file": "2.5.png",
            "name": "Biker"
        }
    ]
},
{
    name: "body",
    items: [
        {
            "file": "3.1.png",
            "name": "Bare chest"
        },
        {
            "file": "3.2.png",
            "name": "Layered cloth"
        }
    ]
},
{
    name: "base",
    items: [
        {
            "file": "4.png",
            "name": "Base"
        }
    ]
},
{
    name: "situation",  //sky
    items: [{
        "file": "5.1.png",
        "name": "Sky Fish"
    },
    {
        "file": "5.2.png",
        "name": "Humanparts"
    }]
},

{
    name: "locations", // location = backgrounds
    items: [
        {
            "file": "6.1.png",
            "name": "Seven suns"
        },
        {
            "file": "6.2.png",
            "name": "Big Moon"
        },
        {
            "file": "6.3.png",
            "name": "Desert Globes"
        },
        {
            "file": "6.4.png",
            "name": "Dew pickers"
        }
        ,
        {
            "file": "6.5.png",
            "name": "Dark circles"
        }
    ]
},
];

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
    return traits.reduce(({ modulo, chosentraits }, trait, i) => {
        // console.log(`modulo `, modulo)
        const index = modulo > 0 ? modulo % trait.items.length : 0;
        // console.log(`trait ${trait.name} index chosen=${index}`)
        return {
            modulo: Math.floor(modulo / trait.items.length),
            chosentraits: [...chosentraits, { name: trait.name, data: trait.items[index] }]
        };
    }, { modulo: index, chosentraits: [] }).chosentraits;
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

            const imageHash = await mkImage(item);
            const tnHash = await mkThumbnail(item, 660, "jpeg");

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





