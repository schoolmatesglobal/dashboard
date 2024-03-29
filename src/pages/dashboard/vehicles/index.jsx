import React from "react";
import { useNavigate } from "react-router-dom";
import PageView from "../../../components/views/table-view";
import { useVehicles } from "../../../hooks/useVehicles";

const Vehicles = () => {
  const {
    isLoading,
    indexStatus,
    setIndexStatus,
    vehiclesList,
    vehicleLogsList,
    handleDeleteVehicle,
    permission,
    assignedBusList,
    allAssignedBusList,
    user,
  } = useVehicles();

  const navigate = useNavigate();

  const dataMapper = {
    all: {
      columns: [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Vehicle Number",
          accessor: "number",
        },
        {
          Header: "Driver",
          accessor: "drivername",
        },
        {
          Header: "Type",
          accessor: "type",
        },
        {
          Header: "Make",
          accessor: "make",
        },
      ],
      data: vehiclesList,
    },
    logs: {
      columns: [
        {
          Header: "id",
          accessor: "id",
        },
        {
          Header: "Vehicle Number",
          accessor: "vehicle_number",
        },
        {
          Header: "Driver",
          accessor: "driver_name",
        },
        {
          Header: "Mechanic Condition",
          accessor: "mechanic_condition",
        },
        {
          Header: "Purpose",
          accessor: "purpose",
        },
        {
          Header: "Route",
          accessor: "route",
        },
        {
          Header: "Date Out",
          accessor: "date_out",
        },
        {
          Header: "Time Out",
          accessor: "time_out",
        },
        {
          Header: "Add Info",
          accessor: "add_info",
        },
      ],
      data: vehicleLogsList,
    },
    assignedBus: {
      columns: [
        {
          Header: "School Id",
          accessor: "sch_id",
        },
        {
          Header: "School",
          accessor: "campus",
        },
        {
          Header: "Term",
          accessor: "term",
        },
        {
          Header: "Session",
          accessor: "session",
        },
        {
          Header: "Admission Number",
          accessor: "admission_number",
        },
        {
          Header: "Bus Type",
          accessor: "bus_type",
        },
        {
          Header: "Bus Number",
          accessor: "bus_number",
        },
        {
          Header: "Driver's Name",
          accessor: "driver_name",
        },
        {
          Header: "Driver's Phone Number",
          accessor: "driver_phonenumber",
        },
        {
          Header: "Driver's Profile Image",
          accessor: "driver_image",
        },
        {
          Header: "Conductor's Name",
          accessor: "conductor_name",
        },
        {
          Header: "Conductor's Phone Number",
          accessor: "conductor_phonenumber",
        },
        {
          Header: "Conductor's Profile Image",
          accessor: "conductor_image",
        },
        {
          Header: "ways",
          accessor: "ways",
        },
        {
          Header: "route",
          accessor: "route",
        },
        {
          Header: "Pick Up Time",
          accessor: "pickup_time",
        },
        {
          Header: "Drop Off Time",
          accessor: "dropoff_time",
        },
      ],
      data: user?.designation_name === "Admin" ? allAssignedBusList : assignedBusList,
    },
  };

  const getSortButtonOptions = () => {
    let arr = [];

    if (permission?.read) {
      arr.push({
        title: "All",
        type: "button",
        variant: indexStatus !== "all" ? "outline" : null,
        onClick: () => setIndexStatus("all"),
      });
    }
    if (permission?.readLogs) {
      arr.push({
        title: "Logs",
        type: "button",
        variant: indexStatus !== "logs" ? "outline" : null,
        onClick: () => setIndexStatus("logs"),
      });
    }
    if (permission?.assignedBus || permission?.allAssignedBus) {
      arr.push({
        title: "Assigned Bus",
        type: "button",
        variant: indexStatus !== "assignedBus" ? "outline" : null,
        onClick: () => setIndexStatus("assignedBus"),
      });
    }

    return arr.length ? arr : undefined;
  };

  const getActionOptions = () => {
    const arr = [];

    if (permission?.maintenance) {
      arr.push({
        title: "Add Maintenance",
        onClick: (id) => navigate(`/app/vehicles/maintenance/${id}`),
      });
    }

    return arr.length ? arr : undefined;
  };

  return (
    <PageView
      hasSortOptions={permission?.sort}
      rowHasDelete={permission?.delete && indexStatus === "all"}
      canCreate={permission?.create}
      rowHasUpdate={permission?.update && indexStatus === "all"}
      onDelete={handleDeleteVehicle}
      isLoading={isLoading}
      action={getActionOptions()}
      rowHasAction={permission?.action && indexStatus === "all"}
      groupedButtonOptions={getSortButtonOptions()}
      columns={dataMapper[indexStatus].columns}
      data={dataMapper[indexStatus].data}
    />
  );
};

export default Vehicles;
