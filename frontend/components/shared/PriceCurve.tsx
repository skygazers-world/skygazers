import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import Annotation from "chartjs-plugin-annotation";
import pricecurveDroids from "../../pricecurve-droids.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  // Annotation,
  Title,
  Tooltip,
  Legend,
);

export const PriceCurve = (
  { start = 0, end = pricecurveDroids.length, current }:
    { start: number, end: number, current: number }) => {

  const safeStart = start < 0 ? 0 : start > pricecurveDroids.length ? pricecurveDroids.length - 1 : start;
  const safeEnd = end < safeStart ? safeStart : end > pricecurveDroids.length ? pricecurveDroids.length - 1 : end;
  const dataset = pricecurveDroids.slice(safeStart, safeEnd);
  const datasetSold = pricecurveDroids.slice(safeStart, current);

  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };

  // // annotations plugin is broken ??
  // if (current >= safeStart && current <= safeEnd) {
  //   options.plugins["annotation"] = {
  //     annotations: {
  //       annotation3: {
  //         type: 'line',
  //         borderColor: 'rgba(102, 102, 102, 0.5)',
  //         borderDash: [6, 6],
  //         borderDashOffset: 0,
  //         borderWidth: 3,
  //         scaleID: 'x',
  //         value: current,
  //         label: {
  //           display: true,
  //           backgroundColor: 'rgb(100, 149, 237)',
  //           content: (ctx) => ['Current','Minting price',`${pricecurveDroids[current]} ETH`]
  //         },
  //       }
  //     }
  //   }
  // }

  const data = {
    labels: pricecurveDroids.slice(safeStart, safeEnd).map((_, i) => i),
    datasets: [
      {
        label: 'NFT mint price',
        data: dataset,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        order:2
      },
      {
        label: 'NFT mint position',
        data: datasetSold,
        borderColor: 'rgb(0, 99, 132)',
        backgroundColor: 'rgba(0, 99, 132, 0.5)',
        order:1
      }

    ],
  };


  return (
    <Line options={options} data={data} />
  );

};