export interface CrudTableConfig {
    title: string;
    addButtonText?: string;
    columns: ColumnConfig[];
    actionButtons: { name: string, label: string, icon: string, class: string }[];
    actions: { [key: string]: (item: any) => void };
    defaultSelected?: string[]
}

export type ColType = 'text' | 'boolean' | 'date' | 'custom';

export interface ColumnConfig {
    type: ColType,
    header: string,
    field: string
    filter: boolean
    props?: any[]
}