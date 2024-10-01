import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Button, Snackbar, Alert, Dialog, TextField } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThreadPoolEntity } from "@/types/thread_pool";
import { queryThreadPoolList, updateThreadPoolConfig } from "@/apis/index";
import styles from "./Pools.module.scss";

// 定义表格列
interface Column {
  id: keyof ThreadPoolEntity | "operation";
  label: string;
  minWidth?: number;
  align?: "center";
}

const columns: readonly Column[] = [
  { id: "appName", label: "应用名称", minWidth: 100 ,align: "center" },
  { id: "threadPoolName", label: "线程池名称", minWidth: 100 ,align: "center" },
  { id: "corePoolSize", label: "核心线程池数", minWidth: 100, align: "center" },
  { id: "maximumPoolSize", label: "最大线程数", minWidth: 100, align: "center" },
  { id: "activeCount", label: "当前活跃线程数", minWidth: 100, align: "center" },
  { id: "poolSize", label: "当前池中线程数", minWidth: 100, align: "center" },
  { id: "queueType", label: "队列类型", minWidth: 100, align: "center"},
  { id: "queueSize", label: "当前队列任务数", minWidth: 100, align: "center" },
  { id: "remainingCapacity", label: "队列剩余容量数", minWidth: 100, align: "center" },
  { id: "operation", label: "操作", minWidth: 100, align: "center"  },
];

export function Pools() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThreadPoolEntity[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<ThreadPoolEntity | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "info" | "warning" | "error">("success");

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [autoRefresh]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await queryThreadPoolList();
      const result = await response.json();
      if (result.code === "0000") {
        setData(result.data);
      } else {
        console.error("数据获取失败:", result.info);
      }
    } catch (error) {
      console.error("请求失败:", error);
    }
    setLoading(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (pool: ThreadPoolEntity) => {
    setSelectedPool(pool);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedPool(null), 150);
  };

  const handleSave = async () => {
    if (selectedPool) {
      try {
        const code = await updateThreadPoolConfig(selectedPool);
        setSnackbarMessage(code === "0000" ? "保存成功" : "保存失败");
        setSnackbarSeverity(code === "0000" ? "success" : "error");
        setOpenSnackbar(true);
        setOpen(false);
        setTimeout(() => setSelectedPool(null), 150);
      } catch (error) {
        setSnackbarMessage(`保存失败: ${error instanceof Error ? error.message : "未知错误"}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPool) {
      setSelectedPool({
        ...selectedPool,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color={autoRefresh ? "secondary" : "primary"} onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? "停止刷新" : "自动刷新"}
          </Button>
        </Grid>
        <Grid className={styles["table-grid"]} item xs={12}>
          {loading ? <CircularProgress /> : (
            <Paper sx={{ width: "100%", overflow: "hidaden" }}>
              <TableContainer className={styles["table-container"]} sx={{ maxHeight: 440 ,overflow: "auto"}}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.threadPoolName}>
                        {columns.map((column) => {
                          const value = row[column.id as keyof ThreadPoolEntity];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.id === "operation" ? (
                                <Button variant="contained" color="primary" onClick={() => handleClickOpen(row)}>
                                  修改
                                </Button>
                              ) : (
                                value
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>修改线程池参数</DialogTitle>
        <DialogContent>
          <DialogContentText>修改以下参数，然后点击保存按钮进行保存。</DialogContentText>
          {selectedPool && (
            <>
              <TextField disabled margin="dense" label="应用名称" name="appName" value={selectedPool.appName} fullWidth />
              <TextField disabled margin="dense" label="线程池名称" name="threadPoolName" value={selectedPool.threadPoolName} fullWidth />
              <TextField margin="dense" label="核心线程池数" name="corePoolSize" value={selectedPool.corePoolSize} onChange={handleChange} fullWidth />
              <TextField margin="dense" label="最大线程数" name="maximumPoolSize" value={selectedPool.maximumPoolSize} onChange={handleChange} fullWidth />
              <TextField disabled margin="dense" label="活跃线程数" name="activeCount" value={selectedPool.activeCount} fullWidth />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Pools;
