import { Component, OnInit } from "@angular/core";
import * as appSettings from "tns-core-modules/application-settings";
import { isAndroid } from "tns-core-modules/platform";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

        if (!appSettings.getString("aiouserString")) {
            console.log("INIT: aiouserString not found ");
            appSettings.setString("aiouserString", "ascii_dinosaur");
        }
        if (!appSettings.getString("aiokeyString")) {
            console.log("INIT: aiokeyString not found ");
            appSettings.setString("aiokeyString", "f41cdde938b14b28937b2c52ed23fa62");
        }
        if (!appSettings.getNumber("threshNumber")) {
            console.log("INIT: threshNumber not found ");
            appSettings.setNumber("threshNumber", 0);
        }
        if (!appSettings.getBoolean("autoWaterBoolean")) {
            console.log("INIT: autoWaterBoolean not found ");
            appSettings.setBoolean("autoWaterBoolean", false);
        }
    }

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";

        return iconPrefix + icon;
    }

}
