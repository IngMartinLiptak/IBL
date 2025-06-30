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
  @Input() attributeName:string = ""; //parament name in datalist
  @Input() attributeDisplayName:string = ""; //parament name displayed in () in datalist
  @Input() suggestions:any = {}; //Map format
  @Output() selected = new EventEmitter<any>();
  id:string =""; //Reference Input-Datalist

  selectedValues:any[] = [];
  filteredSuggestions: any[] = [];
  allFilteredSuggestions: any[] = [];

  constructor(){};

  ngOnInit() { 
    this.id = "MultiInputComponent"+Date.now(); 
    this.filteredSuggestions = this.getFilteredSuggestions("");
    this.allFilteredSuggestions = this.filteredSuggestions.slice();
  }

  getFilteredSuggestions(val:string)
  {
    return Object.values(this.suggestions)
                  .filter((x:any) => x[this.attributeName]?.startsWith(val) && !this.selectedValues.includes(x[this.attributeName] || ""))
                  .sort((a:any, b:any) => a[this.attributeName]?.localeCompare(b[this.attributeName] || ""));
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
      if (this.filteredSuggestions.length == 1 && !this.selectedValues.includes(this.filteredSuggestions[0][this.attributeName])) 
      {
        this.selectedValues.push(this.filteredSuggestions[0][this.attributeName]);
        (event.currentTarget as HTMLInputElement).value="";
        this.filteredSuggestions = this.allFilteredSuggestions.slice();

        this.selected.emit(this.selectedValues);
      }
    }
  }

  onInput(event: Event){
    const input = event.currentTarget as HTMLInputElement;

    let tmpSuggestions = this.getFilteredSuggestions(input.value.toUpperCase());

    if(tmpSuggestions.length==0)                              
    {
      input.value = input.value.slice(0, -1);
      return
    }
    else
      this.filteredSuggestions = tmpSuggestions;
  }
}
