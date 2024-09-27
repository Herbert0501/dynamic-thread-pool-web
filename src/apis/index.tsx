import { useAccessStore } from "@/app/stores/access";
import { ThreadPoolConfigEntity } from "@/types/thread_pool";

const apiHostUrl = "http://localhost:8089";

/**
 * 获取请求头信息
 *
 * 主要用于获取token
 *
 * @returns {Object} 包含Authorization和ContentType的请求头信息对象
 */
function getHeaders() {
  // 获取当前的访问状态，包含token等信息
  const accessState = useAccessStore.getState();

  // 构建请求头对象
  const headers = {
    Authorization: accessState.token, // 授权令牌
    "Content-Type": "application/json;charset=utf-8",
  };

  return headers;
}

/**
 * 登录函数，用于向后端发送用户的登录信息并获取访问令牌
 * @param username 用户名
 * @param password 密码
 * @returns 返回fetch API的响应，以便进一步处理（例如，获取访问令牌）
 */
export const login = (username: string, password: string) => {
  // 使用fetch API进行POST请求，向后端发送登录信息
  return fetch(`${apiHostUrl}/api/v1/auth/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
};

/**
 * 查询线程池列表
 *
 * @returns Promise<Response> 返回包含线程池列表的响应Promise
 */
export const queryThreadPoolList = () => {
  return fetch(
    `${apiHostUrl}/api/v1/dynamic/thread/pool/query_thread_pool_list`,
    {
      method: "get",
      headers: getHeaders(),
    }
  );
};

/**
 * 查询线程池配置信息
 *
 * @param appName 应用程序名称，用于标识需要查询配置的应用
 * @param threadPoolName 线程池名称，用于标识需要查询配置的特定线程池
 * @returns 返回fetch函数的返回值，通常是一个Promise对象，该对象解析后的值为服务器的响应
 */
export const queryThreadPoolConfig = (
  appName: string,
  threadPoolName: string
) => {
  // 创建URL对象，用于构造请求的URL
  const url = new URL(
    `${apiHostUrl}/api/v1/dynamic/thread/pool/query_thread_pool_config`
  );
  // 向URL中添加查询参数
  url.searchParams.append("appName", appName);
  url.searchParams.append("threadPoolName", threadPoolName);

  // 使用fetch函数发起GET请求，返回Promise对象
  return fetch(url.toString(), {
    method: "GET",
    headers: getHeaders(),
  });
};

/**
 * 异步更新线程池配置函数
 *
 * @param config 线程池配置实体对象，包含需要更新的线程池配置信息
 * @returns 返回一个Promise，解析为一个字符串，该字符串是API响应中包含的状态码
 * @throws 如果网络响应状态不好（即HTTP状态码不在200-299范围内），则抛出一个错误
 */
export const updateThreadPoolConfig = async (
  config: ThreadPoolConfigEntity
): Promise<string> => {
  // 构造请求的URL
  const url = `${apiHostUrl}/api/v1/dynamic/thread/pool/update_thread_pool_config`;

  // 发起网络请求，使用fetch API发送POST请求到指定的URL
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });

  // 检查响应状态，如果不好则抛出错误
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  // 解析响应数据，期望响应是JSON格式并包含特定结构
  const data: { code: string; info: string; data: boolean } =
    await response.json();

  // 返回响应中的状态码
  return data.code;
};
