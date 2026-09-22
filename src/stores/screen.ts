import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { LayerOption } from '@/types/screen';
import emitter from '@/utils/emitter';

export const useScreenStore = defineStore('screen', () => {
    const leftExpanded = ref(true);
    const rightExpanded = ref(true);
    const layerPanelVisible = ref(false);
    const defaultLayers = ref<LayerOption[]>([]);
    const layers = ref<LayerOption[]>([]);
    const visibleResourceLayerIds = ref<string[]>([]);

    const setLayerOptions = (options: LayerOption[]) => {
        defaultLayers.value = options.map((layer) => ({ ...layer, layerIds: [...layer.layerIds] }));
        layers.value = defaultLayers.value.map((layer) => ({ ...layer, layerIds: [...layer.layerIds] }));
    };

    const toggleLayer = (id: string) => {
        const layer = layers.value.find((item) => item.id === id);
        if (layer) {
            layer.visible = !layer.visible;
            emitter.emit('layer:toggle', { id: layer.id, visible: layer.visible });
        }
    };

    const toggleResourceLayer = (layerId: string) => {
        visibleResourceLayerIds.value = visibleResourceLayerIds.value.includes(layerId)
            ? visibleResourceLayerIds.value.filter((id) => id !== layerId)
            : [...visibleResourceLayerIds.value, layerId];
    };

    const clearResourceLayers = () => {
        visibleResourceLayerIds.value = [];
    };

    const resetLayers = () => {
        layers.value = defaultLayers.value.map((layer) => ({ ...layer, layerIds: [...layer.layerIds] }));
        emitter.emit('layer:reset', undefined);
    };

    return {
        clearResourceLayers,
        layerPanelVisible,
        layers,
        leftExpanded,
        rightExpanded,
        resetLayers,
        setLayerOptions,
        toggleLayer,
        toggleResourceLayer,
        visibleResourceLayerIds,
    };
});
