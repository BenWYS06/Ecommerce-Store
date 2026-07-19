import { useEffect, useMemo, useState } from "react";
import { Alert, Box, CircularProgress, useTheme } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { tokens } from "../../theme";
import axios from "../../../lib/axios";

const Line = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dailyPerformance, setDailyPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchRevenueTrend = async () => {
      try {
        const response = await axios.get("/analytics?range=90d");

        if (isActive) {
          setDailyPerformance(response.data.dailyPerformance || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load revenue trend.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchRevenueTrend();

    return () => {
      isActive = false;
    };
  }, []);

  const chartData = useMemo(
    () => [
      {
        id: "Revenue",
        color: colors.greenAccent[500],
        data: dailyPerformance.map((item) => ({
          x: item.date,
          y: item.revenue || 0,
        })),
      },
    ],
    [colors.greenAccent, dailyPerformance],
  );

  const xTickValues = useMemo(() => {
    const dates = dailyPerformance.map((item) => item.date);
    const step = Math.max(1, Math.ceil(dates.length / 8));

    return dates.filter((_, index) => index % step === 0);
  }, [dailyPerformance]);

  return (
    <Box m="20px">
      <Header
        title="REVENUE TREND"
        subtitle="Daily revenue during the last 90 days"
      />

      {isLoading ? (
        <Box height="60vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box height="70vh">
          <LineChart
            data={chartData}
            xTickValues={xTickValues}
            xAxisLegend="Date"
            yAxisLegend="Revenue"
          />
        </Box>
      )}
    </Box>
  );
};

export default Line;
