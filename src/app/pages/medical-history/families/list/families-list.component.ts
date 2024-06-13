import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxDataGridComponent, DxContextMenuComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { activeStates, GridListHelper, ButtonOptions, DropDownListOptions, ComponentHelper } from 'src/app/shared/utils';
import { FamilyDetailComponent } from '..';

@Component({
  selector: 'app-families-list',
  templateUrl: './families-list.component.html',
  styleUrls: ['./families-list.component.scss']
})
export class FamiliesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdFamlies', { static: false }) grdFamlies: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addVirtualComponentRef: ComponentRef<FamilyDetailComponent>;
  public dtsFamlies: any;
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

  public onGrdFamliesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdFamliesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdFamliesToolbarPreparing(e: any) {
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
  public onBtnAddFamlilyClicked() {
    this.isDataProcessing = true;
    this.showFamlilyDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showFamlilyDetail(null, 'edit');
  }

  public showFamlilyDetail(entity, mode) {
    this.addVirtualComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, FamilyDetailComponent);
    const detailInstance = this.addVirtualComponentRef.instance;
    detailInstance.popupTitle = "Add Virtual Class";
    if (mode === 'create') {
      detailInstance.addFamily();
    }
    if (mode === 'edit') {
      detailInstance.editFamily(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addVirtualComponentRef);
    });
  }

}
