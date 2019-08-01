import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";
import { ListViewEventData } from "nativescript-ui-listview";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { Plant } from "~/app/models/plant.model";
import * as plantsJSON from "../plants.json";

const moment = require("moment");

@Component({
  selector: "ns-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
  moduleId: module.id
})
export class OverviewComponent implements OnInit {

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

    states = ["😢", "😟", "😐", "😊", "😄"];

    ages = ["Jung", "Baby", "Mittelalt", "Alt", "Steinalt"];

    names = ["Alois", "Bertl", "Done", "Wastl", "Sepperl",
        "Hias", "Hilde", "Bärbl", "Kathl", "Lisbeth", "Susi", "Wally"];

    plantSpecies = ["Sansevieria", "Elefantenfuß", "Efeutute", "Gummibaum", "Mimose",
        "Schusterpalme", "Drachenbaum", "Ufopflanze", "Sukkulente", "Kaktus", "Palme"];

    images = [
        "res://plants/Pflanze_1.png",
        "res://plants/Pflanze_2.png",
        "res://plants/Pflanze_3.png",
        "res://plants/Pflanze_4.png",
        "res://plants/Pflanze_5.png"
    ];
    // private _isLoading: boolean = false;
    private _plants: Array<Plant> = [];

    constructor(private dataService: DataService, private errorService: ErrorService,
                private _routerExtensions: RouterExtensions) {

        moment.locale("de");
        // this._isLoading = true;
        // this._isLoading = false;
    }

    ngOnInit() {

        this.errorService.currentMessage.subscribe((message) => this.errorMessage = message);

        // this.dataService.createPlants(10)
        //     .then((data) => {
        //         console.log("CREATION!!!!");
        //         this._plants = data;
        //         console.log(JSON.stringify(this._plants));
        //     })
        //     .catch((error) => this.handleError(error));

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
            }).catch((error) => this.handleError(error));
    }

    loadPlantsFromJSON() {
        for (const p of plantsJSON.plants) {
            const r = this.createRecommendation();

            const plant = new Plant(p.id, p.name, this.lastTemperature, this.lastHumidity, this.lastMoisture,
                p.family, p.age, r.healthState, p.imageUrl, this.lastMoistureDate,
                this.lastHumidityDate, this.lastTemperatureDate,
                r.recommendation);

            this._plants.push(plant);
        }
    }

    createRecommendation() {
        if (this.lastMoisture < 10) {
            return {recommendation: 0, healthState: this.states[0]};
        }
        if (this.lastMoisture >= 10 && this.lastMoisture < 25) {
            return {recommendation: 1, healthState: this.states[2]};
        }
        if (this.lastMoisture >= 25 && this.lastMoisture < 40) {
            return {recommendation: 2, healthState: this.states[3]};
        }

        return {recommendation: 7, healthState: this.states[4]};
    }

    createPlantsRandom(N: number) {

        if (this.requestCompleteCount === 3) {
            for (let i = 0; i < N; i++) {

                const stateItem = this.states[Math.floor(Math.random() * this.states.length)];
                const img = this.images[Math.floor(Math.random() * this.images.length)];
                const species = this.plantSpecies[Math.floor(Math.random() * this.plantSpecies.length)];
                const age = this.ages[Math.floor(Math.random() * this.ages.length)];

                const p = new Plant(i, this.names[i],
                    this.lastTemperature, this.lastHumidity, this.lastMoisture,
                    species, age, stateItem, img,
                    this.lastMoistureDate, this.lastHumidityDate, this.lastTemperatureDate, 7);
                this._plants.push(p);
                console.log("");
                console.log(JSON.stringify(p));
            }
            console.log("CREATED PLANTS ARRAY WITH LENGTH: " + this._plants.length);
        }
    }

    reload() {
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

            this.loadPlantsFromJSON();
        }).catch((error) => this.handleError(error));
    }

    handleError(error: any) {
        this.isError = true;
        this.isBusy = false;
        this.errorService.handleError(error);
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

        // this._routerExtensions.navigate(["/Home", tappedPlantItem.id],
        //     {
        //         animated: true,
        //         transition: {
        //             name: "slide",
        //             duration: 200,
        //             curve: "ease"
        //         }
        //     });
    }

    onBackButtonTap(): void {
        this._routerExtensions.backToPreviousPage();
    }

    onAddButtonTap(): void {

        this._routerExtensions.navigate([{
                outlets: {
                    homeTab: ["addPlant"]
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

    get plants(): Array<Plant> {
        return this._plants;
    }

    // get isLoading(): boolean {
    //     return this._isLoading;
    // }

}
