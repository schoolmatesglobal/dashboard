import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";


const LineChart = ({ chartTitle, data }) => {
  // Dummy data for percentage score from week 1 to week 10
 // Example scores, you can replace it with actual data

  // Labels for x-axis (weeks)
  const labels = Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`);

  // Memoized state to prevent unnecessary re-renders
  const state = useMemo(() => {
    return {
      series: [
        {
          name: "Score",
          data: data,
        },
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: labels,
        },
        title: {
          text: chartTitle,
          align: "center",
        },
        yaxis: {
          title: {
            text: "Percentage Score",
          },
          labels: {
            formatter: function (value) {
              return value + "%";
            },
          },
        },
      },
    };
  }, [data, labels]);

  return (
    <div className='chart-wrapper'>
      {/* <h4 className='fs-2 w-100 text-center'>{chartTitle}</h4> */}
      <ReactApexChart
        options={state.options}
        series={state.series}
        type='line'
        height={350}
      />
    </div>
  );
};

export default LineChart;
