import { Autowired, Bean } from '../context/context';
import { BeanStub } from "../context/beanStub";
import { IMenuFactory } from '../interfaces/iMenuFactory';
import { FilterManager } from '../filter/filterManager';
import { Column } from '../entities/column';
import { PopupService } from '../widgets/popupService';
import { FocusController } from '../focusController';
import { addCssClass, isVisible } from '../utils/dom';
import { KeyCode } from '../constants/keyCode';
import { GridPanel } from "../gridPanel/gridPanel";

@Bean('menuFactory')
export class StandardMenuFactory extends BeanStub implements IMenuFactory {

    @Autowired('filterManager') private filterManager: FilterManager;
    @Autowired('popupService') private popupService: PopupService;
    @Autowired('focusController') private focusController: FocusController;

    private hidePopup: () => void;
    private tabListener: () => null;

    private gridPanel: GridPanel;

    public registerGridComp(gridPanel: GridPanel): void {
        this.gridPanel = gridPanel;
    }

    public hideActiveMenu(): void {
        if (this.hidePopup) {
            this.hidePopup();
        }
    }

    public showMenuAfterMouseEvent(column: Column, mouseEvent: MouseEvent | Touch): void {
        this.showPopup(column, eMenu => {
            this.popupService.positionPopupUnderMouseEvent({
                column,
                type: 'columnMenu',
                mouseEvent,
                ePopup: eMenu
            });
        }, mouseEvent.target as HTMLElement);
    }

    public showMenuAfterButtonClick(column: Column, eventSource: HTMLElement): void {
        this.showPopup(column, eMenu => {
            this.popupService.positionPopupUnderComponent({
                type: 'columnMenu',
                eventSource,
                ePopup: eMenu,
                keepWithinBounds: true,
                column
            });
        }, eventSource);
    }

    public showPopup(column: Column, positionCallback: (eMenu: HTMLElement) => void, eventSource: HTMLElement): void {
        const filterWrapper = this.filterManager.getOrCreateFilterWrapper(column, 'COLUMN_MENU');
        const eMenu = document.createElement('div');

        eMenu.setAttribute('role', 'presentation');
        addCssClass(eMenu, 'ag-menu');

        this.tabListener = this.addManagedListener(eMenu, 'keydown', (e) => this.trapFocusWithin(e, eMenu))!;

        filterWrapper.guiPromise.then(gui => eMenu.appendChild(gui!));

        let hidePopup: (() => void);

        const bodyScrollListener = (event: any) => {
            // if h scroll, popup is no longer over the column
            if (event.direction === 'horizontal' && hidePopup) {
                hidePopup();
            }
        };

        this.eventService.addEventListener('bodyScroll', bodyScrollListener);

        const closedCallback = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
            this.eventService.removeEventListener('bodyScroll', bodyScrollListener);
            column.setMenuVisible(false, 'contextMenu');
            const isKeyboardEvent = e instanceof KeyboardEvent;

            if (this.tabListener) {
                this.tabListener = this.tabListener()!;
            }

            if (isKeyboardEvent && eventSource && isVisible(eventSource)) {
                const focusableEl = this.focusController.findTabbableParent(eventSource);

                if (focusableEl) { focusableEl.focus(); }
            }
        };

        const addPopupRes = this.popupService.addPopup({
            modal: true,
            eChild: eMenu,
            closeOnEsc: true,
            closedCallback
        });

        if (addPopupRes) {
            this.hidePopup = hidePopup = addPopupRes.hideFunc;
        }

        filterWrapper.filterPromise!.then(filter => {
            // need to make sure the filter is present before positioning, as only
            // after filter it is visible can we find out what the width of it is
            positionCallback(eMenu);

            if (filter!.afterGuiAttached) {
                filter!.afterGuiAttached({ container: 'columnMenu', hidePopup });
            }
        });

        column.setMenuVisible(true, 'contextMenu');
    }

    private trapFocusWithin(e: KeyboardEvent, menu: HTMLElement) {
        if (e.keyCode !== KeyCode.TAB ||
            e.defaultPrevented ||
            this.focusController.findNextFocusableElement(menu, false, e.shiftKey)) {
            return;
        }

        e.preventDefault();

        this.focusController.focusInto(menu, e.shiftKey);
    }

    public isMenuEnabled(column: Column): boolean {
        // for standard, we show menu if filter is enabled, and the menu is not suppressed
        return column.isFilterAllowed();
    }
}
