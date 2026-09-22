import request from '@/utils/request';

export interface HealthResponse {
    code: number;
    message?: string;
    data?: { status: string };
}

export const getSystemHealth = () => request.get<HealthResponse>('/api/health');
