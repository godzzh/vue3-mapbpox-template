export type WarningEventLevel = 'Ⅰ级' | 'Ⅱ级' | 'Ⅲ级';
export type WarningEventStatus = '待处置' | '处置中' | '已处置';
export type IoTDeviceType = '视频监控' | '车辆卡口' | '环境感知';

export interface OperationWarningEvent {
    id: string;
    title: string;
    location: string;
    occurredAt: string;
    level: WarningEventLevel;
    status: WarningEventStatus;
    longitude: number;
    latitude: number;
    source: string;
    description: string;
    suggestion: string;
}

export interface WarningStakeholder {
    id: string;
    name: string;
    role: string;
    organization: string;
    phone: string;
}

export interface WarningIoTDevice {
    id: string;
    name: string;
    type: IoTDeviceType;
    status: '在线' | '离线';
    longitude: number;
    latitude: number;
}

export const operationWarningEvents: OperationWarningEvent[] = [
    { id: 'YJ-20250308-001', title: '铁路沿线人员闯入', location: '吉安站北侧铁路沿线', occurredAt: '2025-03-08 14:26', level: 'Ⅰ级', status: '待处置', longitude: 115.02423094974536, latitude: 27.074359314291424, source: '智能视频分析', description: '铁路防护网内检测到人员持续活动，已触发沿线入侵预警。', suggestion: '立即通知就近巡防力量核查，并联动站区工作人员进行现场劝离。' },
    { id: 'YJ-20250308-002', title: '重点区域人员聚集', location: '吉安站站前广场', occurredAt: '2025-03-08 13:48', level: 'Ⅱ级', status: '处置中', longitude: 115.02186, latitude: 27.07294, source: '客流密度监测', description: '站前广场局部区域人员密度超过预设阈值。', suggestion: '加强现场疏导并持续观察客流变化。' },
    { id: 'YJ-20250308-003', title: '沿线设备异常离线', location: '吉安站东侧铁路区段', occurredAt: '2025-03-08 12:16', level: 'Ⅲ级', status: '待处置', longitude: 115.02742, latitude: 27.07618, source: '设备运行监测', description: '沿线视频设备连续离线超过十分钟。', suggestion: '通知设备维护单位检查供电及网络状态。' },
    { id: 'YJ-20250308-004', title: '站区周界入侵告警', location: '吉安站北侧周界', occurredAt: '2025-03-08 10:35', level: 'Ⅰ级', status: '已处置', longitude: 115.01978, latitude: 27.07816, source: '周界感知设备', description: '北侧周界检测到异常跨越行为。', suggestion: '调取周边视频并安排巡防人员复核。' },
    { id: 'YJ-20250307-005', title: '重点车辆长时间停留', location: '吉安站车辆通道入口', occurredAt: '2025-03-07 22:41', level: 'Ⅱ级', status: '已处置', longitude: 115.03026, latitude: 27.07123, source: '车辆卡口分析', description: '车辆在站区入口禁停区域停留超过阈值。', suggestion: '核验车辆信息并通知现场人员处置。' },
    { id: 'YJ-20250307-006', title: '铁路桥下火情识别', location: '吉安站南侧铁路桥', occurredAt: '2025-03-07 19:12', level: 'Ⅰ级', status: '已处置', longitude: 115.01562, latitude: 27.06872, source: '热成像感知', description: '桥下区域识别到异常高温与烟雾特征。', suggestion: '联动消防力量快速核查，控制周边人员进入。' },
];

export const warningStakeholders: WarningStakeholder[] = [
    { id: 'stakeholder-1', name: '张卫东', role: '辖区民警', organization: '站前派出所', phone: '138****6201' },
    { id: 'stakeholder-2', name: '李国强', role: '巡防负责人', organization: '铁路巡防大队', phone: '139****2746' },
    { id: 'stakeholder-3', name: '王敏', role: '站区联络员', organization: '吉安站综管办', phone: '137****9083' },
];

export const warningIoTDevices: WarningIoTDevice[] = [
    { id: 'CAM-300101', name: '吉安站北向摄像机', type: '视频监控', status: '在线', longitude: 115.02468, latitude: 27.07463 },
    { id: 'CAM-300102', name: '防护网东侧摄像机', type: '视频监控', status: '在线', longitude: 115.02344, latitude: 27.07402 },
    { id: 'GATE-2018', name: '吉安站车辆卡口', type: '车辆卡口', status: '在线', longitude: 115.02615, latitude: 27.07387 },
    { id: 'ENV-1206', name: '沿线环境监测站', type: '环境感知', status: '离线', longitude: 115.02142, latitude: 27.07594 },
    { id: 'CAM-300117', name: '站区东侧全景摄像机', type: '视频监控', status: '在线', longitude: 115.02842, latitude: 27.07708 },
    { id: 'CAM-300125', name: '铁路桥北侧摄像机', type: '视频监控', status: '在线', longitude: 115.0321, latitude: 27.08046 },
];
