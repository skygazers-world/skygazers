import { useEffect, useState,Fragment } from "react";
import {  Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { useCollectionFilter } from "hooks/useCollectionFilter";
import traits from "../../data/traits.json";
import { Dialog, Transition } from '@headlessui/react'


const FilterRadioGroup = () => {
  const filterMask = useCollectionFilter((state) => state.filter);
  const setFilterMask = useCollectionFilter((state) => state.setFilter);

  // const [renderedTraits,setRenderedTraits] = useState<object>();

  // const [ setFilterMaskRendered] = useState<number[]>();
  // useEffect(() => {
  //   setFilterMaskRendered(filterMask);
  //   // setRenderedTraits(traits.map((section)=>{
  //   //   section.items.map
  //   // }))
  // }, [filterMask])

  return (
    <form className="">
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

  let [isFilterOpen, setIsFilterOpen] = useState(false)
  const closeFilterModal = () => {
    setIsFilterOpen(false)
  }
  const openFilterModal = () => {
    setIsFilterOpen(true)
  }

  let [isInfoOpen, setIsInfoOpen] = useState(false)
  const closeInfoModal = () => {
    setIsInfoOpen(false)
  }
  const openInfoModal = () => {
    setIsInfoOpen(true) 
  }

  useEffect(() => {
    setInteractedWithFilter(true);
    toggleIsOpen(filterMask.length > 0 || interactedWithFilter)
  }, [filterMask])


  return (
    <>
    <Transition appear show={isFilterOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={closeFilterModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed h-[100vh] inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="p"
                  >
                    Filter collection on:
                  </Dialog.Title>
                  <FilterRadioGroup />
                  <div className="flex flex-row justify-end items-center">
                      <p className="text-[16px] leading-[20px] underline mt-3 text-sgorange" onClick={() => closeFilterModal()}>close</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


      <Transition appear show={isInfoOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={closeInfoModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed h-[100vh] inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="p"
                  >
                    About collection:
                  </Dialog.Title>
                  <p>next price stuff here</p>
                  <div className="flex flex-row justify-end items-center">
                      <p className="text-[16px] leading-[20px] underline mt-3 text-sgorange" onClick={() => closeInfoModal()}>close</p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


    <div className="md:w-full flex-row md:flex-col justify-start items-center pt-[20px] pb-[0px]">
      {/* MOBILE HERE */}
      <div className="flex md:hidden  flex-row justify-center ml-[10px]">
        <div onClick={() => openFilterModal()} className="flex flex-row justify-center w-[30px] h-[20px] mx-[5px] hover:cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="#59342B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </div>
        <div onClick={() => openInfoModal()}className="flex flex-row justify-center w-[30px] h-[20px] mx-[5px] hover:cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="#59342B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
      </div>

      {/* DESKTOP HERE */}
      <div className="hidden md:block">
      <div className="md:flex flex-row items-center justify-center cursor-pointer">
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
    </div>
    </>
  )
}