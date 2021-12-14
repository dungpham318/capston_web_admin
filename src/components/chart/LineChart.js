import React from 'react'
import { Line } from 'react-chartjs-2'


const LineChart = (props) => {

  const data = {
    labels: props.label,
    datasets: props.datasets,
  }

  return (
    <>
      <Line
        data={data}
        options={{
          title: {
            display: props.displayTitle,
            text: props.title,
            fontSize: 20,
          },
          legend: {
            display: props.displayLegend,
            position: props.legendPosition,
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }} />
    </>
  )
}

LineChart.defaultProps = {
  displayLegend: true,
  legendPosition: "bottom",
  location: "City",
  borderColor: 'rgba(54, 162, 235, 1)'
}
export default LineChart
