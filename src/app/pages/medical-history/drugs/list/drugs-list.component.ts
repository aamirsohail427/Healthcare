import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper, statusStates } from 'src/app/shared/utils';
import { DrugDetailComponent } from '../detail';


@Component({
  selector: 'app-drugs-list',
  templateUrl: './drugs-list.component.html',
  styleUrls: ['./drugs-list.component.scss']
})
export class DrugsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdDrugs', { static: false }) grdDrugs: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addDrugComponentRef: ComponentRef<DrugDetailComponent>;
  public dtsDrugs: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActiveStates: any[] = statusStates;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
  }
  public initData() {

  }

  public onGrdDrugsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdDrugsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdDrugsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick),
      new DropDownListOptions(150, this.dtsActiveStates, 'value', 'text', 'Published', null, null, true));
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
  public onBtnAddDrugClicked() {
    this.isDataProcessing = true;
    this.showDrugDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showDrugDetail(null, 'edit');
  }

  public showDrugDetail(entity, mode) {
    this.addDrugComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, DrugDetailComponent);
    const detailInstance = this.addDrugComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Drug";
      detailInstance.addDrug();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Drug -" + entity.title;
      detailInstance.editDrug(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addDrugComponentRef);
    });
  }
}
