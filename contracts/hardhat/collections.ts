
const collections:
[{
    name: string,
    offset: number,
    amount: number,
    c: [number, number],
    dc: [number, number],
    p: [string, number],
    dp: [number, number]
},
{
    name: string,
    offset: number,
    amount: number,
    c: [number, number],
    dc: [number, number],
    p: [string, number],
    dp: [number, number]
}]
=
[
    {
        name: "droids",
        offset: 0,
        amount: 3000,
        c: [50, 1],
        dc: [1000, 1010],
        p: ["120", 18 - 3],
        dp: [110, 100]
    },
    {
        name: "princess",
        offset: 3000,
        amount: 300,
        c: [50, 1],
        dc: [1000, 1010],
        p: ["120", 18 - 3],
        dp: [110, 100]
    }
]

export = collections;
