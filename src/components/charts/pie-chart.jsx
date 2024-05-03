import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const PieCharts = ({ value, colour, unit, data, data2 }) => {
  // const data = [
  //   { name: "Correct Answers", Score: 5, total: 8 },
  //   { name: "Incorrect Answers", Score: 2, total: 8 },
  //   { name: "Unattempted Questions", Score: 1, total: 8 },
  //   // { name: "Group D", Score: 200 },
  // ];

  // const data2 = [
  //   { name: "Student Test Time", Score: 30, total: "1hr : 30mins" },
  //   { name: "Un-used Time", Score: 60, total: "1hr : 30mins" },
  //   // { name: "Unattempted Questions", Score: 1 },
  //   // { name: "Group D", Score: 200 },
  // ];

  const COLORS = ["#008707", "#b00000", "#FFBB28"];
  const COLORS2 = ["#008707", "#ffbb28"];

  const color = value === "Score" ? COLORS : COLORS2;

  function CustomTooltip({ payload, label, active }) {
    // console.log({ payload });
    if (active) {
      return (
        <div style={{ background: "white", padding: "10px" }}>
          <p className='mb-3 fw-bold fs-3'>{`${payload[0].name}`}</p>
          <p className='mb-2  fs-3'>{`${payload[0].name} : ${payload[0].value} ${unit}`}</p>
          {value === "Score" ? (
            <p className='mb-0 fs-3'>{`Total Questions : ${payload[0]?.payload?.total} `}</p>
          ) : (
            <p className='mb-0 fs-3'>{`Total Test Time : ${payload[0]?.payload?.total} `}</p>
          )}
          {/* <p className="intro">{getIntroOfPage(label)}</p> */}
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }

    return null;
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline='central'
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className='w-100 h-100 d-flex justify-content-center align-items-center '>
      <PieChart
        width={300}
        height={300}
        style={{ width: "fit" }}
        // className='d-flex justify-content-center align-items-center w-100'
      >
        <Pie
          data={data}
          // data={value === "Score" ? data : data2}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill='#8884d8'
          dataKey='Score'
          className='mt-5'
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          // width={500}
          // className="w-100 "
          // style={{ width: "100%", padding: "0 10px" }}
          wrapperStyle={{
            bottom: -10,
            right: 0,
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
            padding: "0 10px",
            width: "100%",
          }}
        />
      </PieChart>
    </div>
  );
};

export default PieCharts;
