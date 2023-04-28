// import pricecurve from "../../pricecurve-droids.json";
// import { Fragment, useRef, useState, useEffect } from 'react'
// import { Dialog, Transition } from '@headlessui/react'
// import { useCurveMinterIndex } from '../../hooks/read/useCurveMinterIndex';
// import { utils, ethers, BigNumber } from "ethers";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import annotationPlugin from 'chartjs-plugin-annotation';
// import { Line } from 'react-chartjs-2';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     annotationPlugin
// );
// export const PriceCurve = ({ onClose }: { onClose: () => void }) => {


//     const { data: index, isError, isLoading } = useCurveMinterIndex();

//     if (!index) return null;

//     const pricecurveSlice = pricecurve; //.slice(0,100);


//     const data = {
//         labels: pricecurveSlice.map((cur, index) => { return index + 1 }),
//         datasets: [
//             {
//                 label: 'Skygazers Price Curve',
//                 fill: false,
//                 lineTension: 0.1,
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//                 borderCapStyle: 'butt',
//                 borderDash: [],
//                 borderDashOffset: 0.0,
//                 borderJoinStyle: 'miter',
//                 pointBorderColor: 'rgba(75,192,192,1)',
//                 pointBackgroundColor: '#fff',
//                 pointBorderWidth: 1,
//                 pointHoverRadius: 5,
//                 pointHoverBackgroundColor: 'rgba(75,192,192,1)',
//                 pointHoverBorderColor: 'rgba(220,220,220,1)',
//                 pointHoverBorderWidth: 2,
//                 pointRadius: 1,
//                 pointHitRadius: 10,
//                 data: pricecurveSlice.map((cur, index) => {
//                     const data = parseFloat(utils.formatEther(ethers.BigNumber.from(cur)));
//                     return data;
//                 })
//             }
//         ]
//     };
//     const options = {
//         plugins: {
//             annotation: {
//                 annotations: {
//                     line1: {
//                         type: 'line',
//                         xMin: index,
//                         xMax: index,
//                         borderColor: 'rgb(255, 99, 132)',
//                         borderWidth: 2,
//                     }
//                 }
//             }
//         }
//     };
//     // console.log(JSON.stringify(data, 0, 2));

//     const cancelButtonRef = useRef(null)
//     return (
//         <Transition.Root show={true} as={Fragment} >
//             <Dialog as="div" className="relative z-[9999]" initialFocus={cancelButtonRef} onClose={onClose}>
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
//                 </Transition.Child>

//                 <div className="fixed inset-0 z-10 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                             enterTo="opacity-100 translate-y-0 sm:scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                             leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                         >
//                             <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
//                                 onClick={() => { onClose(); }}>
//                                 <Line
//                                     data={data}
//                                     options={options}
//                                 // width={2000}
//                                 // height={1000}
//                                 // options={{
//                                 //     maintainAspectRatio: false
//                                 // }}
//                                 />
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition.Root>
//     )
// }