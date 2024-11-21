import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  countryClicked = false;
  countryName = '';
  capitalCity = '';
  region = '';
  incomeLevel = '';
  longitude = '';
  latitude = '';
  svgContent: SafeHtml | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadSvg();
  }

  // Load the SVG and sanitize it
  loadSvg(): void {
    const svgPath = 'assets/map-image.svg'; // Adjust the path as needed
    this.http.get(svgPath, { responseType: 'text' }).subscribe({
      next: (svg) => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg); // Sanitize SVG
        setTimeout(() => this.addEventListenersToPaths(), 0); // Attach event listeners after rendering
      },
      error: (error) => console.error('Failed to load SVG:', error),
    });
  }

  // Add interactivity to the SVG paths
  addEventListenersToPaths(): void {
    const container = document.getElementById('svg-container'); // Ensure this matches your HTML
    if (container) {
      const paths = container.querySelectorAll('path');
      paths.forEach((path) => {
        path.addEventListener('click', (event) => this.mapPathClick(event));
        path.addEventListener('mouseover', (event) => this.mapPathHover(event));
        path.addEventListener('mouseout', (event) => this.mapPathLeave(event));
      });
      console.log('Event listeners added to SVG paths.');
    } else {
      console.error('SVG container not found.');
    }
  }

  // Handle path click
  mapPathClick(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target && target.id) {
      const countryCode = target.id; // Use the path ID as the country code
      const countryName = target.getAttribute('name'); // Retrieve the 'name' attribute
      console.log(`Country clicked: ${countryName} (${countryCode})`);
      this.fetchCountryDetails(countryCode);
      this.countryClicked = true;
      this.countryName = countryName || 'Unknown'; // Set country name
    }
  }

  // Handle path hover
  mapPathHover(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target) {
      target.style.fill = 'orange'; // Highlight the path
      console.log(`Hovered over: ${target.getAttribute('name')}`);
    }
  }

  // Handle path mouse leave
  mapPathLeave(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target) {
      target.style.fill = ''; // Reset path fill
      console.log(`Mouse left: ${target.getAttribute('name')}`);
    }
  }

  // Fetch country details from the World Bank API
  fetchCountryDetails(countryCode: string): void {
    const apiUrl = `https://api.worldbank.org/v2/country/${countryCode}?format=json`;

    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Log API response for debugging
        if (response && response[1] && response[1][0]) {
          const countryData = response[1][0];
          this.countryName = countryData.name || 'Unknown';
          this.capitalCity = countryData.capitalCity || 'Unknown';
          this.region = countryData.region?.value || 'Unknown';
          this.incomeLevel = countryData.incomeLevel?.value || 'Unknown';
          this.longitude = countryData.longitude || 'Unknown';
          this.latitude = countryData.latitude || 'Unknown';
        } else {
          console.error('No data found for country:', countryCode);
        }
      },
      error: (err) => console.error('Error fetching country details:', err),
    });
  }
}