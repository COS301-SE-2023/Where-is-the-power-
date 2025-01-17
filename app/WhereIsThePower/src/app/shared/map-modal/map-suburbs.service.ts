import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapSuburbsService {
  apiUrl = 'https://witpa.codelog.co.za/api/fetchMapData'

  body = {
    "bottomLeft": [-90, -180],
    "topRight": [90, 180]
  }

  gettingDirections = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) { }

  getSuburbData() {
    return this.httpClient.post(this.apiUrl, this.body);
  }

  fetchTimeForPolygon(suburbId: number) {
    const url = `https://witpa.codelog.co.za/api/fetchTimeForPolygon`;
    const requestBody = { suburbId };

    return this.httpClient.post(url, requestBody);
  }

  fetchOptimalRoute(originLon: number, originLat: number, destinationLon: number, destinationLat: number) {
    const url = `https://witpa.codelog.co.za/api/ai/info`;
console.log(originLon, originLat, destinationLon, destinationLat);

    const requestBody =
    {
      "origin": [
        originLon,
        originLat     
       ],
      "destination": [
        destinationLon,
        destinationLat
      ]
    };

    return this.httpClient.post(url, requestBody);
  }
}
