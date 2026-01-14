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

    city ="pune";
    temprature:number=30;
    humidity:number=100;
    url = "https://api.weatherapi.com/v1/current.json";
    key = 'b64ee6b58797469e9e783846261401';
   data = signal<any | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);



  // https://api.weatherapi.com/v1/current.json?q=pune&key=b64ee6b58797469e9e783846261401
  // http://api.weatherapi.com/v/current.json?q=pune&key=b64ee6b58797469e9e783846261401

  constructor(private http:HttpClient){

    this.onSearch();

  }


    onSearch(){
    console.log(this.city);
    let params = new HttpParams()
    .set('q', this.city)
    .set('key', this.key);


   
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
  }}

