import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import esri = __esri;
import { loadModules } from 'esri-loader';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor() { }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    loadModules([
      'esri/WebMap',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/tasks/Locator'
    ])
      .then(([EsriWebMap, EsriMapView, EsriSearch, Locator]) => {
        const mapProperties: esri.MapProperties = {
          basemap: 'dark-gray'
        };

        const map: esri.Map = new EsriWebMap({
          portalItem: {
            id: '8f1baa9422a941d4a02779aeb6716fa3' // waze map
          }
        });

        const mapViewProperties: esri.MapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: [-78.644257, 35.787743],
          zoom: 12,
          map: map
        };

        const mapView: esri.MapView = new EsriMapView(mapViewProperties);
        mapView.popup.dockEnabled = true;
        mapView.popup.dockOptions = {
          position: 'bottom-center',
          buttonEnabled: false,
          breakpoint: true
        };

        const locatorUrl = 'https://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/';

        // REF: https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html#sources
        const searchWidget: esri.widgetsSearch = new EsriSearch({
          view: mapView,
          sources:
            [
              {
                // locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
                locator: new Locator(locatorUrl),
                singleLineFieldName: 'SingleLine',
                outFields: ['*'],
                name: 'testname',
                localSearchOptions: {
                  minScale: 300000,
                  distance: 50000
                },
                placeholder: 'Search by address',
                resultSymbol: {
                  type: 'picture-marker',  // autocasts as new PictureMarkerSymbol()
                  url: this.basePath + '/images/search/search-symbol-32.png',
                  size: 24,
                  width: 24,
                  height: 24,
                  xoffset: 0,
                  yoffset: 0
                }
              }
            ]
        });

        // Add the search widget to the top left corner of the view
        mapView.ui.add(searchWidget, {
          position: 'top-right',
          index: 0
        });

        searchWidget.on('select-result', event => {
          console.log('select-result');
          // let feature = event.result.feature;
          console.log('event.result = ', event.result);
        });
      });
  }
}
