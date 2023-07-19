import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchDto } from 'src/app/dto/searchRequest';
import { Accomodation } from 'src/app/model/accomodation';
import { User } from 'src/app/model/user';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { UserService } from 'src/app/services/user.service';
import { dateSearchValidator } from 'src/app/services/validators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  searchForm : FormGroup;
  searchRequest : SearchDto;
  searchResults : Accomodation[];

  constructor(private accServ: AccomodationsService){ }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      numPerson: new FormControl(null),
      location : new FormControl(null),
      dates: new FormGroup({
        to: new FormControl(null),
        from: new FormControl(null)
      } , dateSearchValidator()
      )
    })
  }

  onSubmit(){
    console.log(this.searchForm)
    if (!this.searchForm.valid) return;
    this.searchRequest={
      location:this.searchForm.get('location')?.value,
      numPerson:this.searchForm.get('numPerson')?.value,
      from : this.searchForm.get('dates.from')?.value,
      to : this.searchForm.get('dates.to')?.value
    }
    this.accServ.getAllRooms(this.searchRequest).subscribe( data =>{
      this.searchResults=data;
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
}
