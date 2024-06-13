import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ModalViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, GridListHelper } from 'src/app/shared/utils';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html',
  styleUrls: ['./attendance-detail.component.scss']
})
export class AttendanceDetailComponent extends ModalViewBase implements OnInit {
  @ViewChild('frmAttendanceDetails', { static: false }) frmAttendanceDetails: DxFormComponent;
  @ViewChild('grdStudents', { static: false }) grdStudents: DxFormComponent;
  public dtsClasses: any;
  public frmAttendanceDetail: any;
  public dtsStudents: any;
  public popupToolbarItems: any[];
  constructor(public gridListHelper: GridListHelper) {
    super()
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }
  public addAttendance() {
    this.popupVisible = true;
  }
  public editAttendance(entity) {

  }
  public onClassValueChanged(e) {

  }
  public onGrdStudentsContentReady(e) {

  }

  public onPopupHiding(e) {
    this.popupVisible = false;
  }

  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getModalToolbarItems(
      new ButtonOptions('Cancel', true, null, this.isDataProcessing),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('', false, null, this.isDataProcessing),
      new ButtonOptions('Done', true, null, this.isDataProcessing)
    );
  }
}
