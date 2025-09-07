import { IConfig } from "tpdb-lib";
import { create } from "zustand";

interface ConfigsState {
  configs: IConfig[];
  setConfigs: (configs?: IConfig[]) => void;
}

export const useConfigsStore = create<ConfigsState>((set) => ({
  configs: [],
  setConfigs: (conf) =>
    set(() => ({
      configs: conf,
    })),
}));
