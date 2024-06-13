import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, ComponentHelper, GridListHelper } from 'src/app/shared/utils';
import { FeeDetailComponent } from '..';

@Component({
  selector: 'app-fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.scss']
})
export class FeesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdFees', { static: false }) grdFees: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addFeeComponentRef: ComponentRef<FeeDetailComponent>;
  public dtsFees: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
  }
  public initData() {

  }

  public onGrdFeesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdFeesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdFeesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      null);
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
  public onBtnAddFeeClicked() {
    this.isDataProcessing = true;
    this.showFeeDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showFeeDetail(null, 'edit');
  }

  public showFeeDetail(entity, mode) {
    this.addFeeComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, FeeDetailComponent);
    const detailInstance = this.addFeeComponentRef.instance;
    detailInstance.popupTitle = "Add Class Fee";
    if (mode === 'create') {
      detailInstance.addFee();
    }
    if (mode === 'edit') {
      detailInstance.editFee(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addFeeComponentRef);
    });
  }

}
