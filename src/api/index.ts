import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

// 支持的请求方法类型
type Method = "get" | "post" | "put" | "delete";

// 创建 Axios 实例
const myApi = axios.create({
  baseURL: import.meta.env.DEV ? "" : "/api",
  timeout: 10000,
});

// 响应拦截器：统一处理响应和错误
myApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response; // 成功直接返回响应
  },
  (error) => {
    // 请求超时处理
    console.log(error)
    if (error.code === "ECONNABORTED" && error.message?.includes("timeout")) {
      return Promise.reject("请求超时，请稍后重试");
    }

    // 网络断开或服务无响应
    if (!error.response) {
      return Promise.reject("网络异常");
    }

    const status = error.response.status;
    const message =
      error.response.data?.message || "系统出错，请尝试重新登录";
    return Promise.reject(`${status} ${message}`);
  }
);

// 核心请求函数（简洁）
export const DoAxios = async (
  path: string,
  method: Method,
  requestInfo: any = {},
  withToken: boolean = false,
  hasBody: boolean = false
): Promise<any> => {
  const requestConfig: AxiosRequestConfig = {
    url: path,
    method,
  };

  // 如果需要 Token，就添加 token 头
  if (withToken) {
    const userStore = useUserStore();
    const token = userStore?.userToken;
    if (!token) {
      throw new Error("Token 为空，请先登录");
    }

    requestConfig.headers = {
      "sa-token-authorization": token,
    };
  }

  // 判断是 query 参数还是 body 参数
  if ((method === "get" || method === "delete") && !hasBody) {
    requestConfig.params = requestInfo;
  } else {
    requestConfig.data = requestInfo;
  }

  // 请求并返回数据
  try {
    const resp = await myApi(requestConfig);
    return resp.data;
  } catch (error: any) {
    throw new Error(error?.message || "未知错误");
  }
};

// 包含统一 UI 错误提示的请求函数
export const DoAxiosWithErro = async (
  path: string,
  method: Method,
  requestInfo: any = {},
  withToken: boolean = false,
  hasBody: boolean = false
): Promise<any> => {
  try {
    return await DoAxios(path, method, requestInfo, withToken, hasBody);
  } catch (e: any) {
    ElMessage.error(e.message || String(e));
    throw e;
  }
};

export default myApi;
