import { useEffect, useState } from "react";
import { Alert, Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Header from "../../components/Header";
import axios from "../../../lib/axios";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const formatJoinedDate = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : dateFormatter.format(date);
};

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");

        if (isActive) {
          setUsers(response.data.users || []);
          setError("");
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message || "Unable to load users.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const rows = users.map((user, index) => ({
    id: user._id,
    rowNumber: index + 1,
    name: user.name,
    phone: user.phone || "Not provided",
    email: user.email,
    provider: user.provider || "local",
    role: user.role,
    createdAt: user.createdAt,
  }));

  const columns = [
    { field: "rowNumber", headerName: "ID", width: 80 },
    {
      field: "name",
      headerName: "Name",
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
      field: "provider",
      headerName: "Provider",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Joined",
      flex: 1,
      renderCell: ({ row }) => formatJoinedDate(row.createdAt),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              role === "admin" ? colors.greenAccent[600] : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {role === "admin" ? (
              <AdminPanelSettingsOutlinedIcon />
            ) : (
              <LockOpenOutlinedIcon />
            )}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Managing registered users" />
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

export default Users;
