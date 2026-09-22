declare global {
    type MapboxEventHandler = (event: {
        error?: Error;
        [key: string]: unknown;
    }) => void;

    type MapboxStyle = string | Record<string, unknown>;

    interface MapboxMapOptions {
        container: HTMLElement | string;
        style: MapboxStyle;
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

    interface MapboxControl {}

    interface MapboxMapInstance {
        addControl(control: MapboxControl, position?: string): this;
        removeControl(control: MapboxControl): this;
        addLayer(layer: Record<string, unknown>, beforeId?: string): this;
        addSource(id: string, source: Record<string, unknown>): this;
        getLayer(id: string): unknown;
        getSource(id: string): { setData(data: unknown): void } | undefined;
        removeLayer(id: string): this;
        removeSource(id: string): this;
        getCenter(): { lng: number; lat: number };
        getZoom(): number;
        flyTo(options: Record<string, unknown>): this;
        on(type: string, handler: MapboxEventHandler): this;
        once(type: string, handler: MapboxEventHandler): this;
        off(type: string, handler: MapboxEventHandler): this;
        getBearing(): number;
        isStyleLoaded(): boolean;
        project(coordinates: [number, number]): { x: number; y: number };
        unproject(point: [number, number] | { x: number; y: number }): { lng: number; lat: number };
        rotateTo(bearing: number, options?: Record<string, unknown>): this;
        remove(): void;
        resize(): void;
        setLayoutProperty(layerId: string, name: string, value: unknown): this;
    }

    interface GeoJsonGeometry {
        type: string;
        coordinates: unknown;
    }

    interface GeoJsonFeature {
        id?: string | number;
        type: 'Feature';
        properties?: Record<string, unknown>;
        geometry: GeoJsonGeometry;
    }

    interface GeoJsonFeatureCollection {
        type: 'FeatureCollection';
        features: GeoJsonFeature[];
    }

    interface MapboxDrawInstance extends MapboxControl {
        changeMode(mode: 'simple_select' | 'draw_point' | 'draw_line_string' | 'draw_polygon', options?: Record<string, unknown>): void;
        add(feature: GeoJsonFeature | GeoJsonFeatureCollection): Array<string | number>;
        delete(ids: string | number | Array<string | number>): this;
        deleteAll(): void;
        getAll(): GeoJsonFeatureCollection;
    }

    interface MapboxMarkerInstance {
        setLngLat(coordinates: [number, number]): this;
        addTo(map: MapboxMapInstance): this;
        remove(): void;
    }

    interface MapboxGlobal {
        Map: new (options: MapboxMapOptions) => MapboxMapInstance;
        Marker: new (elementOrOptions?: HTMLElement | Record<string, unknown>) => MapboxMarkerInstance;
        NavigationControl: new (options?: Record<string, unknown>) => MapboxControl;
        accessToken?: string;
    }

    const mapboxgl: MapboxGlobal;

    interface Window {
        mapboxgl: MapboxGlobal;
        MapboxDraw?: new (options?: Record<string, unknown>) => MapboxDrawInstance;
        mapViewer?: MapboxMapInstance;
    }
}

export {};
