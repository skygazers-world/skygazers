import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { version } from "../data/traits.json"

interface CollectionFilter {
    filter: number[][],
    setFilter: (filter: number[][]) => void,
    resetFilter: () => void,
}

const useCollectionFilter = create<CollectionFilter>()(
    persist(
        (set) => ({
            filter: [],
            setFilter: (filter) => set(() => ({ filter })),
            resetFilter: () => set(() => ({ filter: [] })),
        }), {
        name: `skygazers-gallery-filter-${version}`
    })
)

export { useCollectionFilter };
