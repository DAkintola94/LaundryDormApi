import { RouterLink, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import {AdviceListComponent} from './advice-list/advice-list.component';
import {HomeMenuComponent} from './home-menu/home-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdviceListComponent, HomeMenuComponent, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'dorm-laundry';
}




