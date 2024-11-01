import { _Util } from 'ag-charts-community';
import type { AgChartInstance, AgSparklineOptions } from 'ag-charts-community';

import type { BeanCollection, ICellRenderer, ISparklineCellRendererParams } from 'ag-grid-community';
import { Component, RefPlaceholder, _debounce, _observeResize } from 'ag-grid-community';

import type { SparklinePoolSvc } from './sparklinePoolSvc';

export class SparklineCellRenderer extends Component implements ICellRenderer {
    private readonly eSparkline: HTMLElement = RefPlaceholder;

    private sparklineInstance?: AgChartInstance<any>;
    private sparklineOptions: AgSparklineOptions;
    private sparklinePoolSvc: SparklinePoolSvc;
    private readonly sparklineUpdateDebounceMs = 10;

    private debouncedUpdate: (...args: any[]) => void = _debounce(
        this,
        () => {
            this.sparklineInstance?.updateDelta(this.sparklineOptions);
        },
        this.sparklineUpdateDebounceMs
    );

    constructor() {
        super(/* html */ `<div class="ag-sparkline-wrapper">
            <span data-ref="eSparkline"></span>
        </div>`);
    }

    public wireBeans(beans: BeanCollection): void {
        this.sparklinePoolSvc = beans.sparklinePoolSvc as SparklinePoolSvc;
    }

    public init(params: ISparklineCellRendererParams): void {
        let firstTimeIn = true;

        const updateSparkline = () => {
            const { clientWidth: width, clientHeight: height } = this.getGui();
            if (width === 0 || height === 0 || !params.sparklineOptions) {
                return;
            }

            if (firstTimeIn) {
                this.sparklineOptions = {
                    container: this.eSparkline,
                    ...this.prepareSparklineOptions(params),
                    width,
                    height,
                } as AgSparklineOptions;

                // create new instance of sparkline if needed
                this.sparklineInstance = this.sparklinePoolSvc.getOrCreate(this.sparklineOptions as AgSparklineOptions);

                firstTimeIn = false;
            } else {
                this.sparklineOptions.width = width;
                this.sparklineOptions.height = height;
            }
            this.debouncedUpdate();
        };

        const unsubscribeFromResize = _observeResize(this.gos, this.getGui(), updateSparkline);
        this.addDestroyFunc(() => unsubscribeFromResize());
    }

    private prepareSparklineOptions(params: ISparklineCellRendererParams): AgSparklineOptions {
        const sparklineOptions = {
            ...params.sparklineOptions,
        } as AgSparklineOptions;

        if (!sparklineOptions?.xKey || !sparklineOptions?.yKey || _Util.isNumber(!sparklineOptions?.data?.[0])) {
            sparklineOptions.data = params.value.map((y: number, x: number) => ({ x, y }));
            sparklineOptions.xKey = 'x';
            sparklineOptions.yKey = 'y';
        }

        return sparklineOptions;
    }

    public refresh(params: ISparklineCellRendererParams): boolean {
        if (this.sparklineInstance && params.sparklineOptions) {
            this.sparklineOptions = this.prepareSparklineOptions(params);

            this.debouncedUpdate();
            return true;
        }
        return false;
    }

    public override destroy() {
        this.sparklinePoolSvc.release(this.sparklineInstance!);
        super.destroy();
    }
}
