import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { CurrentMedicationDetailComponent } from '../detail';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { ListViewBase } from 'src/app/shared';

@Component({
  selector: 'app-current-medications-list',
  templateUrl: './current-medications-list.component.html',
  styleUrls: ['./current-medications-list.component.scss']
})
export class CurrentMedicationsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdMedications', { static: false }) grdMedications: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addMedicationComponentRef: ComponentRef<CurrentMedicationDetailComponent>;
  public dtsMedications: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActiveStates: any[] = activeStates;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
  }
  public initData() {

  }

  public onGrdMedicationsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdMedicationsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdMedicationsToolbarPreparing(e: any) {
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
      component: this.grdMedications.instance
    }).then(() => {
      doc.save('Subjects.pdf');
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
  public onBtnAddMedicationClicked() {
    this.isDataProcessing = true;
    this.showMedicationDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showMedicationDetail(null, 'edit');
  }

  public showMedicationDetail(entity, mode) {
    this.addMedicationComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, CurrentMedicationDetailComponent);
    const detailInstance = this.addMedicationComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Subject";
      detailInstance.addMedication();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Subject -" + entity.title;
      detailInstance.editMedication(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addMedicationComponentRef);
    });
  }

}
