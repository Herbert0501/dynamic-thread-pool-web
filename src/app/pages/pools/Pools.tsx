import React, { useState, useEffect } from "react";

// 定义线程池数据的接口
interface ThreadPoolEntity {
  appName: string;
  threadPoolName: string;
  corePoolSize: number;
  maximumPoolSize: number;
  activeCount: number;
  poolSize: number;
  queueType: string;
  queueSize: number;
  remainingCapacity: number;
}

const Pools: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ThreadPoolEntity[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 5000); // 每5秒刷新一次
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchData = async () => {
    setLoading(true);
    // 模拟获取数据
    const result: ThreadPoolEntity[] = [
      {
        appName: "App1",
        threadPoolName: "Pool1",
        corePoolSize: 5,
        maximumPoolSize: 10,
        activeCount: 3,
        poolSize: 7,
        queueType: "LinkedBlockingQueue",
        queueSize: 2,
        remainingCapacity: 8,
      },
      {
        appName: "App2",
        threadPoolName: "Pool2",
        corePoolSize: 10,
        maximumPoolSize: 20,
        activeCount: 15,
        poolSize: 18,
        queueType: "ArrayBlockingQueue",
        queueSize: 5,
        remainingCapacity: 10,
      },
    ];
    setData(result);
    setLoading(false);

    // 取消注释以下代码以使用真实API
    // const response = await fetch('/api/thread-pools');
    // const result: ThreadPoolEntity[] = await response.json();
    // setData(result);
    // setLoading(false);
  };

  const handleAutoRefresh = () => {
    setAutoRefresh(true);
  };

  const handleStopAutoRefresh = () => {
    setAutoRefresh(false);
  };

  return (
    <div className="container">
      <h1>Dynamic Thread Pool —— 动态线程池</h1>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <table id="threadPoolList">
          <thead>
            <tr>
              <th>应用名称</th>
              <th>线程池名称</th>
              <th>核心线程池数</th>
              <th>最大线程数</th>
              <th>当前活跃线程数</th>
              <th>当前池中线程数</th>
              <th>队列类型</th>
              <th>当前队列任务数</th>
              <th>队列剩余容量数</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.appName}</td>
                <td>{item.threadPoolName}</td>
                <td>{item.corePoolSize}</td>
                <td>{item.maximumPoolSize}</td>
                <td>{item.activeCount}</td>
                <td>{item.poolSize}</td>
                <td>{item.queueType}</td>
                <td>{item.queueSize}</td>
                <td>{item.remainingCapacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        id="autoRefreshBtn"
        onClick={handleAutoRefresh}
        style={{ display: autoRefresh ? "none" : "block" }}
      >
        自动刷新
      </button>
      <button
        id="stopAutoRefreshBtn"
        onClick={handleStopAutoRefresh}
        style={{ display: autoRefresh ? "block" : "none" }}
      >
        停止刷新
      </button>
    </div>
  );
};

export default Pools;
