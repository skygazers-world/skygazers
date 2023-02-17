const RNG = require("./rng");
const inpath = "./in";
const outpath = "./out";

// png 2500x2500
const traits = [{
    name: "eyes",
    items: [
        {
            "file": "1.png",
            "name": "ChromoEyes",
            "description": "Interchangeable irises that allow for color and pattern manipulation"
        },
        {
            "file": "1.png",
            "name": "LensMorphs",
            "description": "Compound lenses that provide a wider field of vision and the ability to detect different wavelengths of light"
        },
        {
            "file": "1.png",
            "name": "HeatSighters",
            "description": "Heat-sensitive pupils that adjust in response to temperature changes"
        },
        {
            "file": "1.png",
            "name": "GlowScleras",
            "description": "Bioluminescent sclera that emit a soft glow, used for communication and low-light vision"
        }
    ]
},
{
    name: "mouths",
    items: [
        {
            "file": "2.png",
            "name": "MultiBite",
            "description": "Multi-hinged jaw that allows for wider mouth opening and consumption of larger prey"
        },
        {
            "file": "2.png",
            "name": "FlexiLips",
            "description": "Prehensile lips capable of grasping and manipulating objects"
        },
        {
            "file": "2.png",
            "name": "VenomFangs",
            "description": "Poisonous fangs used for self-defense and hunting prey"
        },
        {
            "file": "2.png",
            "name": "SonicMouth",
            "description": "Vocal sacs in the mouth that amplify sound for communication and hunting purposes"
        }
    ]
},
{
    name: "body",
    items: [
        {
            "file": "3.png",
            "name": "LightSkin",
            "description": "Bioluminescent skin that can be used for communication, camouflage, and navigation"
        },
        {
            "file": "3.png",
            "name": "ChitinArmor",
            "description": "Exoskeleton or chitinous armor for protection against predators and harsh environments"
        },
        {
            "file": "3.png",
            "name": "FlexiLimb",
            "description": "Multiple limbs with variable joint structures for greater mobility and versatility in movement"
        },
        {
            "file": "3.png",
            "name": "DensityShift",
            "description": "Ability to manipulate body density and shape for self-defense and survival purposes"
        }
    ]
},
// {
//     name: "base", // only 1 - no trait
//     items: [],
// },
{
    name: "situation",  //sky
    items: [{
        "file": "4.png",
        "name": "RingSkies",
        "description": "Multiple moons or rings that create unique patterns in the sky"
    },
    {
        "file": "4.png",
        "name": "AuroraHues",
        "description": "Aurora-like atmospheric phenomena that produce vivid colors and visual displays"
    },
    {
        "file": "4.png",
        "name": "GasGlow",
        "description": "Glowing nebulae or gas clouds that illuminate the sky at night"
    },
    {
        "file": "4.png",
        "name": "SolarStorms",
        "description": "Unusual solar flares or radiation storms that impact the planet's weather and environment"
    }]
},

{
    name: "weapons", // location = backgrounds
    items: [
        {
            "file": "5.png",
            "name": "BioGrow",
            "description": "Organic, living weapons that grow and adapt to their users, gaining new features and abilities over time"
        },
        {
            "file": "5.png",
            "name": "SonicStun",
            "description": "Non-lethal weapons that incapacitate targets through sound or energy fields, without causing permanent damage"
        },
        {
            "file": "5.png",
            "name": "TimeStopper",
            "description": "Temporal weapons that can manipulate time or create temporal anomalies, allowing for strategic advantages in combat"
        },
        {
            "file": "5.png",
            "name": "MorphBlade",
            "description": "Shapeshifting weapons that can transform to suit different combat scenarios, including melee and ranged combat."
        }
    ]
},
{
    name: "location", // location = backgrounds
    items: [
        {
            "file": "6.png",
            "name": "Aurorium",
            "description": "A planet with a highly active aurora that produces beautiful and dazzling light displays"
        },
        {
            "file": "6.png",
            "name": "Chasmic Depths",
            "description": "A network of deep and winding canyons that provide both shelter and danger for those who explore it"
        },
        {
            "file": "6.png",
            "name": "Galactic Bazaar",
            "description": "A bustling and vibrant marketplace where alien merchants trade exotic goods and artifacts"
        },
        {
            "file": "6.png",
            "name": "Neon Forest",
            "description": "A dense and colorful forest with glowing trees and bioluminescent flora, home to various creatures and hidden dangers"
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
        console.log(`modulo ${modulo}`)
        const index = modulo > 0 ? modulo % trait.items.length : 0;
        console.log(`trait ${trait.name} index chosen=${index}`)
        return {
            modulo: Math.floor(modulo / trait.items.length),
            chosentraits: [...chosentraits, { name: trait.name, data: trait.items[index] }]
        };
    }, { modulo: index, chosentraits: [] }).chosentraits;
}



mkMetaData = (item) => {

    const attributes = item.attributes.map((attribute) => {
        return {
            "trait_type": attribute.name,
            "value": `${attribute.data.name}: ${attribute.data.description}`
        }
    })
    return (
        {
            attributes,
            "description": `Skygazer #${item.id}`,
            // "image": `${item.id}.png`,
            "image": `${item.id}.png`,
            "name": `Skygazer #${item.id}`
        }
    )
}

const { exec } = require("child_process");

const mkImage = (item) => {

    return new Promise((resolve, reject) => {

        const attributes = item.attributes.reverse().reduce((s, attribute) => {
            return `${s} ${inpath}/${attribute.data.file}`;
        }, "");
        const outFile = `${outpath}/${item.id}.png`
        const cmd = `convert ${attributes} -layers flatten ${outFile}`;
        console.log(`Running conversion ${cmd}`);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                // console.log(`error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }
            console.log(`written image: ${outFile}`);
            return resolve();
        });
    })

}

const generate = async () => {

    const length = plength();

    const permutations_limit = 10;

    let chosen = [];

    var rng = new RNG(2398472398462384);

    for (let i = 0; i < permutations_limit; i++) {
        let index;
        do {
            index = rng.nextRange(0, length - 1);
        } while (chosen.includes(index));
        console.log(`adding ${index}`);
        chosen.push({
            index: i,
            nft: index
        });
    }

    // console.log(`chosen ones`, chosen);
    const items = chosen.map((item, index) => {
        return { id: index, attributes: pickIndex(item) };
    })
    console.log(`items`, JSON.stringify(items, 0, 2));

    const fs = require('fs');
    const async = require('async');
    const queue = async.queue(
        async (item, completed) => {
            console.log(`processing item ${item.id}`);
            const filePath = `${outpath}/${item.id}.json`;
            const metaData = mkMetaData(item);
            fs.writeFileSync(filePath, JSON.stringify(metaData, 0, 2), (err) => {
                if (err) {
                    console.error(err);
                    //   return;
                }
                console.log(`NFT ${index} written successfully!`);
            });
            await mkImage(item);
            console.log(`mkI done!`);
            completed();
        },
        1);

    items.forEach((item) => { queue.push(item) });


    // items.forEach((item, index) => {
    //     console.log(item);
    //     const filePath = `${outpath}/${index}.json`;
    //     const metaData = mkMetaData({ id: index, attributes: item });
    //     // await mkImage({ id: index, attributes: item });
    //     // fs.writeFileSync(filePath, JSON.stringify(metaData, 0, 2), (err) => {
    //     //     if (err) {
    //     //         console.error(err);
    //     //         //   return;
    //     //     }
    //     //     console.log(`NFT ${index} written successfully!`);
    //     // });
    //     // console.log(`Metadata`, JSON.stringify(metaData, 0, 2))
    // });

}

generate();





