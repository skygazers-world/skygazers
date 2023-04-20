import { useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'



const FilterRadioGroup = () => {
      const filters = [
        {
            id: 'facetop',
            name: 'face top',
            options: [
                { value: '1.1', label: '1.1', checked: false },
                { value: '1.2', label: '1.2', checked: false },
                { value: '1.3', label: '1.3', checked: true },
                { value: '1.4', label: '1.4', checked: false },
                { value: '1.5', label: '1.5', checked: false },
                { value: '1.6', label: '1.6', checked: false },
            ],
        },
        {
            id: 'facebottom',
            name: 'face bottom',
            options: [
                { value: '2.1', label: '2.1', checked: false },
                { value: '2.2', label: '2.2', checked: false },
                { value: '2.3', label: '2.3', checked: true },
                { value: '2.4', label: '2.4', checked: false },
                { value: '2.5', label: '2.5', checked: false },
                { value: '2.6', label: '2.6', checked: false },
            ],
        },
        {
            id: 'clothing',
            name: 'clothing',
            options: [
                { value: '3.1', label: '3.1', checked: false },
                { value: '3.2', label: '3.2', checked: false },
                { value: '3.3', label: '3.3', checked: true },
                { value: '3.4', label: '3.4', checked: false },
                { value: '3.5', label: '3.5', checked: false },
                { value: '3.6', label: '3.6', checked: false },
                { value: '3.7', label: '3.7', checked: false },
                { value: '3.9', label: '3.9', checked: false }
            ],
        },
        {
            id: 'situation',
            name: 'situation',
            options: [
                { value: '5.1', label: '5.1', checked: false },
                { value: '5.2', label: '5.2', checked: false },
                { value: '5.3', label: '5.3', checked: true },
                { value: '5.4', label: '5.4', checked: false },
                { value: '5.5', label: '5.5', checked: false },
                { value: '5.6', label: '5.6', checked: false },
                { value: '5.7', label: '5.7', checked: false },
                { value: '5.8', label: '5.8', checked: false },
                { value: '5.9', label: '5.9', checked: false },
                { value: '5.11', label: '5.11', checked: false },
                { value: '5.13', label: '5.13', checked: false },
            ],
        },
        {
            id: 'location',
            name: 'location',
            options: [
                { value: '6.1', label: '6.1', checked: false },
                { value: '6.2', label: '6.2', checked: false },
                { value: '6.3', label: '6.3', checked: true },
                { value: '6.4', label: '6.4', checked: false },
                { value: '6.5', label: '6.5', checked: false },
                { value: '6.6', label: '6.6', checked: false },
                { value: '6.7', label: '6.7', checked: false }
            ],
        }
      ]

    return(
        <form className="hidden lg:block">
        {filters.map((section) => (
          <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
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
                    {section.options.map((option, optionIdx) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 "
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-3 text-sm text-sgbodycopy"
                        >
                          {option.label}
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
    const [isOpen,toggleIsOpen]= useState(false);

    return(
    <div className="w-full flex-col justify-start items-center pt-[20px] pb-[0px]">

            <div className="flex flex-row items-center justify-center cursor-pointer">
                <div className={isOpen?"transition-all ease-in-out w-[12px] h-[12px] rotate-90 mr-2":" transition-all ease-in-outw-[9px] h-[12px] rotate-0  mr-2"}>
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 4.73333L1 9" stroke="#59342B"/>
                    </svg>
                </div>
                <p className="text-[16px] leading-[20px] underline" onClick={() => toggleIsOpen(!isOpen)}>filter & sort</p>
            </div>
            <div className={isOpen?"block mt-[30px] lg:mt-[10px] lg:mb-[0px]":"hidden"}>
            {/* <FilterCollapser title="characters" options={["Monk","Warrior Princess"]} /> */}
            <FilterRadioGroup />
            </div>







    </div>
    )
}