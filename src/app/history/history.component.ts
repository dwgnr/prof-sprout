import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { device } from "platform";
import { DeviceType } from "ui/enums";

import { RouterExtensions } from "nativescript-angular";
import { ListViewEventData } from "nativescript-ui-listview";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { Plant } from "~/app/models/plant.model";
import * as plantsJSON from "../plants.json";

const moment = require("moment");

@Component({
    selector: "ns-history",
    moduleId: module.id,
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.css"]
})
export class HistoryComponent implements OnInit {
    isTablet: boolean = device.deviceType === DeviceType.Tablet;
    data = [];
    selected = <any>{};

    lastHumidity: any;
    lastTemperature: any;
    lastMoisture: any;
    lastHumidityDate: any;
    lastTemperatureDate: any;
    lastMoistureDate: any;
    isBusy = true;
    isError = false;
    requestCompleteCount = 0;

    // private route: ActivatedRoute;

    private _plants: Array<Plant> = [];

    constructor(private router: Router, private errorService: ErrorService,
                private dataService: DataService,
                private _routerExtensions: RouterExtensions) {
        this.data.push({
            name: "Bodenfeuchtigkeit",
            path: "historyMoisture",
            src: String.fromCharCode(0xf06c)
        });
        this.data.push({
            name: "Raumtemperatur",
            path: "historyTemperature",
            src: String.fromCharCode(0xf2c9)
        });
        this.data.push({
            name: "Luftfeuchtigkeit",
            path: "historyHumidity",
            src: String.fromCharCode(0xf0c2)
        });
    }

    ngOnInit(): void {

        this.dataService.getAllData().then((data) => {
            let tmp = this.parseValue(data.moisture);

            this.lastMoisture = tmp.value;
            this.lastMoistureDate = tmp.created_at;

            tmp = this.parseValue(data.humidity);
            this.lastHumidity = tmp.value;
            this.lastHumidityDate = tmp.created_at;

            tmp = this.parseValue(data.temperature);
            this.lastTemperature = tmp.value;
            this.lastTemperatureDate = tmp.created_at;

            // this.createPlants(10);
            this.loadPlantsFromJSON();
            console.log("HISTORY INIT PlANTS ARRAY OF LENGTH: " + this._plants.length);
        }).catch((error) => this.handleError(error));

    }

    loadPlantsFromJSON() {
        for (const p of plantsJSON.plants) {
            const plant = new Plant(p.id, p.name, p.temperature, p.humidity, p.moisture,
                p.family, p.age, p.healthState, p.imageUrl, p.timeMoisture, p.timeHumidity, p.timeTemperature,
                p.recommendation);
            this._plants.push(plant);
        }
    }

    parseValue(data: any) {
        if (data && data.hasOwnProperty("value")) {
            data.value = parseFloat(data.value);
            console.log("Parsed: " + data.value);
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

    handleError(error: any) {
        this.isError = true;
        this.isBusy = false;
        this.errorService.handleError(error);
    }

    onPlantItemTap(args: ListViewEventData): void {
        const tappedPlantItem = args.view.bindingContext;
        const plant = this._plants[tappedPlantItem.id];

        this._routerExtensions.navigate([{
                outlets: {
                    homeTab: ["plantDetail", tappedPlantItem.id]
                }
            }],
            {
                queryParams: plant,
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    selectChart(args) {
        console.log("SELECTED: " + args);
        if (args === "moist") {
            this.selected = this.data[0];
        }
        if (args === "temp") {
            this.selected = this.data[1];
        }
        if (args === "hum") {
            this.selected = this.data[2];
        }

        // For phone users we need to navigate to another page to show the detail view.
        if (!this.isTablet) {
            // this.router.navigate(["/historyHumidity"], { relativeTo: this.route });

            this.router.navigate([{
                outlets: {
                    historyTab: [this.selected.path]
                }
            }]);
        }
    }

    get plants(): Array<Plant> {
        return this._plants;
    }
}
