import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { device } from "platform";
import { DeviceType } from "ui/enums";

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
    // private route: ActivatedRoute;

    constructor(private router: Router) {}

    select(args) {
        this.selected = this.data[args.index];

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

    ngOnInit(): void {
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
}
