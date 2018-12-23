import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs/";
import "rxjs/add/operator/map";

@Injectable({
    providedIn: "root"
})
export class ErrorService {

    private messageSource = new BehaviorSubject("No error");
    private _currentMessage = this.messageSource.asObservable();

    constructor() {
    }

    handleError(error: any) {

        console.log("++++ ERROR SERVICE: ", error);
        let message = String.fromCharCode(0xf071) + "\n\nMeh.\nEin unbekannter Fehler ist aufgetreten.";
        if (error.status === 404) {
            message = String.fromCharCode(0xf071) + "\n\nDer hinterlegte AIO Benutzername ist " +
                "ungültig.\nBitte überprüfe die Konfiguration der App.";
        }
        if (error.status === 401) {
            message = String.fromCharCode(0xf071) + "\n\nDer hinterlegte API Key ist " +
                "ungültig.\nBitte überprüfe die Konfiguration der App.";
        }
        if (error.status === 403) {
            message = String.fromCharCode(0xf071) + "\n\nFür diese Ressource fehlt die Zugriffsberechtigung.";
        }
        if (error.status === 500) {
            message = String.fromCharCode(0xf071) + "\n\nEin Serverfehler ist aufgetreten.";
        }

        this.messageSource.next(message);
    }

    get currentMessage(): Observable<string> {
        return this._currentMessage;
    }

}
