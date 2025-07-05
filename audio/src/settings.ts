"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { getLocalizationManager } from "./features/LocalizationService";

const localizationManager = getLocalizationManager();

export class VisualFormattingSettingsModel extends formattingSettings.Model {
  public audio_settings = new AudioSettings();
  cards = [this.audio_settings];
}

export class AudioSettings extends formattingSettings.CompositeCard {
  name = "object_audio";
  audio_switch = new formattingSettings.ToggleSwitch({
    name: "audio_switch",
    displayName: localizationManager.getDisplayName("audio_switch"),
    description: localizationManager.getDisplayName("audio_switch_display"),
    value: false,
  });
  topLevelSlice = this.audio_switch;
  groups = [];
}
