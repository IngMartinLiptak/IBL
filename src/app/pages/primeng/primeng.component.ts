import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';


@Component({
  selector: 'app-primeng',
  imports: [FormsModule, AutoCompleteModule],
  templateUrl: './primeng.component.html',
  styleUrl: './primeng.component.css'
})
export class PrimengComponent {
  allCountries: string[] = ["aaa asbadaksd", "bbbbbas jhasdb kasjd"];
  selectedCountries: any[] = [];
  suggestionsCountries: string[] = [];

  allAirports: string[] = ["xxx asbadaksd", "zzzzz jhasdb kasjd"];
  selectedAirports: any[] = [];
  suggestionsAirports: string[] = [];

  searchAirports(event: any) {
      const query = event.query.toLowerCase();
      this.suggestionsAirports = this.allAirports.filter(item => item.toLowerCase().startsWith(query) && !this.selectedAirports.includes(item));
  }

  searchCountries(event: any) {
      const query = event.query.toLowerCase();
      this.suggestionsCountries = this.allCountries.filter(item => item.toLowerCase().startsWith(query) && !this.selectedCountries.includes(item));
  }


  onKeydownAirports(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const val = event.key.length === 1 ? (input.value+event.key).trim().toLowerCase() : input.value.trim().toLowerCase();

    this.suggestionsAirports = val == "" ? [] : this.allAirports.filter(item => item.toLowerCase().startsWith(val) && !this.selectedAirports.includes(item));

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

    this.suggestionsCountries = val == "" ? [] : this.allCountries.filter(item => item.toLowerCase().startsWith(val) && !this.selectedCountries.includes(item));

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
