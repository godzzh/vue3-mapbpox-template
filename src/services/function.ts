import type { ApiResponse } from '@/services/auth';
import request from '@/utils/request';

export interface ResourceLayerMetadata {
    id: number;
    layerId: string;
    iconName?: string;
}

export interface ResourceLayerItem extends AppFunction {
    iconUrl: string;
    metadata: ResourceLayerMetadata | null;
}

export interface ResourceLayerGroup extends AppFunction {
    children: ResourceLayerItem[];
}

export interface AppFunction {
    functionGUID: string;
    functionCode: string;
    functionName: string;
    hierarchyCode: string;
    parentHierarchyCode: string;
    orderCode: string;
    orderHierarchyCode: string;
    functionLevel: number;
    isLastStage: boolean;
    isDisabled: boolean;
    functionIcon: string | null;
    functionUrl: string | null;
    comments: string | null;
    parentFunctionGUID: string;
    appNo: string;
    [key: string]: unknown;
}

export const QueryFunctionsByAppNo = (appNo: string) =>
    request.get<ApiResponse<AppFunction[]>>('/smw/Function/QueryByAppNo', {
        params: { appNo },
    });
