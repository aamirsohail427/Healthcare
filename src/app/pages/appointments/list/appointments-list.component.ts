import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { DateFilterComponent } from 'src/app/shared/date-filter';
import { ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { AttendanceDetailComponent } from '../detail';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import AppointmentService from '../appointment.service';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss']
})
export class AppointmentsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdAppointments', { static: false }) grdAppointments: DxDataGridComponent;
  @ViewChild('grdAttendanceDetails', { static: false }) grdAttendanceDetails: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;
  @ViewChild('fltDateRange', { static: false }) fltDateRange: DateFilterComponent;

  public addAttendanceComponentRef: ComponentRef<AttendanceDetailComponent>;
  public dtsAppointments: any = [
    {
      id: 1,
      doctorName: "Amir"
    },
    {
      id: 2,
      doctorName: "Usman",
    },
    {
      id: 3,
      doctorName: "Nouman",
    }
  ];
  public dtsClasses: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  private fltDateRangeDateType = 'Today';
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: AppointmentService) {
    super();
  }

  ngOnInit(): void {
    this.initData();

  }
  public initData() {
  }


  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
    this.isBatchAction = false;
    this.cnmActionsTarget = '#' + AnchorId;
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdAppointmentsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdAppointmentsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }
  public onGrdAttendanceCellPrepared(e) {
    if (e.rowType === 'data') {
      if (e.column.dataField === 'presents' || e.column.dataField === 'absents' || e.column.dataField === 'leaves') {
        e.cellElement.css('text-align', 'right');
      }
    }
  }

  public onGrdAppointmentsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      new DropDownListOptions(120, null, 'value', 'text', 'Active', null, null, false));

    e.toolbarOptions.items.unshift({
      location: 'before',
      locateInMenu: 'auto',
      visible: true,
      showText: 'inMenu',
      template: 'statusFiltersTemplate',
    });
  }

  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdAppointments.instance
    }).then(() => {
      doc.save('Attendance Report.pdf');
    })
  }

  public onGrdAttendanceDetailToolbarPreparing(e) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnAttendanceDetailExportToPDFClick),
      new ButtonOptions('', false, null),
      new DropDownListOptions(120, null, 'value', 'text', 'Active', null, null, false));
  }

  private onBtnAttendanceDetailExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdAttendanceDetails.instance
    }).then(() => {
      doc.save('Attendance Report.pdf');
    })
  }

  private onBtnRefreshClick = () => {
    this.initData();
  }
  public onCnmActionsItemClick(e: any) {

  }
  public onBtnAddAttendanceClicked() {
    this.isDataProcessing = true;
    this.showAttendanceDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showAttendanceDetail(null, 'edit');
  }
  public attendanceDetailsByStudent(id) {

  }

  public showAttendanceDetail(entity, mode) {
    this.addAttendanceComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AttendanceDetailComponent);
    const detailInstance = this.addAttendanceComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Attendance";
      detailInstance.addAttendance();
    }
    if (mode === 'edit') {
      detailInstance.editAttendance(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addAttendanceComponentRef);
    });
  }

  public onDateFilterChanged(e) {

  }
  public onClassesValueChanged(e) {

  }
}
