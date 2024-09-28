import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import {
  Snackbar,
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import styles from "./Pools.module.scss";
import { ThreadPoolEntity } from "@/types/thread_pool";
import { queryThreadPoolList, updateThreadPoolConfig } from "@/apis/index";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function Pools() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThreadPoolEntity[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<ThreadPoolEntity | null>(
    null
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 600);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
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

  const handleAutoRefresh = () => {
    setAutoRefresh(true);
  };

  const handleStopAutoRefresh = () => {
    setAutoRefresh(false);
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
        if (code === "0000") {
          setSnackbarMessage("保存成功");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("保存失败");
          setSnackbarSeverity("error");
          console.error("保存失败:", code);
        }
        setOpenSnackbar(true);
        setOpen(false);
        setTimeout(() => setSelectedPool(null), 150);
      } catch (error) {
        let errorMessage = "保存失败: ";
        if (error instanceof Error) {
          errorMessage += error.message;
        } else if (typeof error === "string") {
          errorMessage += error;
        } else {
          errorMessage += "未知错误";
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("保存失败:", error);
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

  const renderTable = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>应用名称</StyledTableCell>
            <StyledTableCell className={styles.common}>
              线程池名称
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              核心线程池数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              最大线程数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              当前活跃线程数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              当前池中线程数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              队列类型
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              当前队列任务数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>
              队列剩余容量数
            </StyledTableCell>
            <StyledTableCell className={styles.common}>操作</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {item.appName}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.threadPoolName}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.corePoolSize}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.maximumPoolSize}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.activeCount}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.poolSize}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.queueType}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.queueSize}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                {item.remainingCapacity}
              </StyledTableCell>
              <StyledTableCell className={styles.common}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleClickOpen(item)}
                >
                  修改
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCards = () => (
    <Grid container spacing={2}>
      {data.map((item, index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.appName}</Typography>
              <Typography color="textSecondary">
                线程池名称: {item.threadPoolName}
              </Typography>
              <Typography color="textSecondary">
                核心线程池数: {item.corePoolSize}
              </Typography>
              <Typography color="textSecondary">
                最大线程数: {item.maximumPoolSize}
              </Typography>
              <Typography color="textSecondary">
                当前活跃线程数: {item.activeCount}
              </Typography>
              <Typography color="textSecondary">
                当前池中线程数: {item.poolSize}
              </Typography>
              <Typography color="textSecondary">
                队列类型: {item.queueType}
              </Typography>
              <Typography color="textSecondary">
                当前队列任务数: {item.queueSize}
              </Typography>
              <Typography color="textSecondary">
                队列剩余容量数: {item.remainingCapacity}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: "1rem" }}
                onClick={() => handleClickOpen(item)}
              >
                修改
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box className={styles["pools-container"]} sx={{ p: 2}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {autoRefresh ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStopAutoRefresh}
            >
              停止刷新
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAutoRefresh}
            >
              自动刷新
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : isMobileView ? (
            renderCards()
          ) : (
            renderTable()
          )}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>修改线程池参数</DialogTitle>
        <DialogContent>
          <DialogContentText>
            修改以下参数，然后点击保存按钮进行保存。
          </DialogContentText>
          {selectedPool && (
            <>
              <TextField
                disabled
                margin="dense"
                label="应用名称"
                name="appName"
                value={selectedPool.appName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                disabled
                margin="dense"
                label="线程池名称"
                name="threadPoolName"
                value={selectedPool.threadPoolName}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="核心线程池数"
                name="corePoolSize"
                value={selectedPool.corePoolSize}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                margin="dense"
                label="最大线程数"
                name="maximumPoolSize"
                value={selectedPool.maximumPoolSize}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                disabled
                margin="dense"
                label="队列类型"
                name="queueType"
                value={selectedPool.queueType}
                onChange={handleChange}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            关闭
          </Button>
          <Button onClick={handleSave} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
