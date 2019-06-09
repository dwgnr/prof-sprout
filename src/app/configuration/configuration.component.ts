import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as appSettings from "application-settings";
import { alert } from "ui/dialogs";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { IBasicPost } from "~/app/models/basicPost.model";
import { action } from "../../../node_modules/tns-core-modules/ui/dialogs";

@Component({
  selector: "ns-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
  moduleId: module.id
})
export class ConfigurationComponent implements OnInit {

    aiokey: string = "";
    aiouser: string = "";

    // humidityThreshold: string = "";
    humidityThresholdNum: number = 0;
    autoWatering: boolean = false;

    isError = false;
    errorMessage = "";

    constructor(private dataService: DataService, private errorService: ErrorService, private router: Router) {
    }

    ngOnInit(): void {

        // TODO: Maybe pull current settings from adafruit as well

        this.errorService.currentMessage.subscribe((message) => this.errorMessage = message);

        this.aiouser = appSettings.getString("aiouserString", "");
        this.aiokey = appSettings.getString("aiokeyString", "");
        const num = appSettings.getNumber("threshNumber", 0);
        // this.humidityThreshold = num === 0 ? "" : num.toString();
        this.humidityThresholdNum = num;
        this.autoWatering = appSettings.getBoolean("autoWaterBoolean", false);

    }

    handleError(error: any) {
        this.isError = true;
        this.errorService.handleError(error);
    }

    saveConfig() {
        this.isError = false;
        appSettings.setString("aiouserString", this.aiouser);
        appSettings.setString("aiokeyString", this.aiokey);
        appSettings.setBoolean("autoWaterBoolean", this.autoWatering);
        // if (!isNaN(parseFloat(this.humidityThreshold))) {
        //     appSettings.setNumber("threshNumber", parseFloat(this.humidityThreshold));
        // }

        if (!isNaN(this.humidityThresholdNum)) {
            appSettings.setNumber("threshNumber", this.humidityThresholdNum);
        }

        alert("Konfiguration gespeichert!");

        if (this.autoWatering) {
            const val: IBasicPost = { value: "Auto"};
            this.dataService.setWaterSwitch(val).subscribe(() => console.log("Setting WaterSwitch Parameter"),
                (error) => this.handleError(error),
                () => console.log("Set WaterSwitch Parameter " + JSON.stringify(val)));
        } else {
            const val: IBasicPost = { value: "OFF"};
            this.dataService.setWaterSwitch(val).subscribe(() => console.log("Setting WaterSwitch Parameter"),
                (error) => this.handleError(error),
                () => console.log("Set WaterSwitch Parameter " + JSON.stringify(val)));
        }

        // const thresh: IBasicPost = { value: parseInt(this.humidityThreshold, 10).toString()};
        const thresh: IBasicPost = { value: this.humidityThresholdNum.toString()};
        this.dataService.setWaterThresholdLevel(thresh).subscribe(() => console.log("Setting Threshold Parameter"),
            (error) => this.handleError(error),
            () => console.log("Set Threshold Parameter " + JSON.stringify(thresh)));

    }

    action() {
        action({
            message: "Sollen wirklich alle Einstellungen entfernt werden?",
            cancelButtonText: "Abbrechen",
            actions: ["Ja"]
        }).then((result) => {
            if (result === "Ja") {
                console.log("Manual Water Action!");
                this.removeAll();
            }});
    }

    selectHelp() {
        this.router.navigate([{
            outlets: {
                configTab: ["configHelp"]
            }
        }]);
    }

    removeAll() {

        appSettings.clear();
        this.aiouser = "";
        this.aiokey = "";
        this.autoWatering = false;
        // this.humidityThreshold = "0";
        this.humidityThresholdNum = 0;
        this.isError = false;

        alert("Alle Einstellungen wurden entfernt!");
    }

}
