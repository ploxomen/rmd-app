import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

function BarLine({data,titleLabel}) {
    const filterLabel = data.map(dat => dat.labels);
    const filterData = data.map(dat => dat.data);
    const dataBar = {
        labels: filterLabel,
        datasets: [
          {
            label: titleLabel,
            data: filterData,
            backgroundColor: ['#018000'],
            borderColor: ["#018000"],
            borderWidth: 1,
            barThickness: 40
          },
        ],
      };
      const options = {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    
      return (
        <>
            <h2 className='text-green-500 font-bold'>{titleLabel}</h2>
          <Bar data={dataBar} options={options} />
        </>
    );
}

export default BarLine