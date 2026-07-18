import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import "@/admin/styles/index.css";

import { ColorModeContext, useMode } from "@/admin/theme";
import Sidebar from "@/admin/scenes/global/Sidebar";
import Topbar from "@/admin/scenes/global/Topbar";

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div className="app">
          <Sidebar isSidebar={isSidebar} />

          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />

            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;
