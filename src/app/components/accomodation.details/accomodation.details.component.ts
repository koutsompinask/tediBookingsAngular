import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccomodationsService } from 'src/app/services/accomodations.service';

@Component({
  selector: 'app-accomodation.details',
  templateUrl: './accomodation.details.component.html',
  styleUrls: ['./accomodation.details.component.css']
})
export class AccomodationDetailsComponent {
  accId:number;
  acc

  constructor(private route: ActivatedRoute,private accServ: AccomodationsService){
    this.route.queryParams.subscribe(params =>{
      this.accId= params['id'];
      this.accServ.getRoomById(this.accId).subscribe(data =>{
        console.log(data)
        this.acc=data;
        (<HTMLImageElement>document.getElementById("accPreview")).src = "data:image/png;base64," + data['photos'][0]['picByte']
      }
      );
      console.log(this.acc);
    });
  }
}
