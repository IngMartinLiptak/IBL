import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-multi-input',
  imports: [CommonModule],
  templateUrl: './multi-input.component.html',
  styleUrl: './multi-input.component.css'
})
export class MultiInputComponent implements OnInit {
  @Input() placeholder:string = "Enter value";
  @Input() attributeName:string = "name"; //parament name displayed in datalist
  @Input() suggestions:any = {}; //Map format
  @Output() selected = new EventEmitter<any>();
  id:string ="";

  //suggestionsArray:string[] = [];
  selectedValues:any[] = [];
  filteredSuggestions: any;

  constructor(){};

  ngOnInit() { 
    this.id = "MultiInputComponent"+Date.now(); 
    this.filteredSuggestions = Object.assign({}, this.suggestions);
  }
  
  getValue(key:any): string {
    let val = this.suggestions?.[key]?.[this.attributeName] ?? "";
    return val == "" ? "" : "(" + val + ")";
  }

  getTitle(name:any)
  {
    return Object.entries(this.suggestions[name])
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
  }

   onKeydown(event: KeyboardEvent) 
   {
    const input = event.currentTarget as HTMLInputElement;
    if (event.key==null)
      return;

    if ((['Space', 'Enter'].includes(event.code) || [' ', 'Enter'].includes(event.key))) 
    {
      event.preventDefault();
      let filteredSuggestionsKeys = Object.keys(this.filteredSuggestions);
      if (filteredSuggestionsKeys.length == 1 && !this.selectedValues.includes(filteredSuggestionsKeys[0])) 
      {
        this.selectedValues.push(filteredSuggestionsKeys[0]);
        (event.currentTarget as HTMLInputElement).value="";
        this.filteredSuggestions = Object.assign({}, this.suggestions);

        this.selected.emit(this.selectedValues);
      }
    }
  }

  onInput(event: Event){
    const input = event.currentTarget as HTMLInputElement;

    let tmpSuggestions = Object.keys(this.suggestions)
                                    .filter(key => key.toLowerCase().startsWith(input.value.toLowerCase()))
                                    .reduce((acc, key) => {
                                      acc[key] = this.suggestions[key];
                                      return acc;
                                    }, {} as any);

    if(Object.keys(tmpSuggestions).length==0)                              
    {
      input.value = input.value.slice(0, -1);
      return
    }
    else
      this.filteredSuggestions = tmpSuggestions;
  }
}
