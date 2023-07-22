import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnlistDto } from 'src/app/dto/enlistRequest';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { charsDisallowedValidator } from 'src/app/services/validators';
import * as L from 'leaflet';
import { photo } from 'src/app/model/photo';

@Component({
  selector: 'app-enlist',
  templateUrl: './enlist.component.html',
  styleUrls: ['./enlist.component.css']
})
export class EnlistComponent implements OnInit{
  enlistForm: FormGroup;
  enlistRequest : EnlistDto;
  private map: L.Map;
  private centroid: L.LatLngExpression = [37.8601, 24.0589]; //
  coords : number[] = [];
  photosArray : photo[] =[] ;

  accTypes= [
    {id: 'HOTEL' , value: 'Hotel'},
    {id: 'APPARTMENT' , value: 'Appartment'},
    {id: 'HOUSE' , value: 'House'}
  ]

  constructor(private accomServ:AccomodationsService,private router:Router){}

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
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
    
    this.map.on('click',function(e) {
      // get the count of currently displayed markers
      var markersCount = markersGroup.getLayers().length;
      this.coords=[e.latlng['lat'],e.latlng['lng']]
      console.log(this.coords)
      if (markersCount = 1) {
        markersGroup.clearLayers();
      }
      var marker = L.marker(e.latlng,{icon: L.divIcon({className: 'poi', html: '<i class="text-danger fa-2x fa fa-thumb-tack" aria-hidden="true"></i>'})}).addTo(markersGroup);
      return;
    });
  }

  ngOnInit():void{
    this.initMap();
    this.enlistForm = new FormGroup({
      name : new FormControl(null,Validators.required),
      location : new FormControl(null,Validators.required),
      transportation: new FormControl(null),
      availableFrom : new FormControl(null,Validators.required),
      availableTo : new FormControl(null,Validators.required),
      floor: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      price: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      extraCost: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      size : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      rooms : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      beds : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      bathrooms : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      maxPerson : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      accType : new FormControl('HOTEL',Validators.required),
      description : new FormControl(null),
      sittingRoom : new FormControl('false',Validators.required),
      wifi : new FormControl('false',Validators.required),
      heat : new FormControl('false',Validators.required),
      kitchen : new FormControl('false',Validators.required),
      tv : new FormControl('false',Validators.required),
      parking : new FormControl('false',Validators.required),
      elevator : new FormControl('false',Validators.required)
    });
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('availableFrom').setAttribute('min',today);
    document.getElementById('availableTo').setAttribute('min',today);
  }

  onSubmit(){
    if (!this.enlistForm.valid) return;
    if (this.coords.length != 2) this.coords=[100,200]; 
    this.enlistRequest={
      name: this.enlistForm.get('name')?.value,
      location: this.enlistForm.get('location')?.value,
      lat: this.coords[0],
      lng: this.coords[1], 
      transportation : this.enlistForm.get('transportation')?.value,
      availableFrom: this.enlistForm.get('availableFrom')?.value,
      availableTo: this.enlistForm.get('availableTo')?.value,
      floor: this.enlistForm.get('floor')?.value,
      price: this.enlistForm.get('price')?.value,
      extraCost: this.enlistForm.get('extraCost')?.value,
      size: this.enlistForm.get('size')?.value,
      rooms: this.enlistForm.get('rooms')?.value,
      beds: this.enlistForm.get('beds')?.value,
      bathrooms: this.enlistForm.get('bathrooms')?.value,
      maxPerson: this.enlistForm.get('maxPerson')?.value,
      accType: this.enlistForm.get('accType')?.value,
      description: this.enlistForm.get('description')?.value,
      sittingRoom : this.transBool(this.enlistForm.get('sittingRoom')?.value),
      wifi: this.transBool(this.enlistForm.get('wifi')?.value),
      heat: this.transBool(this.enlistForm.get('heat')?.value),
      kitchen: this.transBool(this.enlistForm.get('kitchen')?.value),
      tv: this.transBool(this.enlistForm.get('tv')?.value),
      parking: this.transBool(this.enlistForm.get('parking')?.value),
      elevator: this.transBool(this.enlistForm.get('elevator')?.value),
      photos: this.photosArray
    }
    this.accomServ.enlist(this.prepareFormData(this.enlistRequest)).subscribe( data => {
      console.log(data);
      this.router.navigate(['/home'])
    }, () => {
      alert('Enlistment Failed! Please try again');
    })
  }

  private transBool(st : string):boolean{
    if (st==='true') return true;
    else return false;
  }

  onFileSelected(event){
    if (event.target.files){
      for(let p of event.target.files){
        const photoSave : photo = {
          file : p
        }
        this.photosArray.push(photoSave);
      }
    }
  }

  prepareFormData (enR : EnlistDto): FormData{
    const formData = new FormData();
    formData.append(
      'accomodation',
      new Blob([JSON.stringify(enR)],{type: 'application/json'})
    );

    for (let i=0; i< enR.photos.length ; i++){
      formData.append(
        'photos',
        enR.photos[i].file,
        enR.photos[i].file.name
      );
    }

    return formData;
  }

}
