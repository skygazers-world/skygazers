import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CollectionFilter {
    filter: number[][],
    setFilter: (filter: number[][]) => void
}

const useCollectionFilter = create<CollectionFilter>()(
    persist(
        (set) => ({
            filter: [],
            setFilter: (filter) => set(() => ({ filter })),
        }), {
        name: "skygazers-gallery-filter-v2"
    })
)


// const hasCommonTraits = (arr1, arr2) => {
//     // let ptr1 = 0; // Pointer for arr1
//     // let ptr2 = 0; // Pointer for arr2

//     // while (ptr1 < arr1.length && ptr2 < arr2.length) {
//     //     if (arr1[ptr1] === arr2[ptr2]) {
//     //         // Common integer found
//     //         return true;
//     //     } else if (arr1[ptr1] < arr2[ptr2]) {
//     //         ptr1++; // Increment pointer for arr1
//     //     } else {
//     //         ptr2++; // Increment pointer for arr2
//     //     }
//     // }

//     // No common integer found
//     return false;
// };

// const dec2bin = (dec) => {
//     const n = (dec >>> 0).toString(2);
//     return "00000000000000000".substring(n.length) + n;
// }


export { useCollectionFilter };
