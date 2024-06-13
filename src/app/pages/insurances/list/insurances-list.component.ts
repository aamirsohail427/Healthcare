import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { InsuranceDetailComponent } from '../detail';

@Component({
  selector: 'app-insurances-list',
  templateUrl: './insurances-list.component.html',
  styleUrls: ['./insurances-list.component.scss']
})
export class InsurancesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdInsurances', { static: false }) grdInsurances: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addInsuranceComponentRef: ComponentRef<InsuranceDetailComponent>;
  public dtsInsurances: any;
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

  public onGrdInsurancesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdInsurancesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdInsurancesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      new DropDownListOptions(120, this.dtsActiveStates, 'value', 'text', 'Active', null, null, true));
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
  public onBtnAddInsuranceClicked() {
    this.isDataProcessing = true;
    this.showInsuranceDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showInsuranceDetail(null, 'edit');
  }

  public showInsuranceDetail(entity, mode) {
    this.addInsuranceComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, InsuranceDetailComponent);
    const detailInstance = this.addInsuranceComponentRef.instance;
    detailInstance.popupTitle = "Insurance Registeration";
    if (mode === 'create') {
      detailInstance.addInsurance();
    }
    if (mode === 'edit') {
      detailInstance.editInsurance(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addInsuranceComponentRef);
    });
  }

}
