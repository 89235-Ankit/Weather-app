import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-app');

  city = "pune";
  temprature: number = 30;
  humidity: number = 100;
  url = "https://api.weatherapi.com/v1/forecast.json";
  key = 'b64ee6b58797469e9e783846261401';
  data = signal<any | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);



  // https://api.weatherapi.com/v1/current.json?q=pune&key=b64ee6b58797469e9e783846261401
  // http://api.weatherapi.com/v/current.json?q=pune&key=b64ee6b58797469e9e783846261401

  constructor(private http: HttpClient) {

    this.onSearch();

  }

  getAqiLabel(index: number): string {
  return [
    'Good',
    'Moderate',
    'Unhealthy (Sensitive)',
    'Unhealthy',
    'Very Unhealthy',
    'Hazardous'
  ][index - 1] ?? 'Unknown';
}

getAqiClass(index: number): string {
  return [
    'aqi-good',
    'aqi-moderate',
    'aqi-sensitive',
    'aqi-unhealthy',
    'aqi-very-unhealthy',
    'aqi-hazardous'
  ][index - 1] ?? '';
}



  onSearch() {
    console.log(this.city);
    let params = new HttpParams()
      .set('q', this.city)
      .set('key', this.key)
      .set('days', 1)
      .set('aqi', 'yes');



    this.http.get(this.url, { params }).subscribe({
      next: (res: any) => {
        this.data.set({ ...res });
        console.log(res)
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error?.message ?? 'Failed to fetch weather');
      }
    });



  }

  getWeatherClass(condition: string, localtime?: string): string {
  const c = condition.toLowerCase();
  const night = localtime && this.isNight(localtime);

  if (night) {
    return 'weather-night';
  }

  if (c.includes('sun') || c.includes('clear')) return 'weather-sunny';
  if (c.includes('cloud')) return 'weather-cloudy';
  if (c.includes('rain') || c.includes('drizzle')) return 'weather-rainy';
  if (c.includes('storm') || c.includes('thunder')) return 'weather-storm';
  if (c.includes('snow')) return 'weather-snow';

  return 'weather-default';
}

  getWeatherAnimation(condition: string): string {
  const c = condition.toLowerCase();

  if (c.includes('rain') || c.includes('drizzle')) {
    return 'rain';
  }

  if (c.includes('snow')) {
    return 'snow';
  }

  return '';
}

isNight(localtime: string): boolean {
  const hour = new Date(localtime).getHours();
  return hour >= 18 || hour < 6;
}

getUvClass(uv: number): string {
  if (uv < 3) return 'uv-low';
  if (uv < 6) return 'uv-moderate';
  if (uv < 8) return 'uv-high';
  return 'uv-very-high';
}


}

