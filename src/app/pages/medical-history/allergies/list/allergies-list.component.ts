import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper, ListViewBase } from 'src/app/shared';
import { AllergyDetailComponent } from '../detail';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-allergies-list',
  templateUrl: './allergies-list.component.html',
  styleUrls: ['./allergies-list.component.scss']
})
export class AllergiesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdAllergies', { static: false }) grdAllergies: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addItemComponentRef: ComponentRef<AllergyDetailComponent>;
  public dtsAllergies: any;
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

  public onGrdAllergiesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdAllergiesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdAllergiesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      new DropDownListOptions(120, this.dtsActiveStates, 'value', 'text', 'Active', null, null, true));
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdAllergies.instance
    }).then(() => {
      doc.save('Inventory Allergies.pdf');
    })
  }
  private onBtnRefreshClick = () => {
    this.initData();
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
  public onBtnAddAllergiesClicked() {
    this.isDataProcessing = true;
    this.showAllergiesDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showAllergiesDetail(null, 'edit');
  }

  public showAllergiesDetail(entity, mode) {
    this.addItemComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AllergyDetailComponent);
    const detailInstance = this.addItemComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Allergies history";
      detailInstance.addAllergy();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Allergies history -" + entity.title;
      detailInstance.editAllergy(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addItemComponentRef);
    });
  }

}
