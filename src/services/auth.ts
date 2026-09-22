import request from '@/utils/request';

export interface ApiResponse<T> {
    code: number;
    result: T;
    message?: string;
    msg?: string;
}

export interface LoginParams {
    userCode: string;
    password: string;
}

export interface UserLoginInfo {
    loginTime: string;
    clientIP: string;
    tokenType: number;
}

export interface UserPermission {
    actionCodeList: string[];
    functionCode: string;
}

export interface UserInfo {
    userGUID: string;
    userCode: string;
    userName: string;
    isAdmin: boolean;
    departmentId: string;
    departmentName: string;
    departmentHierarchyCode: string;
    permissionList: UserPermission[];
    loginInfo: UserLoginInfo;
}

export const CPLogin = (data: LoginParams) =>
    request.post<ApiResponse<string>>('/smw/UAC/CPLogin', { data });

export const GetUserInfo = () => request.get<ApiResponse<UserInfo>>('/smw/UAC/GetUserInfo');

export const LoginOut = (data: Record<string, unknown> = {}) =>
    request.post<ApiResponse<unknown>>('/smw/UAC/LoginOut', { data });
