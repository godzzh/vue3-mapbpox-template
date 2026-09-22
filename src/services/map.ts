import type { ApiResponse } from '@/services/auth';
import request from '@/utils/request';

export interface SkinBaseMapStyle {
    skin: 'lightBlue' | 'darkBlue' | string;
    baseMapStyle: string;
}

export interface MapOptions {
    center?: [number, number];
    zoom?: number;
    pitch?: number;
    bearing?: number;
    minZoom?: number;
    maxZoom?: number;
    crs?: string;
    attributionControl?: boolean;
    [key: string]: unknown;
}

export interface MapConfigResult {
    layerService?: string;
    options?: MapOptions;
    skinBaseMapStyle?: SkinBaseMapStyle[];
}

export const GetConfigByCategoryNo = (categoryNo: string) =>
    request.get<ApiResponse<MapConfigResult>>('/smw/ConfigOptions/GetConfigByCategoryNo', {
        params: { categoryNo },
    });
