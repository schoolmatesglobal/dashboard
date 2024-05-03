import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// const data = [
//   {
//     Name: "Ajayi Kike",
//     Score: 50,
//     ActualScore: "4/8",
//     Time: 20,
//   },
//   {
//     Name: "Njoku Alex",
//     Score: 75,
//     ActualScore: "5/8",
//     Time: 10,
//   },
//   {
//     Name: "Lucky Daniel",
//     Score: 77,
//     ActualScore: "4.2/8",
//     Time: 35,
//   },
//   {
//     Name: "Mike Josh",
//     Score: 90,
//     ActualScore: "7/8",
//     Time: 15,
//   },
//   {
//     Name: "Lukaku Romelu",
//     Score: 23,
//     ActualScore: "2/8",
//     Time: 45,
//   },
//   {
//     Name: "Adamma Adam",
//     Score: 47,
//     ActualScore: "3/8",
//     Time: 30,
//   },
//   {
//     Name: "Jobs Steven",
//     Score: 68,
//     ActualScore: "5/8",
//     Time: 34,
//   },
// ];

const BarCharts = ({
  chartTitle,
  studentData,
  studentNames,
  value,
  colour,
  unit,
  data
}) => {
  // Dummy data for percentage score from week 1 to week 10
  // const data = [65, 70, 68, 72, 75, 80, 85, 82, 78, 75]; // Example scores, you can replace it with actual data

  // Labels for x-axis (weeks)
  const labels = Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`);

  function getIntroOfPage(label) {
    if (label === "Page A") {
      return `Page A is about men's clothing`;
    }
    if (label === "Page B") {
      return `Page B is about women's dress`;
    }
    if (label === "Page C") {
      return `Page C is about women's bag`;
    }
    if (label === "Page D") {
      return `Page D is about household goods`;
    }
    if (label === "Page E") {
      return `Page E is about food`;
    }
    if (label === "Page F") {
      return `Page F is about baby food`;
    }
  }

  function CustomTooltip({ payload, label, active }) {
    // console.log({ payload });
    if (active) {
      return (
        <div style={{ background: "white", padding: "10px" }}>
          <p className='mb-3 fw-bold fs-3'>{`${label}`}</p>
          <p className='mb-1  fs-3'>{`${value} : ${payload[0].value} ${unit}`}</p>
          {value === "Score" && (
            <p className='mb-0 fs-3'>{`Actual Score : ${payload[0]?.payload?.ActualScore} `}</p>
          )}
          {/* <p className="intro">{getIntroOfPage(label)}</p> */}
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }

    return null;
  }

  // Memoized state to prevent unnecessary re-renders
  const state = useMemo(() => {
    const series = studentData?.map((student) => ({
      Name: student.Name,
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
        title: {
          text: chartTitle,
          align: "center",
        },
        xaxis: {
          title: {
            text: "Score",
          },
          categories: studentNames,
          // categories: labels,
        },
        // title: {
        //   text: 'Students Score Over Weeks',
        //   align: 'left'
        // },
        yaxis: {
          title: {
            text: "Score",
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

  // console.log({ value, colour });

  return (
    // <div className='chart-wrapper'>
    <div className='w-100 h-100 d-flex justify-content-center align-items-center '>
      {/* <h4 className='fs-2 w-100 text-center'>{chartTitle}</h4> */}
      {/* <ResponsiveContainer width='100%' height='100%'> */}
      <BarChart
        width={850}
        height={350}
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        style={{ width: "100%", padding: "0 10px" }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='Name' />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          width={100}
          wrapperStyle={{
            bottom: 0,
            right: 0,
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
          }}
        />
        <Bar dataKey={value} fill={colour} />
        {/* <Bar dataKey={dataKey} fill='#82ca9d' /> */}
      </BarChart>
      {/* </ResponsiveContainer> */}
    </div>
  );
};

export default BarCharts;
