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
}
