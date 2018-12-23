import { Component, OnInit } from "@angular/core";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { IBasicPost } from "~/app/models/basicPost.model";
import { action, alert } from "../../../node_modules/tns-core-modules/ui/dialogs";
const moment = require("moment");

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    lastHumidity: any;
    lastTemperature: any;
    lastMoisture: any;
    isBusy = true;
    isError = false;
    requestCompleteCount = 0;
    errorMessage = "";

    constructor(private dataService: DataService, private errorService: ErrorService) {
        moment.locale("de");
    }

    ngOnInit(): void {

        this.errorService.currentMessage.subscribe((message) => this.errorMessage = message);

        this.dataService.getLastHumidity().subscribe((result) => this.lastHumidity = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastHumidity)
        );

        this.dataService.getLastTemperature().subscribe((result) => this.lastTemperature = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastTemperature)
        );

        this.dataService.getLastSoilMoisture().subscribe((result) => this.lastMoisture = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastMoisture)
        );

    }

    parseValue(data: any) {
        if (data && data.hasOwnProperty("value")) {
            data.value = parseFloat(data.value);
            // console.log("Parsed: " + data.value);
        } else {
            console.log("Unable to Parse: " + JSON.stringify(data));
        }
        if (data && data.hasOwnProperty("created_at")) {
            data.created_at = this.parseDate(data.created_at);
        }
        this.requestCompleteCount++;
        if (this.requestCompleteCount === 3) {
            this.isBusy = false;
            this.isError = false;
        }

        return data;
    }

    parseDate(mom, format= "DD MMM YYYY HH:mm") {
        if (mom) {
            return moment(mom).format(format);
        } else {
            console.log("Unable to parse date!");

            return mom;
        }
    }

    reload() {

        this.isBusy = true;
        this.isError = false;
        this.requestCompleteCount = 0;

        this.dataService.getLastHumidity().subscribe((result) => this.lastHumidity = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastHumidity)
        );

        this.dataService.getLastTemperature().subscribe((result) => this.lastTemperature = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastTemperature)
        );

        this.dataService.getLastSoilMoisture().subscribe((result) => this.lastMoisture = result,
            (error) => this.handleError(error),
            () => this.parseValue(this.lastMoisture)
        );
    }

    action() {
        action({
            message: "Jetzt gießen?",
            cancelButtonText: "Abbrechen",
            actions: ["Ja"]
        }).then((result) => {
            if (result === "Ja") {
                console.log("Manual Water Action!");
                this.waterManually();
            }});
    }

    handleError(error: any) {
        this.isError = true;
        this.isBusy = false;
        this.errorService.handleError(error);
    }

    waterManually() {

        const val: IBasicPost = { value: "On"};
        this.dataService.setManualWaterSwitch(val).subscribe(() =>
                console.log("Setting ManualWater Parameter" + JSON.stringify(val)),
            (error) => this.handleError(error),
            () =>         alert("Die manuelle Bewässerung wurde angestoßen. " +
                "Es kann einige Sekunden dauern bis die Pflanze Wasser bekommt."));
    }

}
