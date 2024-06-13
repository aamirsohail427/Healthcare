import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, GridListHelper } from 'src/app/shared/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import PastMedicationService from '../past-medication.service';
import { PastMedicationDetailComponent } from '..';
import { ListViewBase } from 'src/app/shared';


@Component({
  selector: 'app-past-medications-list',
  templateUrl: './past-medications-list.component.html',
  styleUrls: ['./past-medications-list.component.scss']
})
export class PastMedicationsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdMedications', { static: false }) grdMedications: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addMedicationComponentRef: ComponentRef<PastMedicationDetailComponent>;
  public dtsMedications: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: PastMedicationService) {
    super();
  }

  ngOnInit(): void {
    this.initActions();
  }

  public initActions() {
  }
  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
  }

  public onGrdMedicationsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdMedicationsCellPrepared(e) {
    if (e.rowType === 'data') {
      if (e.column.dataField === 'totalCourses' || e.column.dataField === 'totalStudents') {
        e.cellElement.css('text-align', 'right');
      }
    }
  }

  public onGrdMedicationsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdMedicationsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      null);
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdMedications.instance
    }).then(() => {
      doc.save('Medications.pdf');
    })
  }
  private onBtnRefreshClick = () => {
  }

  public onCnmActionsItemClick(e: any) {

  }
  public onBtnAddMedicationClicked() {
    this.isDataProcessing = true;
    this.showClassDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showClassDetail(null, 'edit');
  }

  public showClassDetail(entity, mode) {
    this.addMedicationComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, PastMedicationDetailComponent);
    const detailInstance = this.addMedicationComponentRef.instance;
    detailInstance.popupTitle = "Add Class";
    if (mode === 'create') {
      detailInstance.addMedication();
    }
    if (mode === 'edit') {
      detailInstance.editMedication(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addMedicationComponentRef);
    });
  }

}
