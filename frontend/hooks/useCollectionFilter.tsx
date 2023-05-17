import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CollectionFilter {
    filter: number,
    setFilter: (filter: number) => void
}

const useCollectionFilter = create<CollectionFilter>()(
    persist(
        (set) => ({
            filter: 0,
            setFilter: (filter) => set(() => ({ filter })),
        }), {
        name: "skygazers-gallery-filter"
    })
)


const dec2bin = (dec) => {
    const n = (dec >>> 0).toString(2);
    return "00000000000000000".substring(n.length) + n;
}


export { useCollectionFilter, dec2bin };
