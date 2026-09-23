export interface DashboardMetric {
    name: string;
    value: number;
    icon: string;
}

export interface DashboardProgressMetric extends DashboardMetric {
    percentage: number;
}

export interface WarningEvent {
    name: string;
    area: string;
    time: string;
    level: '高' | '中' | '低';
}

export const mobileDevices: DashboardProgressMetric[] = [
    { name: '350M', value: 836, percentage: 58, icon: '/static/images/home/icon_01.png' },
    { name: '警车', value: 428, percentage: 30, icon: '/static/images/home/icon_02.png' },
    { name: '无人机', value: 176, percentage: 12, icon: '/static/images/home/icon_03.png' },
];

export const perceptionDevices: DashboardMetric[] = [
    { name: '视频监控', value: 2568, icon: '/static/images/home/icon_07.png' },
    { name: '车辆卡口', value: 684, icon: '/static/images/home/icon_04.png' },
    { name: '人脸识别', value: 392, icon: '/static/images/home/icon_05.png' },
    { name: '基站总数', value: 126, icon: '/static/images/home/icon_06.png' },
];

export const policeCases: DashboardProgressMetric[] = [
    { name: '火险火灾', value: 42, percentage: 56, icon: '/static/images/home/icon_08.png' },
    { name: '交通事故', value: 11, percentage: 15, icon: '/static/images/home/icon_09.png' },
    { name: '案件', value: 22, percentage: 29, icon: '/static/images/home/icon_10.png' },
];

export const hazardOverview = [
    { name: '隐患总数', value: 1268, unit: '处' },
    { name: '今日新增', value: 38, unit: '处' },
    { name: '已完成整改', value: 1096, unit: '处' },
    { name: '整改率', value: 86.4, unit: '%' },
];

export const hazardCategories = [
    { name: '道路交通', value: 386, percentage: 86 },
    { name: '消防安全', value: 298, percentage: 68 },
    { name: '治安防控', value: 246, percentage: 54 },
    { name: '重点场所', value: 184, percentage: 42 },
];

export const warningTrend = [42, 55, 48, 68, 62, 79, 73, 88, 71, 64, 52, 46];

export const realtimeWarnings: WarningEvent[] = [
    { name: '道路交通风险预警', area: '天元区 · 长江北路', time: '12:42', level: '高' },
    { name: '人员密集场所预警', area: '芦淞区 · 建设中路', time: '12:36', level: '中' },
    { name: '重点设备离线预警', area: '荷塘区 · 红旗广场', time: '12:18', level: '低' },
];

export const riskAreas = [
    { name: '长江北路', value: 96 }, { name: '建设中路', value: 89 },
    { name: '红旗广场', value: 83 }, { name: '响田东路', value: 78 },
    { name: '珠江南路', value: 72 }, { name: '新华西路', value: 67 },
    { name: '泰山路', value: 61 }, { name: '庐山路', value: 56 },
    { name: '田心大道', value: 51 }, { name: '云龙大道', value: 46 },
];
