import { Component } from '@angular/core';
import { MultiInputComponent } from "./multi-input/multi-input.component";
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-standard',
  imports: [MultiInputComponent],
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css'
})
export class StandardComponent {
  airports:any;
  countries:any;


  constructor(public dataService: DataServiceService) { 
    this.airports = dataService.allAirportsMap;
    this.countries = dataService.allCountriesMap;
  }
  
}
