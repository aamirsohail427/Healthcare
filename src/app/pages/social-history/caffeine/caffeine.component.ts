import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  templateUrl: 'caffeine.component.html',
  styleUrls: ['./caffeine.component.scss']
})

export class CaffeineComponent implements OnInit {
  @ViewChild('frmSmokingDetails', { static: false }) frmSmokingDetails: DxFormComponent;
  public frmSmoking: any;
  public dtsGenderTypes: any;
  public isDataProcessing = false;
  constructor() {

  }
  ngOnInit() {
  }
}
