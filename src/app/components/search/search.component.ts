import { Component,OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  dump;

  constructor(private accServ: AccomodationsService){
    this.accServ.getAllRooms().subscribe(item =>{
      this.dump=item;
      console.log("dump is ",this.dump);
    })
  }

  ngOnInit(): void {
  }

  results : User[] = []
}
