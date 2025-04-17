import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

type Method = 'get' | 'post' | 'put' | 'delete';

const myApi = axios.create({
  baseURL: import.meta.env.DEV ? '' : '/api',
  timeout: 20000,
});

myApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' && error.message.startsWith('timeout')) {
      return Promise.reject("请求超时，请稍后重试");
    }
    const status = error.response?.status;
    const message = error.response?.data?.message || "系统出错，请尝试重新登录";
    ElMessage.error(`[${status}] ${message}`);
    return Promise.reject(`${status + message}`);
  }
);

export const DoAxios = async (
  path: string,
  method: Method,
  requestInfo: any,
  withToken: boolean,
  hasBody: boolean = false
): Promise<any> => {
  const requestConfig: AxiosRequestConfig = {
    url: path,
    method,
  };

  if (withToken) {
    const userStore = useUserStore();
    const token = userStore?.userToken;
    if (!token) {
      throw new Error("Token 为空，请先登录");
    }
    requestConfig.headers = {
      'sa-token-authorization': token,
    };
  }

  if ((method === 'get' || method === 'delete') && !hasBody && requestInfo) {
    requestConfig.params = requestInfo;
  } else {
    requestConfig.data = requestInfo;
  }

  try {
    const resp = await myApi(requestConfig);
    const data = resp.data;

    if (data.code !== 200) {
      throw data.errorMsg || '未知错误';
    }

    return data;
  } catch (error) {
    throw new Error(`API 请求失败：${error}`);
  }
};

export const DoAxiosWithErro = async (
  path: string,
  method: Method,
  requestInfo: any,
  withToken: boolean,
  hasBody: boolean = false
): Promise<any> => {
  try {
    const data = await DoAxios(path, method, requestInfo, withToken, hasBody);
    return data;
  } catch (e: any) {
    ElMessage.error(e.message || e);
    throw new Error(e);
  }
};

export default myApi;
