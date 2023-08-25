import { Component, OnInit } from '@angular/core';
import { Accomodation } from 'src/app/model/accomodation';
import { AuthService } from 'src/app/services/auth.service';
import { PhotoService } from 'src/app/services/photo.service';
import { RecommendationService } from 'src/app/services/recommendation.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit{

  loggedIn:boolean = false;
  canSearch:boolean = false;
  recommendations:Accomodation[] = null;
  photos:Map<number,string>= new Map();

  constructor(private authService : AuthService,private recommendationServ:RecommendationService, private photoServ : PhotoService){}

  ngOnInit(): void {
    this.loggedIn = this.authService.getRole()!=null;
    const role = this.authService.getRole();
    this.canSearch = role == null || role === 'RENTER' || role === 'HOST_AND_RENTER';
    if (this.loggedIn){
      this.recommendationServ.getReccomendations().subscribe(data => {
        this.recommendations=data;
        for (let acc of this.recommendations){
          if (acc.photos?.length>0){
            this.photoServ.getPhotoContent(acc.photos[0].filename).subscribe(
              photoObject => 
              {
                const reader = new FileReader();
                reader.onloadend = () => {
                  this.photos.set(acc.id,reader.result as string);
                };
                reader.readAsDataURL(photoObject);
              }
            )
          }
        }
      }, () => {
        console.error("error fetching recommendations!");
      } )
    }
  }

}
