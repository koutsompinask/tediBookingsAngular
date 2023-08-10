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

  exportUsersJson() {
    this.adminService.exportAccomodationsJson().subscribe(
      (data) => {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

  exportUsersXml() {
    this.adminService.exportAccomodationsXml().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xml';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error exporting data:', error);
      }
    );
  }

}
