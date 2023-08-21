import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingDto } from 'src/app/dto/bookingRequest';
import { SearchDto } from 'src/app/dto/searchRequest';
import { Accomodation } from 'src/app/model/accomodation';
import { photo } from 'src/app/model/photo';
import { Rating } from 'src/app/model/rating';
import { User } from 'src/app/model/user';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { AuthService } from 'src/app/services/auth.service';
import { BookingsService } from 'src/app/services/bookings.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';
import { dateSearchValidator } from 'src/app/services/validators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  page: number =1;
  tableSize: number = 10;
  searchForm : FormGroup;
  searchRequest : SearchDto;
  searchResults : Accomodation[];
  invalidFormSubmit : Boolean = false;
  photos:Map<number,string>= new Map();

  constructor(private accServ: AccomodationsService,private authServ:AuthService,private router:Router,private bookingServ: BookingsService,private phototServ: PhotoService){ }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      numPerson: new FormControl(null,Validators.required),
      location : new FormControl(null,Validators.required),
      dates: new FormGroup({
        to: new FormControl(null,Validators.required),
        from: new FormControl(null,Validators.required)
      } , dateSearchValidator()
      )
    })
    var today = new Date().toISOString().split('T')[0];
    document.getElementById("DateFrom").setAttribute('min', today);
    document.getElementById("DateTo").setAttribute('min', today);
  }

  onSubmit(){
    if (!this.searchForm.valid){
      this.invalidFormSubmit=true;
      return;
    }
    this.searchRequest={
      location:this.searchForm.get('location')?.value,
      numPerson:this.searchForm.get('numPerson')?.value,
      from : this.searchForm.get('dates.from')?.value,
      to : this.searchForm.get('dates.to')?.value
    }
    this.accServ.getAllRooms(this.searchRequest).subscribe( data =>{
      this.searchResults=data;
      for (let acc of this.searchResults){
        console.log(acc.ratings);
        if (acc.photos?.length>0){
          this.phototServ.getPhotoContent(acc.photos[0].filename).subscribe(
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
    },() => {
      alert('Search Failed!');
    }
    );
  }

  isValidDate(){
    return (this.searchForm.get('dates')?.valid || 
    !this.searchForm.get('dates.from')?.touched ||
    !this.searchForm.get('dates.from')?.touched);
  }

  isDatesFilled(){
    return (this.searchForm.get('dates')?.valid &&
    this.searchForm.get('dates.from')?.touched &&
    this.searchForm.get('dates.from')?.touched)
  }

  isRenter(){
    return(this.authServ.getRole()?.indexOf('RENTER')>=0);
  }

  book(roomId: number){
    if (!this.isDatesFilled() || !this.isRenter()) return;
    const bookReq: BookingDto = {
      from : this.searchForm.get('dates.from')?.value,
      to : this.searchForm.get('dates.to')?.value
    };
    this.bookingServ.bookRoom(roomId,bookReq).subscribe(data => {
      alert('successful reservation!');
      this.router.navigate(['renterBooks']);
    })
  }

  getAvg(ratings : Rating[]){
    if (!ratings) return '-';
    if (ratings.length===0) return '-'
    var sum=0;
    for (let r of ratings){
      sum=sum+r.stars;
    }
    return sum/ratings.length;
  }

}