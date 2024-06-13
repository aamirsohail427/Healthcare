import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  templateUrl: 'smoking.component.html',
  styleUrls: ['./smoking.component.scss']
})

export class SmokingComponent implements OnInit {
  @ViewChild('frmSmokingDetails', { static: false }) frmSmokingDetails: DxFormComponent;
  public frmSmoking: any;
  public dtsGenderTypes: any;
  public isDataProcessing = false;
  constructor() {

  }
  ngOnInit() {
  }
}
