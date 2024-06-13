import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class PatientProfileComponent implements OnInit {
  @ViewChild('frmUserProfileDetails', { static: false }) frmUserProfileDetails: DxFormComponent;
  public frmUserProfile: any;
  public dtsGenderTypes: any;
  public isDataProcessing = false;
  constructor() {

  }
  ngOnInit() {
  }
  public comparePassword = () => {
    return this.frmUserProfileDetails.instance.option("formData").password;
  };
  
}
