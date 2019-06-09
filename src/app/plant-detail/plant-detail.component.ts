import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular";
import { switchMap } from "rxjs/operators";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { IBasicPost } from "~/app/models/basicPost.model";
import { Plant } from "~/app/models/plant.model";
import { action, alert } from "../../../node_modules/tns-core-modules/ui/dialogs";

const moment = require("moment");

@Component({
  selector: "ns-plant-detail",
  templateUrl: "./plant-detail.component.html",
  styleUrls: ["./plant-detail.component.css"],
  moduleId: module.id
})
export class PlantDetailComponent implements OnInit {

    // lastHumidity: any;
    // lastTemperature: any;
    // lastMoisture: any;
    isBusy = true;
    isError = false;
    requestCompleteCount = 0;
    errorMessage = "";
    _plant: Plant;

    constructor(private _pageRoute: PageRoute,
                private _routerExtensions: RouterExtensions,
                private errorService: ErrorService,
                private dataService: DataService) { }

    ngOnInit(): void {

        this._pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.queryParams))
            .forEach((params: Plant) => {
                console.log("++++++++++++++ QUERY PARAMS ++++++++++++");
                console.log(JSON.stringify(params));
                this._plant = params;
            });
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
            () =>         alert("💧 \n Die manuelle Bewässerung wurde angestoßen. " +
                "Es kann einige Sekunden dauern bis die Pflanze Wasser bekommt."));
    }

    reload() {
        this.isBusy = true;
        this.isError = false;
        this.requestCompleteCount = 0;

        this.dataService.getAllData().then((data) => {

          const p = this.plant;
          let tmp = this.parseValue(data.moisture);

          p.moisture = tmp.value;
          p.timeMoisture = tmp.created_at;

          tmp = this.parseValue(data.humidity);
          p.moisture = tmp.value;
          p.timeMoisture = tmp.created_at;

          tmp = this.parseValue(data.temperature);
          p.moisture = tmp.value;
          p.timeMoisture = tmp.created_at;

          this.plant = p;


        }).catch((error) => this.handleError(error));
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

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    onEditButtonTap(): void {

        this._routerExtensions.navigate([{
                outlets: {
                    configTab: ["configuration"]
                }
            }],
            {
                animated: true,
                transition: {
                    name: "slide",
                    duration: 200,
                    curve: "ease"
                }
            });

    }

    get plant(): Plant {
        return this._plant;
    }

    set plant(newPlant: Plant) {
            this._plant = newPlant;
    }

}
