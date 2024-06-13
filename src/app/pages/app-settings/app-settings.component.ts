import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild('frmAppSettingDetails', { static: false }) frmAppSettingDetails: DxFormComponent;
  public frmAppSettings: any;
  public isDataProcessing = false;
  constructor() { }

  ngOnInit(): void {
  }

}
