import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

// const LineChart = ({ label, data }) => {
//   const state = useMemo(() => {
//     return {
//       series: data,
//       options: {
//         labels: label,
//         responsive: [
//           {
//             breakpoint: 900,
//             options: {
//               chart: {
//                 width: "100%",
//               },
//               legend: {
//                 position: "bottom",
//               },
//             },
//           },
//         ],
//       },
//     };
//   }, [label, data]);

//   return (
//     <div className="chart-wrapper">
//       <h4>Balance Chart</h4>
//       <ReactApexChart
//         options={state.options}
//         series={state.series}
//         type="pie"
//       />
//     </div>
//   );
// };

// export default LineChart;

const LineChart2 = ({ chartTitle, studentData }) => {
  // Dummy data for percentage score from week 1 to week 10
  const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75]; // Example scores, you can replace it with actual data

  // Labels for x-axis (weeks)
  const labels = Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`);

  // Memoized state to prevent unnecessary re-renders
  const state = useMemo(() => {
    const series = studentData.map((student) => ({
      name: student.name,
      data: student.scores,
    }));

    return {
      series: series,
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
        // title: {
        //   text: 'Students Score Over Weeks',
        //   align: 'left'
        // },
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
  }, [studentData, labels]);

  return (
    <div className='chart-wrapper'>
      <h4 className='fs-2 w-100 text-center'>{chartTitle}</h4>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type='line'
        height={350}
      />
    </div>
  );
};

export default LineChart2;
