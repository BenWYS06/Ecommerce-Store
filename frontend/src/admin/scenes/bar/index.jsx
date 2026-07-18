import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import axios from "../../../lib/axios";

const Bar = () => {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchSalesByCategory = async () => {
      try {
        const response = await axios.get("/analytics?range=90d");

        if (isActive) {
          setSalesByCategory(response.data.salesByCategory || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load sales by category.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchSalesByCategory();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Box m="20px">
      <Header
        title="SALES BY CATEGORY"
        subtitle="Units sold by product category"
      />

      {isLoading ? (
        <Box height="60vh" display="flex" alignItems="center" justifyContent="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box height="70vh">
          <BarChart
            data={salesByCategory}
            keys={["quantity"]}
            indexBy="category"
            axisBottomLegend="Product category"
            axisLeftLegend="Units sold"
          />
        </Box>
      )}
    </Box>
  );
};

export default Bar;
