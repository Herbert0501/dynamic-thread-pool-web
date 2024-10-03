import React, { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { queryGrafanaUrl } from "@/apis";
import { useAccessStore } from "@/app/stores/access";

export function Monitor() {
  const [grafanaUrl, setGrafanaUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 定义异步函数以获取 Grafana URL
    const fetchGrafanaUrl = async () => {
      try {
        const result = await queryGrafanaUrl();

        // 判断返回结果是否成功
        if (result.code === "0000") {
          setGrafanaUrl(result.data); // 设置获取到的 Grafana URL
        } else if (result.code === "0003") {
          useAccessStore.getState().goToLogin();
        }else {
          setError(`操作失败: ${result.info || "未知错误"}`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`请求失败: ${err.message}`);
        } else {
          setError("请求失败，发生未知错误。");
        }
      }
    };

    fetchGrafanaUrl();
  }, []); // 空数组表示仅在组件挂载时运行

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : grafanaUrl ? (
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
        <Alert severity="warning">正在加载 Grafana URL...</Alert>
      )}
    </Box>
  );
}
