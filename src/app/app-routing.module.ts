import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HumidityComponent } from "~/app/chart/humidity/humidity.component";
import { MoistureComponent } from "~/app/chart/moisture/moisture.component";
import { TemperatureComponent } from "~/app/chart/temperature/temperature.component";
import { HelpComponent } from "~/app/help/help.component";
import { HistoryComponent } from "~/app/history/history.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { HomeComponent } from "./home/home.component";

export const COMPONENTS = [HomeComponent, ConfigurationComponent, HistoryComponent,
    MoistureComponent, TemperatureComponent, HumidityComponent, HelpComponent];

const routes: Routes = [
    { path: "", redirectTo: "/(homeTab:home//configTab:configuration//historyTab:history)", pathMatch: "full" },
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
