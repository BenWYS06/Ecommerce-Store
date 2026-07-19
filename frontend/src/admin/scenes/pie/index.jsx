import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import axios from "../../../lib/axios";

const Pie = () => {
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchOrderStatuses = async () => {
      try {
        const response = await axios.get("/analytics?range=90d");

        if (isActive) {
          setOrderStatuses(response.data.orderStatusBreakdown || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load order statuses.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchOrderStatuses();

    return () => {
      isActive = false;
    };
  }, []);

  const chartData = useMemo(
    () =>
      orderStatuses
        .filter((item) => item.count > 0)
        .map((item) => ({
          id: item.status,
          label: item.status,
          value: item.count,
        })),
    [orderStatuses],
  );

  return (
    <Box m="20px">
      <Header
        title="ORDER STATUS"
        subtitle="Distribution of orders by fulfillment status"
      />

      {isLoading ? (
        <Box height="60vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : chartData.length === 0 ? (
        <Typography>No order status data available.</Typography>
      ) : (
        <Box height="70vh">
          <PieChart data={chartData} />
        </Box>
      )}
    </Box>
  );
};

export default Pie;
