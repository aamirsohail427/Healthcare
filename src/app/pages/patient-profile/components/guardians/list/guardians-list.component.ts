import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { activeStates, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { GuardianDetailComponent } from '../detail';

@Component({
  selector: 'app-guardians-list',
  templateUrl: './guardians-list.component.html',
  styleUrls: ['./guardians-list.component.scss']
})
export class GuardiansListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdGuardians', { static: false }) grdGuardians: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addGuardianComponentRef: ComponentRef<GuardianDetailComponent>;
  public dtsGuardians: any;
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

  public onGrdGuardiansContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdGuardiansRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdGuardiansToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', false, null),
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
  public onBtnAddGuardianClicked() {
    this.isDataProcessing = true;
    this.showGuardianDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showGuardianDetail(null, 'edit');
  }

  public showGuardianDetail(entity, mode) {
    this.addGuardianComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, GuardianDetailComponent);
    const detailInstance = this.addGuardianComponentRef.instance;
    detailInstance.popupTitle = "Guardian";
    if (mode === 'create') {
      detailInstance.addGuardian();
    }
    if (mode === 'edit') {
      detailInstance.editGuardian(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addGuardianComponentRef);
    });
  }

}
