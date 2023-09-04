import { Component,OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnlistDto } from 'src/app/dto/enlistRequest';
import { photo } from 'src/app/model/photo';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import * as L from 'leaflet';
import { Accomodation } from 'src/app/model/accomodation';
import { charsDisallowedValidator } from 'src/app/services/validators';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-edit-accomodation',
  templateUrl: './edit-accomodation.component.html',
  styleUrls: ['./edit-accomodation.component.css']
})
export class EditAccomodationComponent implements OnDestroy{
  editForm: FormGroup;
  enlistRequest : EnlistDto;
  private map: L.Map;
  private centroid: L.LatLngExpression = [37.8601, 24.0589]; //
  coords : number[] = new Array();
  photosArray : photo[] =[] ;
  photoUrls : string[];
  photoToFilenameMap: Map<string,string> = new Map();
  acc : Accomodation;

  accTypes= [
    {id: 'HOTEL' , value: 'Hotel'},
    {id: 'APPARTMENT' , value: 'Appartment'},
    {id: 'HOUSE' , value: 'House'}
  ]

  constructor(private accomServ:AccomodationsService,private router:Router,private route:ActivatedRoute,private photoServ: PhotoService){}

  private initMap(): void {
    if (this.acc.lat) {
      this.centroid=[this.acc.lat,this.acc.lng];
    }
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
    if (this.acc.lat!=100) {
      L.marker([this.acc.lat,this.acc.lng],{icon: L.divIcon({className: 'poi', html: '<i class="text-danger fa-2x fa fa-thumb-tack" aria-hidden="true"></i>'})}).addTo(markersGroup);
    }
    this.map.on('click',(e) =>{
      var markersCount = markersGroup.getLayers().length;
      this.coords=[e.latlng.lat,e.latlng.lng];
      if (markersCount === 1) {
        markersGroup.clearLayers();
      }
      var marker = L.marker(e.latlng,{icon: L.divIcon({className: 'poi', html: '<i class="text-danger fa-2x fa fa-thumb-tack" aria-hidden="true"></i>'})}).addTo(markersGroup);
      return;
    });
  }

  ngOnInit():void{
    var accId : number;
    this.route.queryParams.subscribe(params =>{
      accId = params['id'];
    });
    this.accomServ.getRoomById(accId).subscribe(data =>{
      this.acc=data;
      console.log(data);
      this.editForm = new FormGroup({
        name : new FormControl(this.acc.name,Validators.required),
        location : new FormControl(this.acc.location,Validators.required),
        transportation: new FormControl(this.acc.transportation),
        availableFrom : new FormControl(this.formatDate(new Date(this.acc.availableFrom)),Validators.required),
        availableTo : new FormControl(this.formatDate(new Date(this.acc.availableTo)),Validators.required),
        floor: new FormControl(this.acc.floor,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        price: new FormControl(this.acc.price,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        extraCost: new FormControl(this.acc.extraCost,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        size : new FormControl(this.acc.size,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        rooms : new FormControl(this.acc.rooms,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        beds : new FormControl(this.acc.beds,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        bathrooms : new FormControl(this.acc.bathrooms,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        maxPerson : new FormControl(this.acc.maxPerson,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
        accType : new FormControl(this.acc.type,Validators.required),
        description : new FormControl(this.acc.description),
        smokingCheck: new FormControl(this.acc.smokingAllowed),
        petsCheck: new FormControl(this.acc.petsAllowed),
        eventsCheck: new FormControl(this.acc.eventsAllowed),
        sittingRoom : new FormControl(this.transBoolRev(this.acc.sittingRoom),Validators.required),
        wifi : new FormControl(this.transBoolRev(this.acc.wifi),Validators.required),
        heat : new FormControl(this.transBoolRev(this.acc.heat),Validators.required),
        kitchen : new FormControl(this.transBoolRev(this.acc.kitchen),Validators.required),
        tv : new FormControl(this.transBoolRev(this.acc.tv),Validators.required),
        parking : new FormControl(this.transBoolRev(this.acc.parking),Validators.required),
        elevator : new FormControl(this.transBoolRev(this.acc.elevator),Validators.required)
      });
      const st:string[]=[];
      for (let s of data.photos){
        this.photoServ.getPhotoContent(s.filename).subscribe(
          (response: Blob) => {
            // Convert the blob to a data URL
            const reader = new FileReader();
            reader.onloadend = () => {
              st.push(reader.result as string);
              this.photoToFilenameMap.set(reader.result as string,s.filename);
            };
            reader.readAsDataURL(response);
          },
          error => {
            console.error('Error fetching photo:', error);
          }
          );
        }
      this.photoUrls=st
    }
    )
    this.editForm = new FormGroup({
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
      smokingCheck: new FormControl('false'),
      petsCheck: new FormControl('false'),
      eventsCheck: new FormControl('false'),
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap()
    }, 500);  
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  deletePhoto(img : string){
    const filename:string=this.photoToFilenameMap.get(img);
    this.photoServ.deletePhoto(filename).subscribe(
      data => {
        alert(data);
        const ind=this.photoUrls.indexOf(img);
        if (ind!==-1){
          this.photoUrls.splice(ind,1);
        }
      }
    );
    return;
  }

  onSubmit(){
    if (!this.editForm.valid) return;
    if (this.coords.length != 2) {
      this.coords=[this.acc.lat,this.acc.lng]; 
    }
    this.enlistRequest={
      name: this.editForm.get('name')?.value,
      location: this.editForm.get('location')?.value,
      lat: this.coords[0],
      lng: this.coords[1], 
      transportation : this.editForm.get('transportation')?.value,
      availableFrom: this.editForm.get('availableFrom')?.value,
      availableTo: this.editForm.get('availableTo')?.value,
      floor: this.editForm.get('floor')?.value,
      price: this.editForm.get('price')?.value,
      extraCost: this.editForm.get('extraCost')?.value,
      size: this.editForm.get('size')?.value,
      rooms: this.editForm.get('rooms')?.value,
      beds: this.editForm.get('beds')?.value,
      bathrooms: this.editForm.get('bathrooms')?.value,
      maxPerson: this.editForm.get('maxPerson')?.value,
      type: this.editForm.get('accType')?.value,
      description: this.editForm.get('description')?.value,
      petsAllowed:this.editForm.get('petsCheck')?.value,
      smokingAllowed:this.editForm.get('smokingCheck')?.value,
      eventsAllowed:this.editForm.get('eventsCheck')?.value,
      sittingRoom : this.transBool(this.editForm.get('sittingRoom')?.value),
      wifi: this.transBool(this.editForm.get('wifi')?.value),
      heat: this.transBool(this.editForm.get('heat')?.value),
      kitchen: this.transBool(this.editForm.get('kitchen')?.value),
      tv: this.transBool(this.editForm.get('tv')?.value),
      parking: this.transBool(this.editForm.get('parking')?.value),
      elevator: this.transBool(this.editForm.get('elevator')?.value),
      photos: this.photosArray
    }
    this.accomServ.update(this.prepareFormData(this.enlistRequest),this.acc.id).subscribe( data => {
      this.router.navigate(['/viewAccomodation'],{queryParams: {id : this.acc.id}});
    }, () => {
      alert('Enlistment Failed! Please try again');
    })
  }
  
  private transBool(st : string):boolean{
    if (st==='true') return true;
    else return false;
  }
  
  private transBoolRev(st : boolean):string{
    if (st===true) return 'true';
    else return 'false';
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

  formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = this.padZero(date.getUTCMonth() + 1);
    const day = this.padZero(date.getUTCDate());
    return `${year}-${month}-${day}`;
  }

  padZero(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
