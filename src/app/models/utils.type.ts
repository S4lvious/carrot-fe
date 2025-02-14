import { Component, OnDestroy } from "@angular/core";
import { PrimeIcons } from "primeng/api";

export type DialogSize = Size | 'medium' | 'extra-small' | 'medium-hs' | 'large-hs' | 'extra-large';
export type Size = 'small' | 'large';
export type InputType = 'email' | 'text' | 'number' | 'tel' | 'dialer';
export type InputViewType = 'viewOnly' | 'default';
export type TagColor = AlertColor | SecondaryColor | 'accent' | 'accent-darken' | 'accent-lighten' | 'grey';
export type AlertColor = 'success' | 'error' | 'warning' | 'quiet';
export type SecondaryColor = 'teal-blue' | 'teal-green';
export type CtTooltipPosition = 'right' | 'left' | 'top' | 'bottom';


export type CtTooltipInfo = {
    position?: CtTooltipPosition;
    event?: BmTooltipEvent;
    text?: string;
    iconName?: PrimeIcons;
    showIcon?: boolean;
}

export type BmTooltipEvent = 'hover' | 'focus';

export type DialogFooterActionType = 'primary' | 'secondary' | 'ghost' | 'danger';
export type DialogFooterActions = {
    [k in DialogFooterActionType]?: {
        label: string,
        disabled?: boolean,
        /** aggiunge un tooltip top sul pulsante, può essere usato anche quando è disabilitato */
        tooltip?: string,
        command: () => void
    }
};
export interface IComponentDialogController {
    display: boolean;
    onClose: () => void;
}

/** 
 * i componenti che devono essere caricati lazy devono estendere `LazyComponent` 
 * - `data`: l'input verrà passato al componente dopo averlo caricato, deve essere un oggetto `{example: 'test'}`
 * - `dataHandler`: funzione che si può sovrascrivere nel componente, verrà richiamata ogni volta che cambia `data` in `bm-lazy-load`
 * - `event`: non serve dichiarare la proprietà `event` nel componente, ma si può usare direttamente `this.event.emit({type: 'save', data: 'any-data'})`
 */


export interface ComponentDialogOptions {
    /** se `true` non viene usato `newInstance` e quindi il `data` non viene scollegato */
    noNewInstance?: boolean;
    /** se `true` non vengono rimosse le altre dialog presenti */
    noRemove?: boolean;
}
