import { Component, OnInit } from "@angular/core";
import * as utilsModule from "tns-core-modules/utils/utils";

@Component({
  selector: "ns-help",
  templateUrl: "./help.component.html",
  styleUrls: ["./help.component.css"],
  moduleId: module.id
})
export class HelpComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onTap() {
      utilsModule.openUrl("https://io.adafruit.com/");
  }

}
