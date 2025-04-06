import React from 'react'
import { Doughnut } from 'react-chartjs-2';

function BarDought({data,titleLabel}) {
    const filterLabel = data.map(dat => dat.label);
    const filterData = data.map(dat => dat.data);
    const dataBar = {
        labels: filterLabel,
        datasets: [
          {
            data: filterData,
            backgroundColor: ['#018000',"#FFEB45","#45EEFF","#4583FF","#FF5E45"],
            borderColor: ['#018000',"#FFEB45","#45EEFF","#4583FF","#FF5E45"],
            borderWidth: 1,
            barThickness: 40
          },
        ],
      };
      const options = {
        responsive: true,
        cutout:"70%"
      };
    
      return (
        <>
            <h2 className='text-green-500 font-bold'>{titleLabel}</h2>
            <div className='m-auto' style={{ width: '350px', height: '350px' }}>
            <Doughnut data={dataBar} options={options} />
            </div>
        </>
    );
}

export default BarDought