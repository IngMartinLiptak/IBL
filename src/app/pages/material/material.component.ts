import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiServiceService } from '../../services/api-service.service';
import { DataServiceService } from '../../services/data-service.service';

@Component({
  selector: 'app-material',
  imports: [CommonModule,RouterModule, FormsModule, MatFormFieldModule, MatChipsModule, MatIconModule,MatAutocompleteModule, ReactiveFormsModule, MatCheckboxModule, MatTableModule, MatCardModule ],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export class MaterialComponent implements OnInit {
  messageTypesMap: { [key: string]: boolean } = {
    METAR: false,
    SIGMET: false,
    TAF_LONGTAF: false
  };

  separatorKeysCodes: number[] = [];

  selectedCountries: any[] = [];
  suggestionsCountries: string[] = [];

  selectedAirports: any[] = [];
  suggestionsAirports: string[] = [];

  tableData: any = null;
  errorMessage: string = "";

  constructor(public dataService: DataServiceService, public apiService: ApiServiceService) { }

  ngOnInit() { 
    this.tableData = null; 
  }

  onInputAirports(event: Event) 
  {
    const input = event.target as HTMLInputElement;
    const val = input.value.trim().toLowerCase();

    this.suggestionsAirports = val == "" ? [] : this.dataService.allAirports.filter(item => item.toLowerCase().startsWith(val) && !this.selectedAirports.includes(item));

    input.value = input.value.trim().toUpperCase();
  }

  onKeydownAirports(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const val = event.key.length === 1 ? (input.value+event.key).trim().toLowerCase() : input.value.trim().toLowerCase();

    let suggestionsAirports = val == "" ? [] : this.dataService.allAirports.filter(item => item.toLowerCase().startsWith(val) && !this.selectedAirports.includes(item));

    if(suggestionsAirports.length == 0)
    {
      event.preventDefault();
      return;
    }

    if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
    {
      event.preventDefault();

      if (suggestionsAirports.length == 1 && !this.selectedAirports.includes(suggestionsAirports[0])) 
      {
        this.selectedAirports.push(suggestionsAirports[0]);
        input.value = "";
        this.suggestionsAirports = [];
      }
    }

  }

  addAirportFromInput(event: any) {
    this.selectedAirports.push(event.value);
    event.chipInput.clear();
    this.suggestionsAirports = [];
  }

  removeAirport(airport: any) {
    const index = this.selectedAirports.indexOf(airport);
    if (index >= 0) 
      this.selectedAirports.splice(index, 1);
  }

  editAirport(airport: any, event:any) {  }

  onSelectAirport(event: MatAutocompleteSelectedEvent, inputElement: HTMLInputElement): void {
    inputElement.value = event.option.value;
    this.addAirportFromInput({ value: event.option.value, chipInput: { clear: () => inputElement.value = "" }});
  }

  getAirport(icao:string)
  {
    return this.dataService.allAirportsMap[icao];
  }

  getAirportTitle(icao:string)
  {
    return Object.entries(this.dataService.allAirportsMap[icao])
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
  }

  onInputCountries(event: Event) 
  {
    const input = event.target as HTMLInputElement;
    const val = input.value.trim().toLowerCase();

    this.suggestionsCountries = val == "" ? [] : this.dataService.allCountries.filter(item => item.toLowerCase().startsWith(val) && !this.selectedCountries.includes(item));

    input.value = input.value.trim().toUpperCase();
  }

  onKeydownCountries(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const val = event.key.length === 1 ? (input.value+event.key).trim().toLowerCase() : input.value.trim().toLowerCase();

    let suggestionsCountries = val == "" ? [] : this.dataService.allCountries.filter(item => item.toLowerCase().startsWith(val) && !this.selectedCountries.includes(item));

    if(suggestionsCountries.length == 0)
    {
      event.preventDefault();
      return;
    }

    if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
    {
      event.preventDefault();

      if (suggestionsCountries.length == 1 && !this.selectedCountries.includes(suggestionsCountries[0])) 
      {
        this.selectedCountries.push(suggestionsCountries[0]);
        input.value = "";
        this.suggestionsCountries = [];
      }
    }

  }

  addCountryFromInput(event: any) {
    this.selectedCountries.push(event.value);
    event.chipInput.clear();
    this.suggestionsCountries = [];
  }

  removeCountry(Country: any) {
    const index = this.selectedCountries.indexOf(Country);
    if (index >= 0) 
      this.selectedCountries.splice(index, 1);
  }

  editCountry(Country: any, event:any) {  }

  onSelectCountry(event: MatAutocompleteSelectedEvent, inputElement: HTMLInputElement): void {
    inputElement.value = event.option.value;
    this.addCountryFromInput({ value: event.option.value, chipInput: { clear: () => inputElement.value = "" }});
  }

  getCountry(icao:string)
  {
    return this.dataService.allCountriesMap[icao];
  }

  getCountryTitle(wmo:string)
  {
    return Object.entries(this.dataService.allCountriesMap[wmo])
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
  }

  UpdateTable()
  {
    this.errorMessage = "";

    let reqRPC = {
      "id": "query" + Date.now(),
      "method": "query",
      "params": [
        {
          "id": "briefing02", 
          "reportTypes": Object.entries(this.messageTypesMap).filter(([_, checked]) => checked).map(([type]) => type),
          "stations":this.selectedAirports,
          "countries": this.selectedCountries
        }
      ]
    };

    this.apiService.PostData(reqRPC).subscribe(response => {
      console.log("API response: ", response);
      if(response.error == null)
      {
        this.errorMessage = "";
        response.result.forEach((r:any) => r.textCustomHTML = this.dataService.GetCustomHTML(r.text));

        this.tableData = response.result.reduce((acc: Record<string, typeof response.result>, item: any) => {
          if (!acc[item.stationId]) 
            acc[item.stationId] = [];
          acc[item.stationId].push(item);
          return acc;
        }, {} as Record<string, typeof response.result>);
      }
      else
        this.errorMessage = "API Error:\n" + JSON.stringify(response.error);  
    },
    error => {
      console.error("API Error:", error);
      this.errorMessage = "API Error:\n" + JSON.stringify(error);
    });
  }
}
