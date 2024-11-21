import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = 'https://api.worldbank.org/v2';

  constructor(private http: HttpClient) {}

  // Method to fetch country details using country code
  getCountryDetails(countryCode: string): Observable<any> {
    const url = `${this.baseUrl}/country/${countryCode}?format=json`;
    return this.http.get<any>(url);
  }
}