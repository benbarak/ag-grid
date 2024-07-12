import type {
    AbstractHeaderCellCtrl,
    HeaderCellCtrl,
    HeaderFilterCellCtrl,
    HeaderGroupCellCtrl,
    HeaderRowCtrl,
    IHeaderRowComp,
} from 'ag-grid-community';
import { EmptyBean, HeaderRowType } from 'ag-grid-community';
import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { BeansContext } from '../beansContext';
import { agFlushSync, getNextValueIfDifferent } from '../utils';
import HeaderCellComp from './headerCellComp';
import HeaderFilterCellComp from './headerFilterCellComp';
import HeaderGroupCellComp from './headerGroupCellComp';

const HeaderRowComp = (props: { ctrl: HeaderRowCtrl }) => {
    const { context } = useContext(BeansContext);
    const { ctrl } = props;

    const { topOffset, rowHeight } = useMemo(() => ctrl.getTopAndHeight(), []);
    const ariaRowIndex = ctrl.getAriaRowIndex();
    const className = ctrl.getHeaderRowClass();

    const [height, setHeight] = useState<string>(() => rowHeight + 'px');
    const [top, setTop] = useState<string>(() => topOffset + 'px');

    const cellCtrlsRef = useRef<AbstractHeaderCellCtrl[] | null>(null);
    const prevCellCtrlsRef = useRef<AbstractHeaderCellCtrl[] | null>(null);
    const [cellCtrls, setCellCtrls] = useState<AbstractHeaderCellCtrl[]>(() => ctrl.getHeaderCtrls());

    const compBean = useRef<EmptyBean>();
    const eGui = useRef<HTMLDivElement | null>(null);
    const compProxy = useRef<IHeaderRowComp>({
        setHeight: (height: string) => setHeight(height),
        setTop: (top: string) => setTop(top),
        setHeaderCtrls: (ctrls: AbstractHeaderCellCtrl[], forceOrder: boolean, afterScroll: boolean) => {
            prevCellCtrlsRef.current = cellCtrlsRef.current;
            cellCtrlsRef.current = ctrls;

            const next = getNextValueIfDifferent(prevCellCtrlsRef.current, ctrls, forceOrder)!;
            if (next !== prevCellCtrlsRef.current) {
                agFlushSync(afterScroll, () => setCellCtrls(next));
            }
        },
        setWidth: (width: string) => {
            if (eGui.current) {
                eGui.current.style.width = width;
            }
        },
    });

    const setRef = useCallback((eRef: HTMLDivElement | null) => {
        eGui.current = eRef;
        compBean.current = eRef ? context.createBean(new EmptyBean()) : context.destroyBean(compBean.current);
        if (!eRef || !props.ctrl.isAlive()) {
            return;
        }
        ctrl.setComp(compProxy.current, eRef, false);
    }, []);

    const style = useMemo(
        () => ({
            height: height,
            top: top,
        }),
        [height, top]
    );

    const createCellJsx = useCallback((cellCtrl: AbstractHeaderCellCtrl) => {
        switch (ctrl.getType()) {
            case HeaderRowType.COLUMN_GROUP:
                return <HeaderGroupCellComp ctrl={cellCtrl as HeaderGroupCellCtrl} key={cellCtrl.getInstanceId()} />;

            case HeaderRowType.FLOATING_FILTER:
                return <HeaderFilterCellComp ctrl={cellCtrl as HeaderFilterCellCtrl} key={cellCtrl.getInstanceId()} />;

            default:
                return <HeaderCellComp ctrl={cellCtrl as HeaderCellCtrl} key={cellCtrl.getInstanceId()} />;
        }
    }, []);

    return (
        <div ref={setRef} className={className} role="row" style={style} aria-rowindex={ariaRowIndex}>
            {cellCtrls.map(createCellJsx)}
        </div>
    );
};

export default memo(HeaderRowComp);
