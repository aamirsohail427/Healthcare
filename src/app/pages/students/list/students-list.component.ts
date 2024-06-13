import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { Action, activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { StudentDetailComponent } from '../detail';
import StudentService from '../student.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent extends ListViewBase implements OnInit {
  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdStudents', { static: false }) grdStudents: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addStudentComponentRef: ComponentRef<StudentDetailComponent>;
  public dtsStudents: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActiveStates: any[] = activeStates;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: StudentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initActions();
    this.initData();
  }
  public initData() {
    debugger;
    this.dtsStudents = this.service.dtsStudents;
  }
  public initActions() {
    this.dtsActions.push(new Action("Archive", "Archive"));
    this.dtsActions.push(new Action("Enrollement", "Enrollement"));
    this.dtsActions.push(new Action("Student Fee", "Student Fee"));
    this.dtsActions.push(new Action("Attendance", "Attendance Report"));
    this.dtsActions.push(new Action("Exams", "Exams Sheet"));
    this.dtsActions.push(new Action("Payment", "Payment Report"));
  }

  public onGrdStudentsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdStudentsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdStudentsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      new DropDownListOptions(120, this.dtsActiveStates, 'value', 'text', 'Active', null, null, true));
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdStudents.instance
    }).then(() => {
      doc.save('Students.pdf');
    })
  }
  public onBtnBatchActionClick = () => {
    this.isBatchAction = true;
    this.cnmBatchActions.instance.option('dataSource', this.dtsBatchActions);
    this.cnmBatchActionsVisible = true;
  }
  public onCnmBatchActionsItemClick(e: any) {

  }
  public onCnmActionsItemClick(e: any) {

  }
  public onBtnAddStudentClicked() {
    this.isDataProcessing = true;
    this.showStudentDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    super.toggleLoadingPanel(true);
    this.isDataProcessing = true;
    this.showStudentDetail(null, 'edit');
  }
  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
    this.isBatchAction = false;
    this.cnmActionsTarget = '#' + AnchorId;
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }
  public showStudentDetail(entity, mode) {
    this.addStudentComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, StudentDetailComponent);
    const detailInstance = this.addStudentComponentRef.instance;
    detailInstance.popupTitle = "Student Registeration";
    if (mode === 'create') {
      detailInstance.addStudent();
    }
    if (mode === 'edit') {
      detailInstance.editStudent(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addStudentComponentRef);
    });
  }

}
