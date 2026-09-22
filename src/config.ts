export const appConfig = {
    platform: {
        title: '城市时空态势平台',
    },
    functionMenus: {
        mapTools: {
            appNo: 'qzq-map-tools',  // 右侧地图菜单
        },
        mapLayer: {
            appNo: 'qzq-map-layer',  // 资源图层
            mapLayerControl: 'qzq-map-control',  // 图层控制
        },
    },
} as const;

export type AppConfig = typeof appConfig;
