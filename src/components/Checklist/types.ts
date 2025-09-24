import { SetState } from "@config/react";
import { ReactNode } from "react";

export interface IChecklistItem {
  id: string;
  title: string;
  group?: string;
  imageUrl?: string;
  imageWidth?: string;
  imageFit?: "cover" | "scale-down" | undefined;
  description?: string | ReactNode;
  price?: number;
  oldPrice?: number;
  isSum?: boolean;
  minPrice?: number;
  disabled?: boolean;
}

export interface IChecklist {
  name: string;
  label: string;
  description?: string;
  items: IChecklistItem[];
  showZeroValue?: boolean;
  onDone?: () => void;
  collapsed?: boolean;
  maxItemsCollapsed?: number;
  collapsedLabel?: string;

  min?: number;
  max?: number;
  highlights?: string[];

  value: string[];
  setValue: (newValue: string[]) => void;
}

export interface IChecklistItemGroup {
  name: string;
  items: IChecklistItem[];
}

export type GroupOrItem = IChecklistItem | IChecklistItemGroup;

export interface IChecklistContext extends IChecklist {
  search: string;
  setSearch: SetState<string>;
  collapsed: boolean;
  setCollapsed: SetState<boolean>;
  hideSearch: boolean;
  setHideSearch: SetState<boolean>;
  showSearch: boolean;
  setShowSearch: SetState<boolean>;
  multi: boolean;
  required: boolean;
  isDone: boolean;
  defaultCollapsed: boolean;
  touched: boolean;
  setTouched: SetState<boolean>;
  allowSearch: boolean;
  finalItems: GroupOrItem[];
}
