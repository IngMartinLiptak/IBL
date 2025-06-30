import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ApiServiceService } from '../../services/api-service.service';
import { DataServiceService } from '../../services/data-service.service';
import { MultiInputComponent } from "./multi-input/multi-input.component";

@Component({
  selector: 'app-standard',
  imports: [CommonModule, MultiInputComponent],
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.css'
})
export class StandardComponent implements OnInit {
  messageTypes: string[] = [];
  airports:any;
  countries:any;

  selectedAirports:any[] = [];
  selectedCountries:any[] = [];

  tableData: any = null;
  errorMessage: string = "";

  constructor(public dataService: DataServiceService, public apiService: ApiServiceService) { 
    this.airports = Object.fromEntries(Object.entries(dataService.allAirportsMap).filter(([key, _]) => key.length === 4));
    this.countries = dataService.allCountriesMap;
  }

  ngOnInit() { 
    this.tableData = null; 
  }

  airportsChange(data:any)
  {
    this.selectedAirports = data;
  }
  
  countriesChange(data:any)
  {
    this.selectedCountries = data;
  }

  onCheckboxChange(value: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) 
      this.messageTypes.push(value);
    else 
      this.messageTypes = this.messageTypes.filter(v => v !== value);
  }

  GetDataValue(data:any):any[]
  {
    return data as any[];
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
          "reportTypes": this.messageTypes,
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
