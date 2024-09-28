"use client";

// import styles from "./Home.module.scss";
import { Path } from "@/app/constants";
import { useAccessStore } from "@/app/stores/access";
import { Sidebar } from "@/app/components/sidebar/Sidebar";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const Welcome = dynamic(async () => (await import("../welcome/Welcome")).Welcome);
const Auth = dynamic(async () => (await import("../auth/Auth")).Auth);
const Pools = dynamic(async () => (await import("../pools/Pools")).Pools);
function Screen() {
  const access = useAccessStore();
  const location = useLocation();
  const isAuthPath = location.pathname === "/auth";
  const isAuthorized = access.isAuthorized();
  
  return (
    <div>
      {isAuthPath || !isAuthorized ? (
        <Auth />
      ) : (
        <Box sx={{ display: "flex" }}>
          {/* 工具菜单 */}
          <Sidebar />

          {/* 路由地址 */}
          <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "3.65rem" }}>
            <Routes>
              <Route path={Path.Home} element={<Welcome />} />
              <Route path={Path.Pools} element={<Pools />}></Route>
            </Routes>
          </Box>
        </Box>
      )}
    </div>
  );
}

export function Home() {
  return (
    <Router>
      <Screen />
    </Router>
  );
}
