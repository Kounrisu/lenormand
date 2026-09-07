import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import * as L from 'leaflet';

// 5 rue de Tournon, 75006 Paris — Mlle Lenormand's shop and "cabinet" for ~40 years.
const SHOP_LAT = 48.8510851;
const SHOP_LNG = 2.3371944;

const shopIcon = L.icon({
  iconUrl: 'map/marker-icon.png',
  iconRetinaUrl: 'map/marker-icon-2x.png',
  shadowUrl: 'map/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-paris-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="paris-map" #mapEl></div>`,
  styles: [
    `
      .paris-map {
        width: 100%;
        height: 100%;
        border-radius: 10px;
      }
    `,
  ],
})
export class ParisMapComponent implements AfterViewInit, OnDestroy {
  private readonly mapEl = viewChild.required<ElementRef<HTMLDivElement>>('mapEl');
  private map?: L.Map;

  ngAfterViewInit(): void {
    const map = L.map(this.mapEl().nativeElement, {
      center: [SHOP_LAT, SHOP_LNG],
      zoom: 16,
      scrollWheelZoom: false,
    });
    this.map = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker([SHOP_LAT, SHOP_LNG], { icon: shopIcon })
      .addTo(map)
      .bindPopup('5 rue de Tournon<br>Her shop and "cabinet", for about forty years.');
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
