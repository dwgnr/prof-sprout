import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular";
import { switchMap } from "rxjs/operators";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { IBasicPost } from "~/app/models/basicPost.model";
import { Plant } from "~/app/models/plant.model";
import { action, alert } from "../../../node_modules/tns-core-modules/ui/dialogs";
import * as plantsJSON from "../plants.json";
const moment = require("moment");

@Component({
  selector: "ns-plant-detail",
  templateUrl: "./plant-detail.component.html",
  styleUrls: ["./plant-detail.component.css"],
  moduleId: module.id
})
export class PlantDetailComponent implements OnInit {

    lastHumidity: any;
    lastTemperature: any;
    lastMoisture: any;
    lastHumidityDate: any;
    lastTemperatureDate: any;
    lastMoistureDate: any;

    isBusy = true;
    isError = false;
    requestCompleteCount = 0;
    errorMessage = "";
    plant: Plant;
    recommendations = [];
    _recommend: any;

    constructor(private _pageRoute: PageRoute,
                private _routerExtensions: RouterExtensions,
                private errorService: ErrorService,
                private dataService: DataService) { }

    ngOnInit(): void {

        this.dataService.getAllData().then((data) => {

            // const p = this.plant;
            let tmp = this.parseValue(data.moisture);

            this.lastMoisture = tmp.value;
            this.lastMoistureDate = tmp.created_at;

            tmp = this.parseValue(data.humidity);
            this.lastHumidity = tmp.value;
            this.lastHumidityDate = tmp.created_at;

            tmp = this.parseValue(data.temperature);
            this.lastTemperature = tmp.value;
            this.lastTemperatureDate = tmp.created_at;
            console.log("INIT LAST TEMPERATURE " + this.lastTemperature + " " + this.lastTemperatureDate);
        }).catch((error) => this.handleError(error));

        this.loadRecommendationsFromJSON();
        this._pageRoute.activatedRoute
            .pipe(switchMap((activatedRoute) => activatedRoute.queryParams))
            .forEach((params: Plant) => {
                console.log("++++++++++++++ QUERY PARAMS ++++++++++++");
                console.log(JSON.stringify(params));
                this.plant = params;
            });

        if (Number(this.plant.recommendation) === 7) {
            this._recommend = {reco: this.recommendations[7], color: "#7bc043"};
        } else {
            this._recommend = {reco: this.recommendations[this.plant.recommendation], color: "#ee4035"};
        }
    }

    loadRecommendationsFromJSON() {
        for (const r of plantsJSON.recommendations) {
            this.recommendations.push(r);
        }
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

          // const p = this.plant;
          let tmp = this.parseValue(data.moisture);

          this.lastMoisture = tmp.value;
          this.lastMoistureDate = tmp.created_at;

          tmp = this.parseValue(data.humidity);
          this.lastHumidity = tmp.value;
          this.lastHumidityDate = tmp.created_at;

          tmp = this.parseValue(data.temperature);
          this.lastTemperature = tmp.value;
          this.lastTemperatureDate = tmp.created_at;
          console.log("RELOAD LAST TEMPERATURE " + this.lastTemperature + " " + this.lastTemperatureDate);

          // const plant = new Plant(this.plant.id, p.name, this.lastTemperature, this.lastHumidity, this.lastMoisture,
          //       p.family, p.age, p.healthState, p.imageUrl, this.lastMoistureDate,
          //       this.lastHumidityDate, this.lastTemperatureDate,
          //       p.recommendation);

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

    // get plant(): any {
    //     return this._plant;
    // }
    //
    // set plant(newPlant: Plant) {
    //         this._plant = newPlant;
    // }

    get recommend(): any {
        return this._recommend;
    }

}
