import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { appConfig } from '@/config';
import type { LayerOption } from '@/types/screen';
import { GetUserInfo, LoginOut, type UserInfo } from '@/services/auth';
import {
    QueryFunctionsByAppNo,
    type AppFunction,
    type ResourceLayerGroup,
    type ResourceLayerMetadata,
} from '@/services/function';
import {
    GetConfigByCategoryNo,
    type MapOptions,
    type SkinBaseMapStyle,
} from '@/services/map';

const TOKEN_KEY = 'Token';

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem(TOKEN_KEY) || '');
    const userInfo = ref<UserInfo | null>(null);
    const appFunctions = ref<AppFunction[]>([]);
    const resourceLayerFunctions = ref<AppFunction[]>([]);
    const layerControlFunctions = ref<AppFunction[]>([]);
    const layerService = ref('');
    const visibleAppFunctions = computed(() => {
        if (!userInfo.value) return [];
        const enabledFunctions = appFunctions.value.filter((item) => !item.isDisabled);
        if (userInfo.value.isAdmin) return enabledFunctions;
        const grantedCodes = new Set(
            (userInfo.value.permissionList || []).map((item) => item.functionCode),
        );
        return enabledFunctions.filter((item) => grantedCodes.has(item.functionCode));
    });
    const layerControlOptions = computed<LayerOption[]>(() => {
        const grantedCodes = new Set(
            (userInfo.value?.permissionList || []).map((item) => item.functionCode),
        );
        return layerControlFunctions.value
            .filter((item) => !item.isDisabled && (userInfo.value?.isAdmin || grantedCodes.has(item.functionCode)))
            .sort((left, right) => left.orderHierarchyCode.localeCompare(right.orderHierarchyCode))
            .flatMap((item) => {
                try {
                    const parsed = item.comments ? (JSON.parse(item.comments) as Partial<LayerOption>) : null;
                    if (
                        parsed &&
                        typeof parsed.name === 'string' &&
                        typeof parsed.description === 'string' &&
                        Array.isArray(parsed.layerIds) &&
                        parsed.layerIds.every((layerId) => typeof layerId === 'string') &&
                        typeof parsed.color === 'string' &&
                        typeof parsed.visible === 'boolean'
                    ) {
                        return [{
                            id: item.functionCode,
                            name: parsed.name,
                            description: parsed.description,
                            layerIds: parsed.layerIds,
                            color: parsed.color,
                            visible: parsed.visible,
                        }];
                    }
                } catch {
                    // 单项备注无效时忽略该图层，不影响其他图层控制项。
                }
                return [];
            });
    });
    const resourceLayerTree = computed<ResourceLayerGroup[]>(() => {
        const grantedCodes = new Set(
            (userInfo.value?.permissionList || []).map((item) => item.functionCode),
        );
        const enabledFunctions = resourceLayerFunctions.value.filter(
            (item) => !item.isDisabled && (userInfo.value?.isAdmin || grantedCodes.has(item.functionCode)),
        );
        const groups = resourceLayerFunctions.value.filter(
            (item) => !item.isDisabled && item.functionLevel === 1 && !item.parentHierarchyCode,
        );
        return groups
            .sort((left, right) => left.orderHierarchyCode.localeCompare(right.orderHierarchyCode))
            .map((group) => ({
                ...group,
                children: enabledFunctions
                    .filter((item) => item.functionLevel === 2 && item.parentHierarchyCode === group.hierarchyCode)
                    .sort((left, right) => left.orderHierarchyCode.localeCompare(right.orderHierarchyCode))
                    .map((item) => {
                        let metadata: ResourceLayerMetadata | null = null;
                        try {
                            const parsed = item.comments ? (JSON.parse(item.comments) as Partial<ResourceLayerMetadata>) : null;
                            if (parsed && typeof parsed.id === 'number' && typeof parsed.layerId === 'string') {
                                metadata = { id: parsed.id, layerId: parsed.layerId, iconName: parsed.iconName };
                            }
                        } catch {
                            metadata = null;
                        }
                        const baseUrl = layerService.value.replace(/\/$/, '');
                        return {
                            ...item,
                            metadata,
                            iconUrl: metadata && baseUrl ? `${baseUrl}/citmsmap/sprite/queryIcon/${metadata.id}` : '',
                        };
                    }),
            }));
    });
    const loading = ref(false);
    const mapConfigLoaded = ref(false);
    const mapOptions = ref<MapOptions>({});
    const lightBlueStyle = ref('');
    const darkBlueStyle = ref('');
    const isAuthenticated = computed(() => Boolean(token.value));

    const setToken = (value: string) => {
        token.value = value;
        localStorage.setItem(TOKEN_KEY, value);
    };

    const clearSession = () => {
        token.value = '';
        userInfo.value = null;
        appFunctions.value = [];
        resourceLayerFunctions.value = [];
        layerControlFunctions.value = [];
        layerService.value = '';
        localStorage.removeItem(TOKEN_KEY);
    };

    const getMapConfig = async () => {
        const response = await GetConfigByCategoryNo('MapConfig');
        if (response.code !== 0 && response.code !== 200) return false;

        layerService.value = response.result?.layerService || '';
        mapOptions.value = response.result?.options || {};
        const styles: SkinBaseMapStyle[] = response.result?.skinBaseMapStyle || [];
        lightBlueStyle.value =
            styles.find((item) => item.skin === 'lightBlue')?.baseMapStyle || '';
        darkBlueStyle.value =
            styles.find((item) => item.skin === 'darkBlue')?.baseMapStyle || lightBlueStyle.value;
        mapConfigLoaded.value = true;
        return Boolean(darkBlueStyle.value || lightBlueStyle.value);
    };

    const loadAppFunctions = async () => {
        appFunctions.value = [];
        try {
            const response = await QueryFunctionsByAppNo(appConfig.functionMenus.mapTools.appNo);
            if (response.code === 0 || response.code === 200) {
                appFunctions.value = Array.isArray(response.result) ? response.result : [];
            }
        } catch {
            // 菜单定义加载失败时保持空菜单，不影响已成功建立的用户登录态。
            appFunctions.value = [];
        }
    };

    const loadResourceLayerFunctions = async () => {
        resourceLayerFunctions.value = [];
        try {
            const response = await QueryFunctionsByAppNo(appConfig.functionMenus.mapLayer.appNo);
            if (response.code === 0 || response.code === 200) {
                resourceLayerFunctions.value = Array.isArray(response.result) ? response.result : [];
            }
        } catch {
            resourceLayerFunctions.value = [];
        }
    };

    const loadLayerControlFunctions = async () => {
        layerControlFunctions.value = [];
        try {
            const response = await QueryFunctionsByAppNo(appConfig.functionMenus.mapLayer.mapLayerControl);
            if (response.code === 0 || response.code === 200) {
                layerControlFunctions.value = Array.isArray(response.result) ? response.result : [];
            }
        } catch {
            layerControlFunctions.value = [];
        }
    };

    const loadUserInfo = async () => {
        if (!token.value) return false;
        loading.value = true;
        try {
            const response = await GetUserInfo();
            if (response.code !== 0 && response.code !== 200) return false;
            userInfo.value = response.result;
            await Promise.all([
                loadAppFunctions(),
                loadResourceLayerFunctions(),
                loadLayerControlFunctions(),
                getMapConfig(),
            ]);
            return true;
        } finally {
            loading.value = false;
        }
    };

    const logout = async () => {
        try {
            if (token.value) await LoginOut();
        } finally {
            clearSession();
        }
    };

    return {
        appFunctions,
        clearSession,
        darkBlueStyle,
        getMapConfig,
        isAuthenticated,
        layerControlFunctions,
        layerControlOptions,
        layerService,
        lightBlueStyle,
        loadAppFunctions,
        loadLayerControlFunctions,
        loadResourceLayerFunctions,
        loadUserInfo,
        loading,
        logout,
        mapConfigLoaded,
        mapOptions,
        resourceLayerFunctions,
        resourceLayerTree,
        setToken,
        token,
        userInfo,
        visibleAppFunctions,
    };
});
