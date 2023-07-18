import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchDto } from 'src/app/dto/searchRequest';
import { User } from 'src/app/model/user';
import { AccomodationsService } from 'src/app/services/accomodations.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  searchForm : FormGroup;
  searchRequest : SearchDto;

  constructor(private accServ: AccomodationsService){ }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      numPerson: new FormControl(null),
      location: new FormControl(null)
    })
  }

  onSubmit(){
    this.searchRequest={
      location:this.searchForm.get('location')?.value,
      numPerson:this.searchForm.get('numPerson')?.value
    }
    this.accServ.getAllRooms(this.searchRequest).subscribe( data =>{
      console.log(data)
    },() => {
      alert('Search Failed!');
    }
    );
  }

  results : User[] = []
}
