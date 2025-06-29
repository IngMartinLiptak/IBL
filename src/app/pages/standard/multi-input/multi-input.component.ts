import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multi-input',
  imports: [CommonModule],
  templateUrl: './multi-input.component.html',
  styleUrl: './multi-input.component.css'
})
export class MultiInputComponent implements OnInit {
  @Input() placeholder:string = "Enter value";
  @Input() name:string = "name"; //parament name displayed in datalist
  @Input() suggestions:any = {}; //Map format
  @Output() selectedSuggestions = new EventEmitter<any>();
  id:string ="";

  selectedValues:any[] = [];
  filteredSuggestions: any;

  constructor(){};

  ngOnInit() { 
    this.id = "MultiInputComponent"+Date.now(); 
    this.filteredSuggestions = Object.assign({}, this.suggestions);
  }
  
  getValue(key:any): string {
    let val = this.suggestions?.[key]?.[this.name] ?? "";
    return val == "" ? "" : "(" + val + ")";
  }

  getTitle(name:any)
  {
    return Object.entries(this.suggestions[name])
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
  }

  //  onKeydown(event: KeyboardEvent) {
  //   const input = event.target as HTMLInputElement;
  //   const val = event.key.length === 1 ? (input.value+event.key).trim().toLowerCase() : input.value.trim().toLowerCase();

  //   let suggestions = val == "" ? [] : this.suggestions.map(x=>x[this.name]).filter((item: string) => item.toLowerCase().startsWith(val) && !this.selectedValues.includes(item));

  //   if(suggestions.length == 0)
  //   {
  //     event.preventDefault();
  //     return;
  //   }

  //   if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
  //   {
  //     event.preventDefault();

  //     if (suggestions.length == 1 && !this.selectedAirports.includes(suggestions[0])) 
  //     {
  //       this.selectedAirports = [...this.selectedAirports, suggestions[0]];
  //     }
  //   }
  // }
}
