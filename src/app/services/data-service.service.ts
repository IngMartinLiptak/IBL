import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  public csvAirportsData: any[] = [];
  public csvCountriesData: any[] = [];

  public allCountries: string[] = [];
  public allCountriesMap: any = {};

  public allAirports: string[] = [];
  public allAirportsMap: any = {};

  constructor() { }

  public GetCustomHTML(text:String){
    let html:String[]=[];
    
    text.split(" ").forEach((tag:string) => {
      if(tag.startsWith("BKN") || tag.startsWith("FEW") || tag.startsWith("SCT"))
        html.push(parseInt(tag.substring(3))>30 ? "<font color='red'>"+tag+"</font>" : "<font color='blue'>"+tag+"</font>");
      else
        html.push(tag);
    });    
    return html.join(" ");
  }
}
