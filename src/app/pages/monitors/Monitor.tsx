import React from "react";
import { Box, Alert } from "@mui/material";
import { log } from "console";

// 从环境变量获取
export const grafanaUrl = process.env.GRAFANA_URL || "";
log(grafanaUrl);

export function Monitor() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      {grafanaUrl ? (
        <Box
          component="iframe"
          src={grafanaUrl}
          title="Grafana Panel"
          sx={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      ) : (
        <Alert severity="warning">
          Grafana URL为空，请检查配置！
        </Alert>
      )}
    </Box>
  );
}
