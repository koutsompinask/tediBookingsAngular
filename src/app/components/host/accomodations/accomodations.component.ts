import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Accomodation } from 'src/app/model/accomodation';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-accomodations',
  templateUrl: './accomodations.component.html',
  styleUrls: ['./accomodations.component.css']
})
export class AccomodationsComponent implements OnInit{
  accomodations: Accomodation[];

  constructor (private accomServ: AccomodationsService){}

  ngOnInit(): void {
    this.accomServ.getRoomsByOwner().subscribe(data => {
      this.accomodations=data;
      console.log(data)
    })  
  }

}
