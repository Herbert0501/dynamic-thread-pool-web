export enum Path {
  Home = "/",
  Pools = "/pools",
  Monitor = "/monitor",
}

export enum Pages {
  Home = "首页",
  ThreadPool = "线程池列表",
  Monitor = "监控界面",
  Settings = "设置",
  Report = "报告",
}

// 从环境变量获取
export const grafanaUrl = process.env.GRAFANA_URL || "";
