import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DataServiceService } from '../../services/data-service.service';
@Component({
  selector: 'app-primeng',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './primeng.component.html',
  styleUrl: './primeng.component.css'
})

export class PrimengComponent implements AfterViewInit {
  selectedCountries: any[] = [];
  suggestionsCountries: string[] = [];

  selectedAirports: any[] = [];
  suggestionsAirports: string[] = [];

  constructor(public dataService: DataServiceService) { }

  //Ugly, but quickiest way... why? : primeNG bug - autocomplete does not have pTemplate="selectedItems"
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

    this.suggestionsAirports = val == "" ? [] : this.dataService.allAirports.filter(item => item.toLowerCase().startsWith(val) && !this.selectedAirports.includes(item));

    if(this.suggestionsAirports.length == 0)
    {
      event.preventDefault();
      return;
    }

    if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
    {
      event.preventDefault();

      if (!this.selectedAirports.includes(this.suggestionsAirports[0])) 
      {
        this.selectedAirports = [...this.selectedAirports, this.suggestionsAirports[0]];
        this.suggestionsAirports = [];
      }
    }
  }

  onKeydownCountries(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const val = event.key.length === 1 ? (input.value+event.key).trim().toLowerCase() : input.value.trim().toLowerCase();

    this.suggestionsCountries = val == "" ? [] : this.dataService.allCountries.filter(item => item.toLowerCase().startsWith(val) && !this.selectedCountries.includes(item));

    if(this.suggestionsCountries.length == 0)
    {
      event.preventDefault();
      return;
    }

    if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
    {
      event.preventDefault();

      if (!this.selectedCountries.includes(this.suggestionsCountries[0])) 
      {
        this.selectedCountries = [...this.selectedCountries, this.suggestionsCountries[0]];
        this.suggestionsCountries = [];
      }
    }
  }
}
