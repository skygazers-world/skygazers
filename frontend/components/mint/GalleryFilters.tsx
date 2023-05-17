import { useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { useCollectionFilter } from "hooks/useCollectionFilter";
import traits from "../../data/traits.json";

const FilterRadioGroup = () => {
  const filterMask = useCollectionFilter((state) => state.filter);
  const setFilterMask = useCollectionFilter((state) => state.setFilter);
  // const [renderedTraits,setRenderedTraits] = useState<object>();

  const [filterMaskRendered, setFilterMaskRendered] = useState<number[]>();
  useEffect(() => {
    setFilterMaskRendered(filterMask);
    // setRenderedTraits(traits.map((section)=>{
    //   section.items.map
    // }))
  }, [filterMask])

  return (
    <form className="hidden lg:block">
      {/* {filterMaskRendered?.map((item) => {
        return (<li>{item}</li>)
      })} */}
      {traits.map((section, sectionIdx) => (
        <Disclosure defaultOpen={true} as="div" key={sectionIdx} className="border-b border-gray-200 py-6">
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center">
                  <p className="text-[16px] leading-[20px] flex-1 text-left font-bold">{section.name}</p>
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
                  {section.items.map((option, optionIdx) => (
                    <div key={option.name} className="flex items-center">
                      <input
                        id={`filter-${sectionIdx}-${optionIdx}`}
                        name={`${sectionIdx}${optionIdx}[]`}
                        defaultValue={option.name}
                        type="checkbox"
                        checked={(filterMask.includes(option.index))}
                        onChange={(e) => {
                          console.log(`option ${option.index} is now ${e.target.checked}`);
                          let newMask: number[] = [];
                          if (e.target.checked) {
                            newMask = [...filterMask, option.index];
                          } else {
                            newMask = filterMask.filter((item) => item !== option.index)
                          }
                          setFilterMask(newMask);
                        }}
                        // defaultChecked={option.checked}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                      />
                      <label
                        htmlFor={`filter-${sectionIdx}-${optionIdx}`}
                        className="ml-3 text-sm text-sgbodycopy"
                      >
                        {option.name} ({option.index})
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  )
}


export const GalleryFilters = () => {

  const filterMask = useCollectionFilter((state) => state.filter);
  const [isOpen, toggleIsOpen] = useState(false);
  const [interactedWithFilter, setInteractedWithFilter] = useState(false);

  useEffect(() => {
    setInteractedWithFilter(true);
    toggleIsOpen(filterMask.length > 0 || interactedWithFilter)
  }, [filterMask])


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