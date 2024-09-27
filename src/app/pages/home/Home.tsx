"use client";

import styles from "./Home.module.scss";
import { Path } from "@/app/constants";
import { useAccessStore } from "@/app/stores/access";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import dynamic from "next/dynamic";
import Pools from "../pools/Pools";

const Auth = dynamic(async () => (await import("../auth/Auth")).Auth);
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
        <>
          {/* 工具菜单 */}
          {/* <Sidebar /> */}

          {/* 路由地址 */}
          <div className={styles["window-content"]}>
            <Routes>
              <Route path={Path.Home} element={<Pools />} />
            </Routes>
          </div>
        </>
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
