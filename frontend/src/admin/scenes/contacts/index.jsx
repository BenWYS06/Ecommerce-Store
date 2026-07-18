import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "../../../lib/axios";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrency = (value) =>
  currencyFormatter.format(Number.isFinite(Number(value)) ? Number(value) : 0);

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");

        if (isActive) {
          setProducts(response.data.products || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load products.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const rows = products.map((product, index) => ({
    id: product._id,
    rowNumber: index + 1,
    name: product.name,
    brand: product.brand || "No brand",
    category: product.category,
    price: product.price || 0,
    discountPrice: product.discountPrice || 0,
    stock: product.stock || 0,
    sold: product.sold || 0,
    rating: product.rating || 0,
    isFeatured: product.isFeatured ? "Yes" : "No",
    isPublished: product.isPublished ? "Published" : "Draft",
  }));

  const columns = [
    { field: "rowNumber", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: ({ row }) => formatCurrency(row.price),
    },
    {
      field: "discountPrice",
      headerName: "Sale Price",
      flex: 1,
      renderCell: ({ row }) =>
        row.discountPrice ? formatCurrency(row.discountPrice) : "No sale",
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 1,
    },
    {
      field: "sold",
      headerName: "Sold",
      type: "number",
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      flex: 1,
    },
    {
      field: "isFeatured",
      headerName: "Featured",
      flex: 1,
    },
    {
      field: "isPublished",
      headerName: "Status",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Product inventory overview" />
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Products;
