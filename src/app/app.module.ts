import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { NgChartsModule } from 'ng2-charts';
import { LabelComponent } from './components/label/label.component';
import { TitleComponent } from './components/title/title.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, CountryDetailComponent, LabelComponent, TitleComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
