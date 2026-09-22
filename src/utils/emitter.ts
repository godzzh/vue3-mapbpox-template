import mitt, { type Emitter } from 'mitt';

export interface AppEvents {
    'layer:toggle': { id: string; visible: boolean };
    'layer:reset': undefined;
    'screen:menu-change': { id: string };
    /** 资源搜索和地图工具由具体定制模块监听并打开业务面板。 */
    'map-tool:search': undefined;
    'map-tool:tools': undefined;
    /** 地图组件和业务覆盖物模块应监听该事件并清理临时内容。 */
    'map-tool:clear': undefined;
    'map-tool:resource-search': { keyword: string; type: string };
    'resource-layer:select': { layerId: string };
    'map-tool:command': { id: string };
    'map:ready': undefined;
    [key: string | symbol]: unknown;
}

const emitter: Emitter<AppEvents> = mitt<AppEvents>();

export default emitter;
