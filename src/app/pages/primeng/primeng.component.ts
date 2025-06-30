import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Checkbox } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ApiServiceService } from '../../services/api-service.service';
import { DataServiceService } from '../../services/data-service.service';
@Component({
  selector: 'app-primeng',
  imports: [CommonModule, FormsModule, AutoCompleteModule, TableModule, Checkbox],
  templateUrl: './primeng.component.html',
  styleUrl: './primeng.component.css'
})

export class PrimengComponent implements OnInit, AfterViewInit {
  messageTypes: string[] = [];
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

  //Ugly, but quickiest way... why? = primeNG bug - autocomplete does not have pTemplate="selectedItems"
  ngAfterViewInit() {
    const autocompleteAirports = document.querySelector('p-autocomplete[inputid="Airports"]');
    if (autocompleteAirports) {
      const observer = new MutationObserver(() => {
        autocompleteAirports.querySelectorAll('p-chip[aria-label], .p-autocomplete-option').forEach((chip) => {
          const label = chip.getAttribute('aria-label');
          if (label && !chip.hasAttribute('title')) {
            const title = Object.entries(this.dataService.allAirportsMap[label])
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n');
            chip.setAttribute('title', title);
            chip.childNodes[0].textContent+=" (" + this.dataService.allAirportsMap[label].airport+")";
          }
        });
      });

      observer.observe(autocompleteAirports, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label']
      });
    }

    const autocompleteCountries = document.querySelector('p-autocomplete[inputid="Countries"]');
    if (autocompleteCountries) {
      const observer = new MutationObserver(() => {
        autocompleteCountries.querySelectorAll('p-chip[aria-label], .p-autocomplete-option').forEach((chip) => {
          const label = chip.getAttribute('aria-label');
          if (label && !chip.hasAttribute('title')) {
            const title = Object.entries(this.dataService.allCountriesMap[label])
                                .map(([key, value]) => `${key}: ${value}`)
                                .join('\n');
            chip.setAttribute('title', title);
            chip.childNodes[0].textContent+=" (" + this.dataService.allCountriesMap[label].country+")";
          }
        });
      });

      observer.observe(autocompleteCountries, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-label']
      });
    }
  }

  searchAirports(event: any) {
      const query = event.query.toLowerCase();
      this.suggestionsAirports = this.dataService.allAirports.filter(item => item.toLowerCase().startsWith(query) && !this.selectedAirports.includes(item));
  }

  searchCountries(event: any) {
      const query = event.query.toLowerCase();
      this.suggestionsCountries = this.dataService.allCountries.filter(item => item.toLowerCase().startsWith(query) && !this.selectedCountries.includes(item));
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
        this.selectedAirports = [...this.selectedAirports, suggestionsAirports[0]];
      }
    }
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
        this.selectedCountries = [...this.selectedCountries, suggestionsCountries[0]];
      }
    }
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
