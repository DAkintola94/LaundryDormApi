import { Component } from '@angular/core';
import { Advice } from '../advice';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advice-list.component.html',
  styleUrl: './advice-list.component.css'
})
export class AdviceListComponent {

advices: Advice[] = [
  {posterId: 1,
  authorName: "Dennis",
  informationMessage: "Yall need some advice",
  emailAddress: "Deeznuts@gmail.com",
  date: new Date('2020-11-11'),
  categoryName: "Fiks" 
},

{posterId: 2,
  authorName: "Vilde",
  informationMessage: "Yall need some love",
  emailAddress: "Not deeznuts@gmail.com",
  date: new Date('2020-11-11'),
  categoryName: "Forbedring" 
},

{posterId: 3,
  authorName: "Veronica",
  informationMessage: "Art is cool",
  emailAddress: "art@gmail.com",
  date: new Date('2020-11-11'),
  categoryName: "ikke forbedring" 
},

];

}
