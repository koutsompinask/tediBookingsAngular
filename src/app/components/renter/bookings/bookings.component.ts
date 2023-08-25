import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { BookingDto } from 'src/app/dto/bookingRequest';
import { BookingResponceDto } from 'src/app/dto/bookingsResponce';
import { RatingDto } from 'src/app/dto/ratingRequest';
import { BookingsService } from 'src/app/services/bookings.service';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit{
  rateForm:FormGroup;
  bookings: BookingResponceDto[];
  rateId:number;

  constructor(private bookServ: BookingsService,private ratingService : RatingService){}

  ngOnInit(): void {
    this.bookServ.getBookings().subscribe(data=>{
      this.bookings=data;
    })
    this.rateForm = new FormGroup({
      rating : new FormControl(null,[Validators.required,Validators.min(1),Validators.max(5)]),
      comment : new FormControl(null)
    })
  }

  dateConverter(date: Date){
    return new Date(date).toLocaleDateString();
  }

  delete(id : number){
    this.bookServ.delete(id).subscribe(
      data => {
        alert(data);
        this.bookServ.getBookings().subscribe(data=>{
          this.bookings=data;
        });
      }, 
      () => alert(data)
    );
    
  }

  rateAcc(){
    const rateReq : RatingDto = {
      stars: this.rateForm.get('rating')?.value,
      comment: this.rateForm.get('comment')?.value
    }
    this.ratingService.rateAccomodation(rateReq,this.rateId).subscribe(
      data => {
        alert(data);
      },
      (error) => {
        if (error.status=400)
          alert(error.error);
        else
          alert("Failed to add rating! Please try again.")
      }
    )
  }

}
