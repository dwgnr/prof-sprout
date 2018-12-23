import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/";
import "rxjs/add/operator/map";
import * as appSettings from "tns-core-modules/application-settings";
import { IBasicPost } from "~/app/models/basicPost.model";

// const httpOptions = {
//     headers: new HttpHeaders({
//         "X-AIO-Key": "f41cdde938b14b28937b2c52ed23fa62",
//         "Content-Type":  "application/json"
//     })
// };

const API_URL = "https://io.adafruit.com/api/v2/";

@Injectable({
    providedIn: "root"
})
export class DataService {

    aiokey: string = "";
    aiouser: string = "";

    humidityThreshold: string = "";
    autoWatering: boolean = false;

    headers = new HttpHeaders({"X-AIO-Key": "none", "Content-Type":  "application/json"});

    constructor(private http: HttpClient) {
        this.getConfig();
    }

    getConfig() {
        this.aiouser = appSettings.getString("aiouserString", "kein Wert gesetzt");
        this.aiokey = appSettings.getString("aiokeyString", "kein Wert gesetzt");
        const num = appSettings.getNumber("threshNumber", 0);
        this.humidityThreshold = num === 0 ? "" : num.toString();
        this.autoWatering = appSettings.getBoolean("autoWaterBoolean", false);

        // console.log(".... DATASERVICE got user: "
        //     + appSettings.getString("aiouserString") + " with key: " + appSettings.getString("aiokeyString"));

        this.headers =  new HttpHeaders({
                "X-AIO-Key": this.aiokey,
                "Content-Type":  "application/json"
            });

    }

    getHumidity(startTime: string, endTime: string, resolution: string, hours: string): Observable<any> {
        this.getConfig();
        let params = new HttpParams();
        if (startTime && startTime.length > 0) {
            params = params.set("start_time", startTime);
        }
        if (endTime && endTime.length > 0) {
            params = params.set("end_time", endTime);
        }
        if (resolution && resolution.length > 0) {
            params = params.set("resolution", resolution);
        }
        if (hours && hours.length > 0) {
            params = params.set("hours", hours);
        }

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/humidity/data/chart",
            {headers: this.headers, params});
    }

    getSoilMoisture(startTime: string, endTime: string, resolution: string, hours: string): Observable<any> {
        this.getConfig();
        let params = new HttpParams();
        if (startTime && startTime.length > 0) {
            params = params.set("start_time", startTime);
        }
        if (endTime && endTime.length > 0) {
            params = params.set("end_time", endTime);
        }
        if (resolution && resolution.length > 0) {
            params = params.set("resolution", resolution);
        }
        if (hours && hours.length > 0) {
            params = params.set("hours", hours);
        }

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/moisture/data/chart",
            {headers: this.headers, params});
    }

    getTemperature(startTime: string, endTime: string, resolution: string, hours: string): Observable<any> {
        this.getConfig();
        let params = new HttpParams();
        if (startTime && startTime.length > 0) {
            params = params.set("start_time", startTime);
        }
        if (endTime && endTime.length > 0) {
            params = params.set("end_time", endTime);
        }
        if (resolution && resolution.length > 0) {
            params = params.set("resolution", resolution);
        }
        if (hours && hours.length > 0) {
            params = params.set("hours", hours);
        }

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/temperature/data/chart",
            {headers: this.headers, params});
    }

    getLastHumidity(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/humidity/data/last", {headers: this.headers});
    }

    getLastTemperature(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/temperature/data/last", {headers: this.headers});
    }

    getLastSoilMoisture(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/moisture/data/last", {headers: this.headers});
    }

    getWaterSwitch(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/waterswitch/data/last", {headers: this.headers});
    }

    setWaterSwitch(value: IBasicPost): Observable<any> {
        this.getConfig();

        return this.http.post<any>(API_URL + this.aiouser + "/feeds/waterswitch/data", value, {headers: this.headers});
    }

    getManualWaterSwitch(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/manualwater/data/last", {headers: this.headers});
    }

    setManualWaterSwitch(value: IBasicPost): Observable<any> {
        this.getConfig();

        return this.http.post<any>(API_URL + this.aiouser + "/feeds/manualwater/data", value, {headers: this.headers});
    }

    getWaterThresholdLevel(): Observable<any> {
        this.getConfig();

        return this.http.get<any>(API_URL + this.aiouser + "/feeds/levels/data/last", {headers: this.headers});
    }

    setWaterThresholdLevel(value: IBasicPost): Observable<any> {
        this.getConfig();

        return this.http.post<any>(API_URL + this.aiouser + "/feeds/levels/data", value, {headers: this.headers});
    }
}
