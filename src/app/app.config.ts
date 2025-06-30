import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { DataServiceService } from './services/data-service.service';

function loadICAO(http: HttpClient, dataService: DataServiceService): () => Promise<void> {
  return () => {
    // downloaded from: https://github.com/ip2location/ip2location-iata-icao/blob/master/iata-icao.csv
    return http.get('data/iata-icao.csv', { responseType: 'text' }).toPromise().then(csvText => {
      const lines = csvText!.split('\n').map(line => line.trim()).filter(l => l.length > 0);
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

      const json = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim().replace(/^"|"$/g, '');
        });
        return obj;
      });
      dataService.csvAirportsData = json;
      dataService.allAirports = json.map(item => item.icao).filter(icao => icao && icao.length === 4).sort(); 
      json.forEach(item => dataService.allAirportsMap[item.icao]=item);
    });
  };
}

function loadWMO(http: HttpClient, dataService: DataServiceService): () => Promise<void> {
  return () => {
    // downloaded from: https://github.com/ip2location/ip2location-iata-icao/blob/master/iata-icao.csv
    return http.get('data/wmo.csv', { responseType: 'text' }).toPromise().then(csvText => {
      const lines = csvText!.split('\n').map(line => line.trim()).filter(l => l.length > 0);
      const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));

      const json = lines.slice(1).map(line => {
        const values = line.split(';');
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim().replace(/^"|"$/g, '');
        });
        return obj;
      });
      dataService.csvCountriesData = json;
      dataService.allCountries = dataService.csvCountriesData.map(item => item.WMO).filter(who => who).sort();
      json.forEach(item => dataService.allCountriesMap[item.WMO]=item);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({theme: { preset: Aura }}),
    {
      provide: APP_INITIALIZER,
      useFactory: loadICAO,
      deps: [HttpClient, DataServiceService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadWMO,
      deps: [HttpClient, DataServiceService],
      multi: true
    }

  ]
};
