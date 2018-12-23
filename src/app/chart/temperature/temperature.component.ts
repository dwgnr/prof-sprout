import { Component, OnInit } from "@angular/core";
import { DataService } from "~/app/core/data.service";
import { ErrorService } from "~/app/core/error.service";
import { action } from "../../../../node_modules/tns-core-modules/ui/dialogs";
const moment = require("moment");

@Component({
  selector: "ns-temperature",
  templateUrl: "./temperature.component.html",
  styleUrls: ["./temperature.component.css"],
  moduleId: module.id
})
export class TemperatureComponent implements OnInit {

    temperatureData: Array<any>;
    chartData: Array<any>;
    isBusy = true;
    minDate: any;
    maxDate: any;
    stepSize = "Day";
    displayDateFormat = "dd MMM";

    isError = false;
    errorMessage = "";

    startTime: string;
    endTime: string;
    // Resolution in minutes. Possible: 1, 5, 10, 30, 60, and 120.
    resolution = "60";
    // The number of hours the chart should cover.
    hours = "168";

    constructor(private dataService: DataService, private errorService: ErrorService) {
        moment.locale("de");
    }

    ngOnInit() {

        this.errorService.currentMessage.subscribe((message) => this.errorMessage = message);

        this.dataService.getTemperature(this.startTime, this.endTime, this.resolution, this.hours)
            .subscribe((result) => this.temperatureData = result.data,
                (error) => this.handleError(error),
                () => this.createChart()
            );
    }

    createChart() {

        this.chartData = [];

        for (const datum of this.temperatureData) {
            this.chartData.push({date: new Date(datum[0]), value: parseFloat(datum[1])});
        }
        if (this.chartData && this.chartData.length > 0) {
            this.minDate = this.chartData[0].date;
            this.maxDate = this.chartData[this.chartData.length - 1].date;
        }
        // console.log("MIN and MAX Date");
        // console.log(this.minDate);
        // console.log(this.maxDate);
        // console.log("CHART DATA: " + JSON.stringify(this.chartData));
        this.isBusy = false;
        this.isError = false;
    }

    parseDate(mom, format= "DD MMM HH:MM") {
        if (mom) {
            return moment(mom).format(format);
        } else {
            console.log("Unable to parse date " + String(mom));

            return mom;
        }
    }

    handleError(error: any) {
        this.isError = true;
        this.isBusy = false;
        this.errorService.handleError(error);
    }

    reload() {

        this.isBusy = true;
        this.isError = false;

        this.dataService.getTemperature(this.startTime, this.endTime, this.resolution, this.hours)
            .subscribe((result) => this.temperatureData = result,
                (error) => this.handleError(error),
                () => this.createChart()
            );

    }

    action() {
        action({
            message: "Zeitraum auswählen...",
            cancelButtonText: "Abbrechen",
            actions: ["1 Stunde", "24 Stunden", "48 Stunden", "1 Woche", "2 Wochen"]
        }).then((result) => {
            if (result === "1 Stunde") {
                console.log("Selected 1 hour");
                this.onChartChange("Minute", "HH:mm", "5", "1");

            }
            if (result === "24 Stunden") {
                console.log("Selected 24 hours");
                this.onChartChange("Hour", "HH:mm", "10", "24");

            }
            if (result === "48 Stunden") {
                console.log("Selected 48 Stunden");
                this.onChartChange("Hour", "dd MMM HH:mm", "30", "48");
            }
            if (result === "1 Woche") {
                console.log("Selected 1 Week");
                this.onChartChange("Day", "dd MMM", "60", "168");

            }
            if (result === "2 Wochen") {
                console.log("Selected 2 Weeks");
                this.onChartChange("Day", "dd MMM", "120", "336");
            }});
    }

    onChartChange(stepSize, displayDateFormat, resolution, hours) {
        this.isBusy = true;
        this.stepSize = stepSize;
        this.displayDateFormat = displayDateFormat;
        this.resolution = resolution;
        this.hours = hours;
        this.dataService.getTemperature(this.startTime, this.endTime, this.resolution, this.hours)
            .subscribe((r) => this.temperatureData = r.data,
                (error) => this.handleError(error),
                () => this.createChart()
            );
    }

}
