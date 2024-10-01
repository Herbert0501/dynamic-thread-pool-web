import React from "react";
import { Box, Alert } from "@mui/material";
import { grafanaUrl } from "@/app/constants";

// const grafanaUrl = "http://192.168.59.129:3000/d/cdvvy9felux34e/e58aa8-e68081-e7babf-e7a88b-e6b1a0-e79b91-e68ea7?orgId=2&refresh=5s&theme=light";

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
