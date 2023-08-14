import { Component } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent{
  exportedData: any[] = [];

  constructor(private adminService: AdminService) { }

  exportAccomodationsJson() {
    this.adminService.exportAccomodationsJson().subscribe(
      (data) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accomodations.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportAccomodationsXml() {
    this.adminService.exportAccomodationsXml().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accomodations.xml';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportBookingsJson() {
    this.adminService.exportBookingsJson().subscribe(
      (data) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportBookingsXml() {
    this.adminService.exportBookingsXml().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.xml';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportGuestRatingsJson() {
    this.adminService.exportGuestRatingsJson().subscribe(
      (data) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guestRatings.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportGuestRatingsXml() {
    this.adminService.exportGuestRatingsXml().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'guestRatings.xml';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }
  
  exportHostRatingsJson() {
    this.adminService.exportHostRatingsJson().subscribe(
      (data) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hostRatings.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportHostRatingsXml() {
    this.adminService.exportHostRatingsXml().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hostRatings.xml';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }
}
