import { useEffect, useState } from "react";
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useCollectionFilter } from "hooks/useCollectionFilter";
import { traits } from "../../data/traits.json";

const CheckboxGroup = ({ data }) => {

  const { filter, setFilter, resetFilter } = useCollectionFilter(); // Renamed variables

  const emptyFilter = data.map(group => group.items.map(() => false));

  const initialFilter = filter?.length === 0
    ? emptyFilter
    : filter;

  const [checkedValues, setCheckedValues] = useState(initialFilter); // Renamed state variables

  useEffect(() => {
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

  return (
    <div>
      <div className="clearSelection" onClick={() => {
        setCheckedValues(emptyFilter);
      }}>reset filter</div>
      {data.map((group, groupIndex) => (
        <div id={groupIndex}>
          {
            group.visible && (
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
            )
          }
        </div>
      ))}
    </div>
  );
};


const FilterRadioGroup = () => {
  return (
    <CheckboxGroup data={traits} />
  )
}


export const GalleryFilters = () => {
  const [isOpen, toggleIsOpen] = useState(false);
  return (
    <div className="w-[120px] bg-slate-800 md:bg-transparent md:w-full flex-col justify-start items-center pt-[20px] pb-[0px]">

      <div className="flex flex-row items-center justify-center cursor-pointer">
        <div className={isOpen ? "transition-all ease-in-out w-[12px] h-[12px] rotate-90 mr-2" : " transition-all ease-in-outw-[9px] h-[12px] rotate-0  mr-2"}>
          <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 4.73333L1 9" stroke="#59342B" />
          </svg>
        </div>
        <p className="text-[16px] leading-[20px] underline" onClick={() => toggleIsOpen(!isOpen)}>filter & sort</p>
      </div>
      <div className={isOpen ? "block mt-[30px] lg:mt-[10px] lg:mb-[0px]" : "hidden"}>
        <FilterRadioGroup />
      </div>
    </div>
  )
}