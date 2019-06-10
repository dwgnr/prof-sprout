import { Component, OnInit } from "@angular/core";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { alert } from "../../../node_modules/tns-core-modules/ui/dialogs";

const plantSpecies = ["Sansevieria", "Elefantenfuß", "Efeutute", "Gummibaum", "Mimose",
    "Schusterpalme", "Drachenbaum", "Ufopflanze", "Sukkulente", "Kaktus", "Palme"];

const plantAges = ["Jung", "Baby", "Mittelalt", "Alt", "Steinalt"];

const imageURLs = [
    "res://plants/Pflanze_1.png",
    "res://plants/Pflanze_2.png",
    "res://plants/Pflanze_3.png",
    "res://plants/Pflanze_4.png",
    "res://plants/Pflanze_5.png"
];

@Component({
  selector: "ns-plant-add",
  templateUrl: "./plant-add.component.html",
  styleUrls: ["./plant-add.component.css"],
  moduleId: module.id
})
export class PlantAddComponent implements OnInit {

  age: string = "";
  name: string = "";
  kind: string = "";

  species: Array<string> = [];
  ages: Array<string> = [];
  pickedSpecies: string;
  pickedAge: string;

  constructor() {
      for (const s of plantSpecies) {
          this.species.push(s);
      }

      for (const a of plantAges) {
          this.ages.push(a);
      }
  }

  ngOnInit() {
  }

  selectedIndexChanged(args) {
      const picker = <ListPicker>args.object;
      this.pickedSpecies = this.species[picker.selectedIndex];
    }

  selectedIndexChangedAge(args) {
        const picker = <ListPicker>args.object;
        this.pickedAge = this.ages[picker.selectedIndex];
    }

  savePlant() {
      if (this.name.length > 0) {
          alert("Hurra! Deine neue Pflanze " + this.name + " wurde hinzugefügt!");
      } else {
          alert("Etwas ist schiefgelaufen. Die Pflanze konnte nicht hinzugefügt werden.");
      }
    }

}
