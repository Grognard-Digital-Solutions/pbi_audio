import powerbi from "powerbi-visuals-api";

let localizationManager: powerbi.extensibility.ILocalizationManager;
let local: string;

export const LocalizationService = {
  bind: (service: powerbi.extensibility.visual.VisualConstructorOptions) => {
    localizationManager = service.host.createLocalizationManager();
    local = service.host.locale;
  },
  update: (newLocale: string) => {
    local = newLocale;
  },
};

export const getLocalizationManager = () => localizationManager;
