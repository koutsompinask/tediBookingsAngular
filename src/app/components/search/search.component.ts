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
  filterForm : FormGroup;
  searchRequest : SearchDto;
  searchResults : Accomodation[];
  invalidFormSubmit : Boolean = false;
  filteredResults : Accomodation[];
  filters = null;

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
    this.filterForm = new FormGroup({
      hotel : new FormControl(true),
      house : new FormControl(true),
      appartment : new FormControl(true),
      priceFrom: new FormControl(null,Validators.min(0)),
      priceTo : new FormControl(null,Validators.min(0)),
      heat : new FormControl(false),
      wifi : new FormControl(false),
      tv : new FormControl(false),
      parking : new FormControl(false),
      kitchen : new FormControl(false),
      elevator : new FormControl(false),
      sittingRoom : new FormControl(false)
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
      this.searchResults = data;
      this.filteredResults = data;
      for (let acc of this.searchResults){
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

  submitFilters(){
    this.filters = new Map();
    this.filters.set('hotel',this.filterForm.get('hotel')?.value);
    this.filters.set('house',this.filterForm.get('house')?.value);
    this.filters.set('appartment',this.filterForm.get('appartment')?.value);
    this.filters.set('priceFrom',this.filterForm.get('priceFrom')?.value);
    this.filters.set('priceTo',this.filterForm.get('priceTo')?.value);
    this.filters.set('heat',this.filterForm.get('heat')?.value);
    this.filters.set('wifi',this.filterForm.get('wifi')?.value);
    this.filters.set('tv',this.filterForm.get('tv')?.value);
    this.filters.set('parking',this.filterForm.get('parking')?.value);
    this.filters.set('kitchen',this.filterForm.get('kitchen')?.value);
    this.filters.set('elevator',this.filterForm.get('elevator')?.value);
    this.filters.set('sittingRoom',this.filterForm.get('sittingRoom')?.value);
    var newFilteredResults : Accomodation[] = new Array();
    for (let acc of this.searchResults){
      if (this.passesFilters(acc)) newFilteredResults.push(acc);
    }
    this.filteredResults = newFilteredResults;
  }

  passesFilters(acc : Accomodation){
    //no filters
    if (this.filters==null) return true;
    //if we break a filter return false
    const hotel = this.filters.get('hotel');
    if (!hotel && acc.type==='HOTEL') return false;
    //else continue

    const house = this.filters.get('house');
    if (!house && acc.type==='HOUSE') return false;
    //else continue

    const appartment = this.filters.get('appartment');
    if (!appartment && acc.type==='APPARTMENT') return false;
    //else continue

    const priceFromFilter = this.filters.get('priceFrom');
    if (priceFromFilter!=null && priceFromFilter > (acc.price + acc.extraCost * this.searchRequest.numPerson))
      return false;

    //else continue 
    const priceToFilter = this.filters.get('priceTo');
    if (priceToFilter!=null && priceToFilter < (acc.price + acc.extraCost * this.searchRequest.numPerson))
      return false;
    //else continue

    if (this.filters.get('heat')==true && acc.heat==false)
      return false;
    //else continue
    
    if (this.filters.get('wifi')==true && acc.wifi==false)
      return false;
    //else continue
    
    if (this.filters.get('tv')==true && acc.tv==false)
      return false;
    //else continue

    if (this.filters.get('parking')==true && acc.parking==false)
      return false;
    //else continue
    
    if (this.filters.get('kitchen')==true && acc.kitchen==false)
      return false;
    //else continue
    
    if (this.filters.get('elevator')==true && acc.elevator==false)
      return false;

    if (this.filters.get('sittingRoom')==true && acc.sittingRoom==false)
      return false;
    //else continue
    

    //if we passed all filters
    return true;

  }

}