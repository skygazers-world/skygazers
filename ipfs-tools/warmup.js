const gwListURL = "https://raw.githubusercontent.com/ipfs/public-gateway-checker/master/src/gateways.json";
const axios = require("axios");
const async = require("async");

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
const mkSlugs = () => {
    let slugs = [];
    for (let i = 0; i < 3; i++) {
        // slugs.push(`QmT7Wtb5scmumvVaF4Y6EsZJ3WTG8ckwg9s26PmmjGqxKQ/${i}_400.jpeg`);
        slugs.push(`QmT7Wtb5scmumvVaF4Y6EsZJ3WTG8ckwg9s26PmmjGqxKQ/${i}_660.jpeg`);
        // slugs.push(`QmT7Wtb5scmumvVaF4Y6EsZJ3WTG8ckwg9s26PmmjGqxKQ/${i}_1000.jpeg`);
        // slugs.push(`QmT7Wtb5scmumvVaF4Y6EsZJ3WTG8ckwg9s26PmmjGqxKQ/${i}.png`);
    }
    return slugs;
}


const main = async () => {
    const gwList = (await axios.get(gwListURL))?.data
        .reduce((accum, line) => {
            if (!(/\.onion/i).test(line)) {
                accum.push(line.replace(":hash", ""));
            }
            return accum;
        }, []);
    console.log(`Gateways loaded`);
    const servers = gwList.slice(0, 2);
    const slugs = mkSlugs();

    console.log(servers);
    console.log(slugs);

    let urls = [];
    servers.map((server) => {
        slugs.map((slug) => {
            urls.push(`${server}${slug}`);
        })
    });
    urls = shuffle(urls);

    console.log(`array`, urls);

    urls.map((url) => {
        q.push({ url })
    })

    q.drain(function () {
        console.log('all items have been processed');

        const failures = Object.keys(stats).reduce((accum, key) => {
            if (stats[key].failures > 0) {
                accum.push([stats[key].url, stats[key].failures]);
            }
            return accum;
        }, []);
        console.log(stats);
        console.log(`failures length=${failures.length}`);
        console.log(failures)
    });

};

let stats = {};

const download = async (task, callback) => {
    console.log(`download ${task.url} (q length=${q.length()})`);
    if (!stats[task.url]) {
        stats[task.url] = {
            success: 1,
            failure: 0,
        }
    }
    await axios.get(task.url, { timeout: 5000 }).then((res) => {
        console.log(`downloaded ${task.url} - length=${res.headers["content-length"]}`);
        stats[task.url].success++;
    }).catch((e) => {
        console.log(`download ${task.url} failed! ${e.message}`);
        stats[task.url].failure++;
    })
    callback();
}

const q = async.queue(download, 2);


main();