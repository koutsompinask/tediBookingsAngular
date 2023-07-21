import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { BookingResponceDto } from 'src/app/dto/bookingsResponce';
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit{
  constructor(private bookServ: BookingsService){}

  bookings: BookingResponceDto[];
  ngOnInit(): void {
    this.bookServ.getBookings().subscribe(data=>{
      this.bookings=data;
    })
  }

  dateConverter(date: Date){
    return new Date(date).toLocaleDateString();
  }
}
