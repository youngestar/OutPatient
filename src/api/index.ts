import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

// 支持的请求方法类型
type Method = "get" | "post" | "put" | "delete";
type RequestPayload = Record<string, unknown> | FormData;

// 创建 Axios 实例
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const myApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// 响应拦截器：统一处理响应和错误
myApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.code === "ECONNABORTED" && error.message?.includes("timeout")) {
      error.message = "请求超时，请稍后重试";
      return Promise.reject(error);
    }

    if (!error.response) {
      error.message = "网络异常";
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      const userStore = useUserStore();
      userStore?.clearSession?.();
    }

    const fallback = error.response.statusText || "系统出错，请稍后重试";
    error.message = error.response.data?.message || fallback;
    return Promise.reject(error);
  }
);

// 核心请求函数（简洁）
export const DoAxios = async <TResponse = unknown>(
  path: string,
  method: Method,
  requestInfo: RequestPayload | null | undefined = {},
  withToken: boolean = false,
  hasBody: boolean = false
): Promise<TResponse> => {
  const requestConfig: AxiosRequestConfig = {
    url: path,
    method,
  };
  const payload: RequestPayload = (requestInfo ?? {}) as RequestPayload;

  // 如果需要 Token，就添加 token 头
  if (withToken) {
    const userStore = useUserStore();
    const token = userStore?.userToken;
    if (!token) {
      throw new Error("Token 为空，请先登录");
    }
    requestConfig.headers = {
      satoken: token,
    };
  }

  // 判断是 query 参数还是 body 参数
  if ((method === "get" || method === "delete") && !hasBody) {
    requestConfig.params = payload as Record<string, unknown>;
  } else {
    requestConfig.data = payload;
  }

  // 请求并返回数据
  try {
    const resp = await myApi(requestConfig);
    if (resp.data.code === 200) {
      return resp.data.data as TResponse;
    }
    throw new Error(resp.data.message || "请求失败");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || "请求失败";
      throw new Error(message);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("未知错误");
  }
};

// 包含统一 UI 错误提示的请求函数
export const DoAxiosWithErro = async <TResponse = unknown>(
  path: string,
  method: Method,
  requestInfo: RequestPayload | null | undefined = {},
  withToken: boolean = false,
  hasBody: boolean = false
): Promise<TResponse> => {
  try {
    return await DoAxios<TResponse>(path, method, requestInfo, withToken, hasBody);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    ElMessage.error(message);
    throw e;
  }
};

export default myApi;
