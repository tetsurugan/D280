import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' }, // Redirect root URL to /map
  { path: 'map', component: MapComponent }, // Load the MapComponent when visiting /map
];