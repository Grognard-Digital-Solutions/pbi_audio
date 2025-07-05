"use strict";

import * as d3 from "d3";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";
import { getLocalizationManager, LocalizationService } from "./features/LocalizationService";

export class Visual implements IVisual {
  private target: d3.Selection<any, any, any, any>;

  private message: HTMLParagraphElement;

  private visualUpdateOptions: powerbi.extensibility.visual.VisualConstructorOptions;

  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  private audio: HTMLAudioElement;
  private audioContext: AudioContext;
  private track: MediaElementAudioSourceNode;

  private gainNode: GainNode;

  constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
    try {
      

      this.target = d3.select(options.element);
      this.visualUpdateOptions = options;
      LocalizationService.bind(this.visualUpdateOptions);
      this.formattingSettingsService = new FormattingSettingsService();

      if (document) {
        this.audio = document.createElement("audio");
        this.audio.src = "https://grognard.ca/assets/data/FabricCommunityContests/audio.wav";
        this.audio.crossOrigin = "anonymous";

        this.audioContext = new AudioContext();

        this.track = this.audioContext.createMediaElementSource(this.audio);

        this.gainNode = this.audioContext.createGain();
        this.track
          .connect(this.gainNode)
          .connect(this.audioContext.destination);

        this.target.append(() => this.audio);

        this.message = document.createElement("p");

        this.message.innerHTML = this.formatMessage(
          getLocalizationManager().getDisplayName("header_message_1"),
          getLocalizationManager().getDisplayName("body_message_1")
        );

        this.target.append(() => this.message);
      }
    } catch (e) {
      this.visualUpdateOptions.host.displayWarningIcon(
        getLocalizationManager().getDisplayName("generic_construction_error_hero"),
        getLocalizationManager().getDisplayName("generic_construction_error"),
      );
    }
  }



  public update(options: VisualUpdateOptions) {
    try {
      this.formattingSettings =
        this.formattingSettingsService.populateFormattingSettingsModel(
          VisualFormattingSettingsModel,
          options.dataViews[0],
        );

      var volume: number = parseFloat(
        options.dataViews[0].single.value.toString(),
      );

      if (volume >= 100) {
        volume = 100;
      }

      if (volume > 10) {
        this.message.innerHTML = this.formatMessage(
          getLocalizationManager().getDisplayName("header_message_2"),
          getLocalizationManager().getDisplayName("body_message_2")
        )
      }

      //use linear mapping to adjust the volume to a range between 0 and 2
      this.gainNode.gain.value = volume * 0.02;

      this.play();

    } catch (e) {
      this.visualUpdateOptions.host.displayWarningIcon(
        getLocalizationManager().getDisplayName("generic_runtime_error_header"),
        getLocalizationManager().getDisplayName("generic_runtime_error"),
      );
    }
  }


  public formatMessage(header,body){
    return `<div class="tooltip">
  <p>${header}</p>
  <p>${body}</p>
  <svg role="presentation" viewbox="0 0 12 16">
<filter id="shadow" color-interpolation-filters="sRGB">
  <feDropShadow dx="1" dy="0" stdDeviation="0.5" flood-opacity="0.6"/>
  </filter>
  <path d="M2 1L8 5L2 9" filter="url(#shadow)"/>
</svg>
</div>`
  }

  public play() {
    if (this.formattingSettings.audio_settings.audio_switch.value === false) {
      this.audioContext.suspend();
    } else {
      if (this.gainNode.gain.value === 0) {
        this.audioContext.suspend();
      } else if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      } else if (this.audioContext.state === "running") {
        this.audio.play()
      } else {
        this.audio.play();
      }
    }
  }

  /**
   * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
   * This method is called once every time we open properties pane or when the user edit any format property.
   */
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    const model = this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings,
    );

    return model;
  }
}
