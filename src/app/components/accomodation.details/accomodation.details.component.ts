import { AfterViewInit, Component, OnDestroy , OnInit, Renderer2} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Accomodation } from 'src/app/model/accomodation';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { PhotoService } from 'src/app/services/photo.service';
import * as L from 'leaflet';
import { AuthService } from 'src/app/services/auth.service';
import { BookingDto } from 'src/app/dto/bookingRequest';
import { BookingsService } from 'src/app/services/bookings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageDto } from 'src/app/dto/messageRequest';
import { MessageService } from 'src/app/services/message.service';
import { RatingService } from 'src/app/services/rating.service';
import { Rating } from 'src/app/model/rating';
import { RatingDto } from 'src/app/dto/ratingRequest';
import { dateSearchValidator } from 'src/app/services/validators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-accomodation.details',
  templateUrl: './accomodation.details.component.html',
  styleUrls: ['./accomodation.details.component.css']
})
export class AccomodationDetailsComponent implements OnInit,AfterViewInit,OnDestroy{
  accId:number;
  messageForm : FormGroup;
  showError : boolean =false;
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
  ownerProfilePic: string;
  ownerRatings : Rating[];
  accRatings : Rating[];
  page: number =1;
  tableSize: number = 5;
  bookForm:FormGroup;
  invalidFormSubmit : boolean = false;

  constructor(private route: ActivatedRoute,private accServ: AccomodationsService,private photoServ:PhotoService,
    private authServ : AuthService,private bookServ:BookingsService,private router:Router,
    private messageServ : MessageService,private ratingService:RatingService){
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      this.accId= params['id'];
      this.from = params['from'];
      this.to = params['to'];
      this.numPerson = params['numPerson'];
    });
    this.bookForm = new FormGroup({
      numPerson: new FormControl(null,Validators.required),
      dates: new FormGroup({
        to: new FormControl(null,Validators.required),
        from: new FormControl(null,Validators.required)
      } , dateSearchValidator()
      )
    })
    this.messageForm= new FormGroup({
      messageText : new FormControl(null,Validators.required)
    });
    this.accServ.getRoomById(this.accId).subscribe(data =>{
      this.acc=data;
      this.acc.availableFrom=new Date(this.acc.availableFrom);
      this.acc.availableTo=new Date(this.acc.availableTo);
      this.canEdit=(this.authServ.getRole()?.indexOf('HOST')>=0 && this.acc.owner.username === this.authServ.getUsername());
      this.canBook=(this.authServ.getRole()?.indexOf('RENTER')>=0)
      if(this.acc.lat) this.showMap=true;
      this.bookForm = new FormGroup({
        numPerson: new FormControl(this.numPerson,[Validators.required,Validators.max(this.acc.maxPerson)]),
        dates: new FormGroup({
          to: new FormControl(this.to,Validators.required),
          from: new FormControl(this.from,Validators.required)
        } , dateSearchValidator()
        )
      })
      var today = new Date();
      var min = today < this.acc.availableFrom ? this.acc.availableFrom.toISOString().split('T')[0] : today.toISOString().split('T')[0]; 
      document.getElementById("DateFrom").setAttribute('min', min);
      document.getElementById("DateTo").setAttribute('min', min);
      document.getElementById("DateFrom").setAttribute('max', this.acc.availableTo.toISOString().split('T')[0]);
      document.getElementById("DateTo").setAttribute('max', this.acc.availableTo.toISOString().split('T')[0]);
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
    this.ratingService.getAccomodationRatings(this.accId).subscribe(
      data => {
        this.accRatings=data;
      }, 
      () => {
        console.error("error fetching ratings");
      }
    )
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
    if (!this.bookForm.valid){
      this.invalidFormSubmit=true;
      return;
    }
    const bookReq: BookingDto = {
      from : this.bookForm.get('dates.from')?.value,
      to : this.bookForm.get('dates.to')?.value
    };
    this.bookServ.bookRoom(roomId,bookReq).subscribe(data => {
      alert('successful reservation!');
      this.router.navigate(['renterBooks']);
    }, (error) => {
      if (error instanceof HttpErrorResponse
        && error.status === 400)
        alert('Sorry! Accomodation anavailable for these dates!');
    });
  }

  message(){
    if(!this.messageForm.valid) {
      this.showError=true;
      return;
    }
    const msg : MessageDto = {
      message : this.messageForm.get('messageText')?.value,
      receiverId : this.acc.owner.id
    }
    this.messageServ.sendMessage(msg).subscribe(data => {
      alert(data);
    } , () => {
      alert("error sending message");
    } )
  }

  getOwnerDetails(){
    this.photoServ.getPhotoContent(this.acc?.owner.photoUrl).subscribe(
      (response: Blob) => {
        // Convert the blob to a data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          this.ownerProfilePic=(reader.result as string);
        };
        reader.readAsDataURL(response);
      },
      error => {
        console.error('Error fetching photo:', error);
      }
    );
    this.ratingService.getHostRatings(this.acc.owner.id).subscribe(
      data => {
        this.ownerRatings=data;
      }, 
      () => {
        alert("error fetching ratings");
      }
    )
  }

  getAvgRating(rat : Rating[]){
    let sum : number = 0;
    for( let rating of rat){
      sum+=rating.stars;
    }
    return sum/rat.length;
  }

  isValidDate(){
    return (this.bookForm.get('dates')?.valid || 
    !this.bookForm.get('dates.from')?.touched ||
    !this.bookForm.get('dates.from')?.touched);
  }

  isDatesFilled(){
    return (this.bookForm.get('dates')?.valid &&
    this.bookForm.get('dates.from')?.touched &&
    this.bookForm.get('dates.from')?.touched)
  }
}
