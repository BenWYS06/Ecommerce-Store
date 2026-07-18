import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import axios from "../../../lib/axios";

const EMPTY_DASHBOARD = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  },
  dailyPerformance: [],
  recentOrders: [],
  orderStatusBreakdown: [],
  salesByCategory: [],
  paymentMethodBreakdown: [],
  fulfillmentRate: 0,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD); // prevent crashed when haven't load data yet
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchDashboard = async () => {
      try {
        const response = await axios.get("/analytics?range=90d");

        if (isActive) {
          setDashboard({ ...EMPTY_DASHBOARD, ...response.data }); // this combine both field to prevent if res missing some field , that empty state will be used
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load dashboard data.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const lineChartData = useMemo(
    () => [
      {
        id: "Revenue",
        color: colors.greenAccent[500],
        data: dashboard.dailyPerformance.map((item) => ({
          x: item.date,
          y: item.revenue || 0,
        })),
      },
      {
        id: "Orders",
        color: colors.blueAccent[400],
        data: dashboard.dailyPerformance.map((item) => ({
          x: item.date,
          y: item.orders || 0,
        })),
      },
    ],
    [colors.blueAccent, colors.greenAccent, dashboard.dailyPerformance],
  );

  const lineChartTicks = useMemo(() => {
    const dates = dashboard.dailyPerformance.map((item) => item.date);
    const step = Math.max(1, Math.ceil(dates.length / 6));

    return dates.filter((_, index) => index % step === 0);
  }, [dashboard.dailyPerformance]);

  const paymentTotal = dashboard.paymentMethodBreakdown.reduce(
    (total, item) => total + (item.count || 0),
    0,
  );

  if (isLoading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="DASHBOARD" subtitle="Store overview" />
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const { summary } = dashboard;

  return (
    <Box m="20px">
      <Header title="DASHBOARD" subtitle="Store overview" />

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={currencyFormatter.format(summary.totalRevenue || 0)}
            subtitle="Total Revenue"
            icon={
              <AttachMoneyOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={(summary.totalOrders || 0).toLocaleString()}
            subtitle="Total Orders"
            icon={
              <ShoppingCartOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={(summary.totalCustomers || 0).toLocaleString()}
            subtitle="Total Customers"
            icon={
              <PeopleAltOutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={(summary.totalProducts || 0).toLocaleString()}
            subtitle="Total Products"
            icon={
              <Inventory2OutlinedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue and Orders
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {currencyFormatter.format(summary.totalRevenue || 0)}
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart
              data={lineChartData}
              isDashboard
              xTickValues={lineChartTicks}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Orders
            </Typography>
          </Box>
          {dashboard.recentOrders.length === 0 ? (
            <Typography color={colors.grey[300]} p="15px">
              No recent orders
            </Typography>
          ) : (
            dashboard.recentOrders.map((order) => (
              <Box
                key={order._id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap="12px"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box minWidth={0}>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    #{String(order._id).slice(-6).toUpperCase()}
                  </Typography>
                  <Typography color={colors.grey[100]} noWrap>
                    {order.customerName}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]} whiteSpace="nowrap">
                  {order.createdAt
                    ? dateFormatter.format(new Date(order.createdAt))
                    : "Unknown date"}
                </Box>
                <Box textAlign="right">
                  <Typography color={colors.grey[100]}>
                    {currencyFormatter.format(order.totalAmount || 0)}
                  </Typography>
                  <Typography color={colors.greenAccent[400]} variant="body2">
                    {order.orderStatus || "Unknown"}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Order Fulfillment
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle
              size="125"
              progress={dashboard.fulfillmentRate || 0}
            />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {Math.round((dashboard.fulfillmentRate || 0) * 100)}% delivered
            </Typography>
            <Typography color={colors.grey[300]}>
              Delivered orders out of all orders
            </Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Units Sold by Category
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart data={dashboard.salesByCategory} isDashboard />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" sx={{ mb: 3 }}>
            Payment Methods
          </Typography>
          {dashboard.paymentMethodBreakdown.map((item) => {
            const percentage =
              paymentTotal > 0 ? (item.count / paymentTotal) * 100 : 0;
            return (
              <Box key={item.method} mb="28px">
                <Box display="flex" justifyContent="space-between" mb="8px">
                  <Typography color={colors.grey[100]}>
                    {item.method}
                  </Typography>
                  <Typography color={colors.greenAccent[400]}>
                    {item.count || 0} ({Math.round(percentage)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  color="secondary"
                  sx={{ height: 8 }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
