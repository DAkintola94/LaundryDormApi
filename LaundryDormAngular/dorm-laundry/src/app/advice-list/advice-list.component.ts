import { Component, OnInit } from '@angular/core';
import { Advice } from '../advice';
import { CommonModule } from '@angular/common';
import { AdviceService } from '../advice.service';

@Component({
  selector: 'app-advice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advice-list.component.html',
  styleUrl: './advice-list.component.css'
})
export class AdviceListComponent implements OnInit{

  adviceArray : Advice[] = [];

  constructor(private adviceService : AdviceService){

  }


  ngOnInit(){ //Lifecycle hook that get executed when the component is initialized
    this.getData();
  }

  getData() : void{
    this.adviceService.getAdvice()
    .subscribe(advicesFromApi => this.advices = advicesFromApi); //subscribe notifies when the async is done
  }

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
