import { extend, type RequestOptionsInit } from 'umi-request';

interface BusinessResponse {
    code?: number;
    message?: string;
    msg?: string;
    [key: string]: unknown;
}

const statusMessages: Record<number, string> = {
    400: '请求参数错误。',
    401: '登录状态已失效。',
    403: '没有访问该资源的权限。',
    404: '请求的资源不存在。',
    408: '请求超时。',
    500: '服务器发生错误。',
    502: '网关错误。',
    503: '服务暂不可用。',
    504: '网关超时。',
};

const request = extend({
    prefix: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 60_000,
    errorHandler(error: { response?: Response }) {
        const response = error.response;
        window.$notification?.error({
            title: response ? `请求失败 (${response.status})` : '网络异常',
            content: response
                ? statusMessages[response.status] || response.statusText || '服务请求失败。'
                : '请检查网络连接后重试。',
            duration: 3000,
        });
        throw error;
    },
});

request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
    const token = localStorage.getItem('Token');
    if (!token) return { url, options };
    return {
        url,
        options: {
            ...options,
            headers: {
                ...(options.headers as Record<string, string> | undefined),
                Authorization: `Basic ${token}`,
            },
        },
    };
});

request.interceptors.response.use(async (response: Response, options: RequestOptionsInit) => {
    if (options.responseType === 'blob') return response;
    const data = (await response.json()) as BusinessResponse;
    if (data.code === 401 || data.code === 5000) {
        localStorage.removeItem('Token');
        window.$notification?.error({
            title: '登录已过期',
            content: '请重新登录后继续操作。',
            duration: 2500,
        });
    } else if (typeof data.code === 'number' && ![0, 33, 200].includes(data.code)) {
        window.$message?.warning(data.message || data.msg || '业务请求失败。');
    }
    return data as unknown as Response;
});

export default request;
