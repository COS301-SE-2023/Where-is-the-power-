import {
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
declare let MapboxDirections: any;

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  constructor() { }
  map: any;
  ngOnInit() {
  }

  ngAfterViewInit() {
    (mapboxgl as any).accessToken = environment.MapboxApiKey;
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [28.261181, -25.771179], // starting position [lng, lat]
      zoom: 12 // starting zoom
    });

    this.map.on('load', () => {
      this.map.resize(); // Trigger map resize after the initial rendering
    });
    /*
        const geocoder = new MapboxGeocoder({
          // Initialize the geocoder
          accessToken: environment.MapboxApiKey, // Set the access token
          mapboxgl: mapboxgl, // Set the mapbox-gl instance
          marker: false, // Do not use the default marker style
          placeholder: 'Search for places', // Placeholder text for the search bar

        });*/

    // Add the geocoder to the map
    // this.map.addControl(geocoder);
    this.map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        exclude: 'point(28.278153 -25.781812),point(28.277781 -25.78166),point(28.276252 -25.781039),point(28.274805 -25.780169),point(28.271878 -25.778368),point(28.271868 -25.778362),point(28.271357 -25.780567),point(28.272005 -25.780674),point(28.272028 -25.780909),point(28.272131 -25.781988)'
      }),
      'top-left'
    );



  }
}

