import { useEffect, useState } from "react";
import { Alert, Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "../../../lib/axios";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatCurrency = (value) =>
  currencyFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);

const formatDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : dateFormatter.format(date);
};

const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/orders");

        if (isActive) {
          setOrders(response.data.orders || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message || "Unable to load orders.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isActive = false;
    };
  }, []);

  const rows = orders.map((order, index) => ({
    id: order._id,
    rowNumber: index + 1,
    customerName: order.user?.name || "Unknown customer",
    phone: order.user?.phone || order.shippingAddress?.phone || "Not provided",
    email: order.user?.email || "Not provided",
    items: order.products?.reduce(
      (total, product) => total + (product.quantity || 0),
      0,
    ),
    totalAmount: order.totalAmount || 0,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
  }));

  const columns = [
    { field: "rowNumber", headerName: "ID", width: 80 },
    {
      field: "customerName",
      headerName: "Customer",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "items",
      headerName: "Items",
      type: "number",
      flex: 0.5,
    },
    {
      field: "totalAmount",
      headerName: "Total",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {formatCurrency(params.row.totalAmount)}
        </Typography>
      ),
    },
    {
      field: "paymentMethod",
      headerName: "Payment",
      flex: 1,
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      renderCell: ({ row }) => formatDate(row.createdAt),
    },
  ];

  return (
    <Box m="20px">
      <Header title="ORDERS" subtitle="Managing customer orders" />
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Orders;
