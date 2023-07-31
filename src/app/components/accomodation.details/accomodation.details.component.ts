import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Accomodation } from 'src/app/model/accomodation';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { PhotoService } from 'src/app/services/photo.service';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/auth.service';
import { BookingDto } from 'src/app/dto/bookingRequest';
import { BookingsService } from 'src/app/services/bookings.service';

@Component({
  selector: 'app-accomodation.details',
  templateUrl: './accomodation.details.component.html',
  styleUrls: ['./accomodation.details.component.css']
})
export class AccomodationDetailsComponent implements AfterViewInit,OnDestroy{
  accId:number;
  photoUrls : string[];
  acc : Accomodation;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  }
  showMap : boolean =false;
  canEdit : boolean =false;
  canBook : boolean =false;
  from : Date;
  to: Date;
  numPerson : number;
  private map: L.Map;

  constructor(private route: ActivatedRoute,private accServ: AccomodationsService,private photoServ:PhotoService,
    private authServ : AuthService,private bookServ:BookingsService,private router:Router){
    this.route.queryParams.subscribe(params =>{
      this.accId= params['id'];
      this.from = params['from'];
      this.to = params['to'];
      this.numPerson = params['numPerson'];
    });
    this.accServ.getRoomById(this.accId).subscribe(data =>{
      this.acc=data;
      this.acc.availableFrom=new Date(this.acc.availableFrom);
      this.acc.availableTo=new Date(this.acc.availableTo);
      this.canEdit=(this.authServ.getRole()?.indexOf('HOST')>=0 && this.acc.owner.username === this.authServ.getUsername());
      this.canBook=(this.authServ.getRole()?.indexOf('RENTER')>=0)
      //console.log(this.authServ.getRole(),this.acc.owner.username)
      if(this.acc.lat!=100) this.showMap=true;
      const st:string[]=[];
      for (let s of data.photos){
        this.photoServ.getPhotoContent(s.filename).subscribe(
          (response: Blob) => {
            // Convert the blob to a data URL
            const reader = new FileReader();
            reader.onloadend = () => {
              st.push(reader.result as string);
            };
            reader.readAsDataURL(response);
            this.photoUrls=st
          },
          error => {
            console.error('Error fetching photo:', error);
          }
        );
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.showMap) {
        this.initMap();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    const centroid: L.LatLngExpression = [this.acc.lat,this.acc.lng];
    this.map = L.map('map', {
      center: centroid,
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    var markersGroup = L.layerGroup();
    this.map.addLayer(markersGroup);
    var marker = L.marker(centroid,{icon: L.divIcon({className: 'poi', html: '<i class="text-danger fa-2x fa fa-thumb-tack" aria-hidden="true"></i>'})}).addTo(markersGroup);
  }

  book(roomId: number){
    if (this.from==null || this.to==null || this.numPerson==null) return; //to do add form   
    const bookReq: BookingDto = {
      from : this.from,
      to : this.to
    };
    this.bookServ.bookRoom(roomId,bookReq).subscribe(data => {
      alert('successful reservation!');
      this.router.navigate(['renterBooks']);
    })
  }

}
