const RNG = require("./rng");
const Hash = require('ipfs-only-hash');
var fs = require("fs");

// const inpath = "/Volumes/LaCie ScratchDisk/SG_ART";
// const outpath = "/Volumes/LaCie ScratchDisk/SG_ART_OUT";
const inpath = "./SG_ART";
const outpath = "./SG_ART_OUT";

// generate the same dummy image for all NFT's
const dummyMode = false;

// do image generation or not
const createImages = false;

// # of images to make
const LIMIT = 3000;

// png 2500x2500
const traits_raw = [{
    name: "face top",
    visible: true,      // can be used to filter in frontend
    items: [
        {
            "file": "1.1.png",
            "name": "1.1"
        },
        {
            "file": "1.2.png",
            "name": "1.2"
        },
        {
            "file": "1.3.png",
            "name": "1.3"
        },
        {
            "file": "1.4.png",
            "name": "1.4"
        },
        {
            "file": "1.5.png",
            "name": "1.5"
        }
    ]
},
{
    name: "face bottom",
    visible: true,      // can be used to filter in frontend
    items: [
        {
            "file": "2.1.png",
            "name": "2.1"
        },
        {
            "file": "2.2.png",
            "name": "2.2"
        },
        {
            "file": "2.3.png",
            "name": "2.3"
        },
        {
            "file": "2.4.png",
            "name": "2.4"
        },
        {
            "file": "2.5.png",
            "name": "2.5"
        },
        {
            "file": "2.6.png",
            "name": "2.6"
        }
    ]
},
{
    name: "clothing",
    visible: true,      // can be used to filter in frontend
    items: [
        {
            "file": "3.1.png",
            "name": "3.1"
        },
        {
            "file": "3.2.png",
            "name": "3.2"
        },
        {
            "file": "3.3.png",
            "name": "3.3"
        },
        {
            "file": "3.4.png",
            "name": "3.4"
        },
        {
            "file": "3.5.png",
            "name": "3.5"
        },
        {
            "file": "3.6.png",
            "name": "3.6"
        },
        {
            "file": "3.7.png",
            "name": "3.7"
        },
        {
            "file": "3.9.png",
            "name": "3.9"
        }
    ]
},
{
    name: "base",
    visible: false,
    items: [
        {
            "file": "4.1png",
            "name": "4.1"
        }
    ]
},
{
    name: "situation",  //sky
    visible: true,
    items: [{
        "file": "5.1.png",
        "name": "5.1"
    },
    {
        "file": "5.2.png",
        "name": "5.2"
    },
    {
        "file": "5.3.png",
        "name": "5.3"
    },
    {
        "file": "5.4.png",
        "name": "5.4"
    },
    {
        "file": "5.5.png",
        "name": "5.5"
    },
    {
        "file": "5.6.png",
        "name": "5.6"
    },
    {
        "file": "5.7.png",
        "name": "5.7"
    },
    {
        "file": "5.8.png",
        "name": "5.8"
    },
    {
        "file": "5.9.png",
        "name": "5.9"
    },
    {
        "file": "5.10.png",
        "name": "5.10"
    },
    {
        "file": "5.11.png",
        "name": "5.11"
    },
    {
        "file": "5.12.png",
        "name": "5.12"
    }
    ]
},

{
    name: "location", // location = backgrounds
    visible: true,
    items: [
        {
            "file": "6.1.png",
            "name": "6.1"
        },
        {
            "file": "6.2.png",
            "name": "6.2"
        },
        {
            "file": "6.3.png",
            "name": "6.3"
        },
        {
            "file": "6.4.png",
            "name": "6.4"
        },
        {
            "file": "6.5.png",
            "name": "6.5"
        },
        {
            "file": "6.6.png",
            "name": "6.6"
        },
        {
            "file": "6.7.png",
            "name": "6.7"
        },
        {
            "file": "6.8.png",
            "name": "6.8"
        },
        {
            "file": "6.9.png",
            "name": "6.9"
        }
    ]
},
];

const dec2bin = (dec) => {
    const n = (dec >>> 0).toString(2);
    return "00000000000000000".substring(n.length) + n;
}


