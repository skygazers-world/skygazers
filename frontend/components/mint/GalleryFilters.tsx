import { useEffect, useState } from "react";
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useCollectionFilter } from "hooks/useCollectionFilter";
import traits from "../../data/traits.json";

const CheckboxGroup = ({ data }) => {

  const { filter, setFilter } = useCollectionFilter(); // Renamed variables

  const initialFilter = filter.length === 0
    ? data.map(group => group.items.map(() => false))
    : filter;

  const [checkedValues, setCheckedValues] = useState(initialFilter); // Renamed state variables


  // console.log("FM=", JSON.stringify(checkedValues, null, 2));
  // Create a state to manage the checkboxes
  // const [checkedValues, setCheckedValues] = useState(() => {
  //   return data.map(group => group.items.map(() => false));
  // });

  useEffect(() => {
    // console.log(JSON.stringify(checkedValues,null,2));
    // getCheckedValues();
    setFilter(checkedValues);
  }, [checkedValues]);

  // Handle checkbox change
  const handleCheckboxChange = (groupIndex, itemIndex) => {
    setCheckedValues(prevState => {
      const newState = [...prevState];
      newState[groupIndex][itemIndex] = !newState[groupIndex][itemIndex];
      return newState;
    });
  };

  // // Function to get checked values
  // const getCheckedValues = () => {
  //   const values = [];
  //   for (let groupIndex = 0; groupIndex < data.length; groupIndex++) {
  //     const groupData = data[groupIndex];
  //     const selectedIndexes = [];
  //     for (let itemIndex = 0; itemIndex < groupData.items.length; itemIndex++) {
  //       if (checkedValues[groupIndex][itemIndex]) {
  //         selectedIndexes.push(groupData.items[itemIndex].index);
  //       }
  //     }
  //     values.push(selectedIndexes); // Push the array regardless of its length
  //   }
  //   console.log(JSON.stringify(values, null, 2));
  //   return values;
  // };

  return (
    <div>
      {data.map((group, groupIndex) => (

        <Disclosure defaultOpen={false} as="div" key={groupIndex} className="border-b border-gray-200 py-6">
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center">
                  <p className="text-[16px] leading-[20px] flex-1 text-left font-bold">{group.name}</p>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  <div key={groupIndex}>
                    {/* <h2>{group.name}</h2> */}
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <input
                          type="checkbox"
                          checked={checkedValues[groupIndex][itemIndex]}
                          onChange={() => handleCheckboxChange(groupIndex, itemIndex)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                        />

                        <label
                          // htmlFor={`filter-${sectionIdx}-${optionIdx}`}
                          className="ml-3 text-sm text-sgbodycopy"
                        >
                          {item.name}
                        </label>

                      </div>
                    ))}
                  </div>

                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
};


const FilterRadioGroup = () => {
  // // const [renderedTraits,setRenderedTraits] = useState<object>();

  // // const [ setFilterMaskRendered] = useState<number[]>();
  // useEffect(() => {
  //  console.log("Filtermask=",filterMask);
  // }, [filterMask])

  return (
    <CheckboxGroup data={traits} />
  )
}


export const GalleryFilters = () => {

  // const filterMask = useCollectionFilter((state) => state.filter);
  const [isOpen, toggleIsOpen] = useState(false);
  // const [interactedWithFilter, setInteractedWithFilter] = useState(false);

  // useEffect(() => {
  //   setInteractedWithFilter(true);
  //   toggleIsOpen(filterMask.length > 0 || interactedWithFilter)
  // }, [filterMask])


  return (
    <div className="w-full flex-col justify-start items-center pt-[20px] pb-[0px]">

      <div className="flex flex-row items-center justify-center cursor-pointer">
        <div className={isOpen ? "transition-all ease-in-out w-[12px] h-[12px] rotate-90 mr-2" : " transition-all ease-in-outw-[9px] h-[12px] rotate-0  mr-2"}>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 4.73333L1 9" stroke="#59342B" />
          </svg>
        </div>
        <p className="text-[16px] leading-[20px] underline" onClick={() => toggleIsOpen(!isOpen)}>filter & sort</p>
      </div>
      <div className={isOpen ? "block mt-[30px] lg:mt-[10px] lg:mb-[0px]" : "hidden"}>
        {/* <FilterCollapser title="characters" options={["Monk","Warrior Princess"]} /> */}
        <FilterRadioGroup />
      </div>
    </div>
  )
}