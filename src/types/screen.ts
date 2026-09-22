export interface LayerOption {
    id: string;
    name: string;
    layerIds: string[];
    description: string;
    color: string;
    visible: boolean;
}

export interface ScreenMenuItem {
    id: string;
    name: string;
    path: string;
}

export interface MetricItem {
    label: string;
    value: string;
    trend?: string;
}
