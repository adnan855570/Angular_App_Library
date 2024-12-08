import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  // <-- Add this import
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule   // <-- Add this here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
