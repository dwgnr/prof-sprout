import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HumidityComponent } from "~/app/chart/humidity/humidity.component";
import { MoistureComponent } from "~/app/chart/moisture/moisture.component";
import { TemperatureComponent } from "~/app/chart/temperature/temperature.component";
import { HelpComponent } from "~/app/help/help.component";
import { HistoryComponent } from "~/app/history/history.component";
import { PlantAddComponent } from "~/app/plant-add/plant-add.component";
import { PlantDetailComponent } from "~/app/plant-detail/plant-detail.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { HomeComponent } from "./home/home.component";
import { OverviewComponent } from "./overview/overview.component";

export const COMPONENTS = [HomeComponent, ConfigurationComponent, HistoryComponent,
    MoistureComponent, TemperatureComponent, HumidityComponent, HelpComponent,
    OverviewComponent, PlantAddComponent, PlantDetailComponent];

const routes: Routes = [
    { path: "", redirectTo: "/(homeTab:overview//configTab:configuration//historyTab:history)", pathMatch: "full" },
    { path: "overview", component: OverviewComponent, outlet: "homeTab" },
    { path: "addPlant", component: PlantAddComponent, outlet: "homeTab" },
    { path: "plantDetail", component: PlantDetailComponent, outlet: "homeTab" },
    { path: "plantDetail/:id", component: PlantDetailComponent, outlet: "homeTab"},
    { path: "home", component: HomeComponent, outlet: "homeTab" },
    { path: "configuration", component: ConfigurationComponent, outlet: "configTab" },
    { path: "history", component: HistoryComponent, outlet: "historyTab" },
    { path: "historyHumidity", component: HumidityComponent, outlet: "historyTab" },
    { path: "historyTemperature", component: TemperatureComponent, outlet: "historyTab" },
    { path: "historyMoisture", component: MoistureComponent, outlet: "historyTab" },
    { path: "configHelp", component: HelpComponent, outlet: "configTab" }

    // { path: "item/:id", component: ItemDetailComponent, outlet: "homeTab" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
