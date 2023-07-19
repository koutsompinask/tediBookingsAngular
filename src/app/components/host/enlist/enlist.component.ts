import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EnlistDto } from 'src/app/dto/enlistRequest';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { charsDisallowedValidator } from 'src/app/services/validators';

@Component({
  selector: 'app-enlist',
  templateUrl: './enlist.component.html',
  styleUrls: ['./enlist.component.css']
})
export class EnlistComponent implements OnInit{
  enlistForm: FormGroup;
  enlistRequest : EnlistDto;

  accTypes= [
    {id: 'HOTEL' , value: 'Hotel'},
    {id: 'APPARTMENT' , value: 'Appartment'},
    {id: 'HOUSE' , value: 'House'}
  ]

  constructor(private accomServ:AccomodationsService,private router:Router){}

  ngOnInit():void{
    this.enlistForm = new FormGroup({
      name : new FormControl(null,Validators.required),
      location : new FormControl(null,Validators.required),
      floor: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      price: new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      size : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      maxPerson : new FormControl(null,[Validators.required,charsDisallowedValidator(/[^0-9]/)]),
      accType : new FormControl('HOTEL',Validators.required),
      description : new FormControl(null),
      wifi : new FormControl('false',Validators.required),
      heat : new FormControl('false',Validators.required),
      kitchen : new FormControl('false',Validators.required),
      tv : new FormControl('false',Validators.required),
      parking : new FormControl('false',Validators.required),
      elevator : new FormControl('false',Validators.required)
    });
  }

  onSubmit(){
    if (!this.enlistForm.valid) return;
    this.enlistRequest={
      name: this.enlistForm.get('name')?.value,
      location: this.enlistForm.get('location')?.value,
      floor: this.enlistForm.get('floor')?.value,
      price: this.enlistForm.get('price')?.value,
      size: this.enlistForm.get('size')?.value,
      maxPerson: this.enlistForm.get('maxPerson')?.value,
      accType: this.enlistForm.get('accType')?.value,
      description: this.enlistForm.get('description')?.value,
      wifi: this.transBool(this.enlistForm.get('wifi')?.value),
      heat: this.transBool(this.enlistForm.get('heat')?.value),
      kitchen: this.transBool(this.enlistForm.get('kitchen')?.value),
      tv: this.transBool(this.enlistForm.get('tv')?.value),
      parking: this.transBool(this.enlistForm.get('parking')?.value),
      elevator: this.transBool(this.enlistForm.get('elevator')?.value),
    }
    this.accomServ.enlist(this.enlistRequest).subscribe( data => {
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


}
