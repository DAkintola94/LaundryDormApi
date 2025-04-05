import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home-menu',
  standalone: true,
  imports: [],
  templateUrl: './home-menu.component.html',
  styleUrl: './home-menu.component.css'
})
export class HomeMenuComponent implements AfterViewInit  {
  ngAfterViewInit() {
      this.setupMenuToggle();
  }

  setupMenuToggle(){
    const hamMenu = document.querySelector(".ham-menu");
    const offScreenMenu = document.querySelector(".off-screen-menu");

    if(hamMenu && offScreenMenu){
      hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle("active");
        offScreenMenu.classList.toggle("active");
      })

    }

  }

}
