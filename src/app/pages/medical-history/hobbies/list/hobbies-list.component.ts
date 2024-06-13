import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper, ListViewBase } from 'src/app/shared';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-hobbies-list',
  templateUrl: './hobbies-list.component.html',
  styleUrls: ['./hobbies-list.component.scss']
})
export class HobbiesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdHobbies', { static: false }) grdHobbies: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public dtsHobbies: any;
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

  public onGrdHobbiesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdHobbiesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdHobbiesToolbarPreparing(e: any) {
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
      component: this.grdHobbies.instance
    }).then(() => {
      doc.save('Classes.pdf');
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
  public onBtnAddStockClicked() {
    this.isDataProcessing = true;
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
  }

}
