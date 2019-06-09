import { Component, OnInit } from "@angular/core";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { alert } from "../../../node_modules/tns-core-modules/ui/dialogs";

const plantSpecies = ["Sansevieria", "Elefantenfuß", "Efeutute", "Gummibaum", "Mimose",
    "Schusterpalme", "Drachenbaum", "Ufopflanze", "Sukkulente", "Kaktus", "Palme"];

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
  picked: string;

  constructor() {
      for (const s of plantSpecies) {
          this.species.push(s);
      }
  }

  ngOnInit() {
  }

  selectedIndexChanged(args) {
      const picker = <ListPicker>args.object;
      this.picked = this.species[picker.selectedIndex];
    }

  savePlant() {
      if (this.name.length > 0) {
          alert("Hurra! Deine neue Pflanze " + this.name + " wurde hinzugefügt!");
      } else {
          alert("Etwas ist schiefgelaufen. Die Pflanze konnte nicht hinzugefügt werden.");
      }
    }

}