let traitCount = -1;
const traits = traits_raw.reduce(({ offset, traits }, trait, j) => {
    const trait_new = trait.items.map((trait_item, i) => {
        traitCount++;
        return {
            ...trait_item,
            index: traitCount
        }
    });
    trait.offset = offset;
    traits.push({ name: trait.name, visible: trait.visible, items: trait_new });
    return ({ offset: offset + trait.items.length, traits })
}, { offset: 0, traits: [] }).traits;

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
    attributes.push({ "trait_type": "character", "value": "Monk" })
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
    return new Promise(async (resolve, reject) => {
        let attributes;
        if (dummyMode) {
            attributes = `"${inpath}/6.1.png"`;
        } else {
            attributes = item.attributes.reverse().reduce((s, attribute) => {
                return `${s} "${inpath}/${attribute.data.file}"`;
            }, "");
        }
        const outFile = dummyMode ? `${outpath}/0.png` : `${outpath}/${item.id}.png`
        if (dummyMode && fs.existsSync(outFile)) {
            const stream = fs.createReadStream(outFile);
            const hash = await Hash.of(stream);
            stream.close();
            console.log(`ipfs hash of ${outFile} = ${hash}`);
            return resolve(hash);
        }
        const cmd = `convert ${attributes} -layers flatten "${outFile}"`;
        console.log(`Running conversion ${cmd}`);
        const child = exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }
        });

        child.on('close', async (code) => {
            console.log(`child process exited with code ${code}`);
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
        const cmd = `convert "${inFile}" -resize ${size}x "${outFile}"`;
        console.log(`Running conversion ${cmd}`);
        const child = exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }


        });

        child.on('close', async (code) => {
            console.log(`child process exited with code ${code}`);
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
    const permutations_limit = LIMIT;

    if (permutations_limit > max_permutations) {
        throw new Error(`Cannot generate more than ${max_permutations} items`);
    }

    let chosen = [];
    let traitsmap = [];

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
    let t0, t1, duration;
    const queue = async.queue(
        async (item) => {
            try {
                t0 = performance.now();
                console.log(`processing item ${item.id}`);
                // console.log(`item=`, JSON.stringify(item, null, 2));

                const imageHash = createImages && await mkImage(item);
                if (!dummyMode) {
                    createImages && await mkThumbnail(item, 400, "jpeg");
                    createImages && await mkThumbnail(item, 660, "jpeg");
                    createImages && await mkThumbnail(item, 1000, "jpeg");
                }
                const filePath = `${outpath}/${item.id}.json`;
                const metaData = mkMetaData(item, imageHash);
                fs.writeFileSync(filePath, JSON.stringify(metaData, 0, 2), (err) => {
                    if (err) {
                        console.error(err);
                    }
                    console.log(`NFT ${index} written successfully!`);
                });

                // create trait index
                const combinedTraitsArray = item.attributes.reduce((accum, attribute, i) => {
                    console.log(`trait ${i} : ${dec2bin(attribute.data.index)}`);
                    accum.push(attribute.data.index);
                    return accum;
                }, []);
                console.log(`final trait index is ${dec2bin(combinedTraitsArray)} (${combinedTraitsArray})`);
                // console.log(`traits`,JSON.stringify(traits,null,2));
                traitsmap.push(combinedTraitsArray);

                t1 = performance.now();
                if (!duration) {
                    duration = t1 - t0;
                } else {
                    duration = (duration + t1 - t0) / 2
                }
                console.log(`--> duration was ${Math.floor(duration)} ms - items left = ${queue.length()}`);
                console.log("***********************");
                console.log(`ETA = ${(queue.length() * duration / 1000 / 60).toFixed(2)} min / ${(queue.length() * duration / 1000 / 60 / 60).toFixed(2)} hours`)
                console.log("***********************");
            } catch (e) {
                console.log("ERROR", e.message);
            }
        },
        1);
    queue.drain(() => {
        console.log("We're done here");
        // console.log(traitsmap);
        // save mapping of NFT to traits
        const traitsMapFile = "../frontend/data/traitsmap.json"
        console.log(`writing traitsmap in ${traitsMapFile}`);
        fs.writeFileSync(traitsMapFile,
            JSON.stringify(traitsmap),
            (err) => {
                if (err) {
                    console.error(err);
                }
                console.log(`traitsmap written successfully!`);
            });
        // save mapping of NFT to traits
        const traitsFile = "../frontend/data/traits.json"
        console.log(`writing traits in ${traitsFile}`);
        const filteredTraits = traits.reduce((accum, trait) => {
            // if (trait.name !== "base") 
            accum.push(trait);
            return accum;
        }, []);
        fs.writeFileSync(traitsFile,
            JSON.stringify({ version: `${Date.now()}`, traits: filteredTraits }, null, 2), (err) => {
                if (err) {
                    console.error(err);
                }
                console.log(`traits written successfully!`);
            });

    })
    items.forEach((item) => { queue.push(item) });
}

generate();





