export interface ThreadPoolEntity {
  /**
   * 应用名称
   */
  appName: string;

  /**
   * 线程池名称
   */
  threadPoolName: string;

  /**
   * 核心线程数
   */
  corePoolSize: number;

  /**
   * 最大线程数
   */
  maximumPoolSize: number;

  /**
   * 当前活跃线程数
   */
  activeCount: number;

  /**
   * 当前池中线程数
   */
  poolSize: number;

  /**
   * 队列类型
   */
  queueType: string;

  /**
   * 当前队列任务数
   */
  queueSize: number;

  /**
   * 队列剩余任务数
   */
  remainingCapacity: number;
}