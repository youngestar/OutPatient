import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";

const myApi = axios.create({
    baseURL: 'http://127.0.0.1:5173',
    timeout: 20000,
});

myApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' && error.message.startsWith('timeout')) {
            return Promise.reject("请求超时，请稍后重试");
        }
        const status = error.response?.status;
        const message = error.response?.data?.message || "系统出错，请尝试重新登录";
        // ElMessage.error(`[${status}] ${message}`);
        return Promise.reject(`${status + message}`);
    }
);

export const DoAxios = async (path, method, requestInfo, withToken,haveBody = false) => {
    const requestConfig = {
        url: path,
        method,
    };

    if (withToken) {
        const userStore = useUserStore();
        const token = userStore?.userToken;
        if (!token) {
            throw "Token 为空，请先登录";
        }
        requestConfig['headers'] = {
            'sa-token-authorization': token,
        };
    }

    if (['get', 'delete'].includes(method) && !haveBody) {
        requestConfig['params'] = requestInfo;
    } else {
        requestConfig['data'] = requestInfo;
    }

    let resp;

    try {
        resp = await myApi(requestConfig);
    } catch (error) {
        throw `API 请求失败：${error}`;
    }

    const data = resp.data;
    if (!data.success) {
        throw data.errorMsg || '未知错误';
    }

    return data;
};


export const DoAxiosWithErro = async (path, method, requestInfo, withToken,hasBody = false) => {
    try{
        const data = await DoAxios(path, method, requestInfo, withToken,hasBody)
        return data;
    } catch (e) {
        ElMessage.error(e);
        throw (new Error(e));
    }
}

export default myApi;
