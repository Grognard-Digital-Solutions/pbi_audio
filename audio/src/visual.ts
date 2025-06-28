"use strict";

import * as d3 from "d3";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
  private target: d3.Selection<any, any, any, any>;
  private visualUpdateOptions: powerbi.extensibility.visual.VisualConstructorOptions;
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;

  constructor(options: powerbi.extensibility.visual.VisualConstructorOptions) {
    try {
      this.target = d3.select(options.element);
      this.visualUpdateOptions = options;
      this.formattingSettingsService = new FormattingSettingsService();
      if (document) {
        let audio = document.createElement("audio");
        audio.controls = true;

        let source = document.createElement("source");
        source.src = "https://grognard.ca/assets/data/output.wav";
        source.type = "audio/wav";

        audio.append(source);

        this.target.append(() => audio);
      }
    } catch (e) {
      console.log("Constructor error: ", e);
    }
    console.log("target: ", this.target);
  }

  public update(options: VisualUpdateOptions) { }

  /**
   * Returns properties pane formatting model content hierarchies, properties and latest formatting values, Then populate properties pane.
   * This method is called once every time we open properties pane or when the user edit any format property.
   */
  public getFormattingModel(): powerbi.visuals.FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings,
    );
  }
}
