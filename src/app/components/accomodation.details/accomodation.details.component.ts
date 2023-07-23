import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Accomodation } from 'src/app/model/accomodation';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { PhotoService } from 'src/app/services/photo.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-accomodation.details',
  templateUrl: './accomodation.details.component.html',
  styleUrls: ['./accomodation.details.component.css']
})
export class AccomodationDetailsComponent {
  accId:number;
  photoUrls : string[];
  acc : Accomodation;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true
  }
  private map: L.Map;

  constructor(private route: ActivatedRoute,private accServ: AccomodationsService,private photoServ:PhotoService){
    this.route.queryParams.subscribe(params =>{
      this.accId= params['id'];
    });
    this.accServ.getRoomById(this.accId).subscribe(data =>{
      this.acc=data;
      this.initMap();
      // if (this.acc.lat!=200){
      //   this.initMap();
      // }
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

  private initMap(): void {
    console.log(this.acc.lat,this.acc.lng)
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

}
