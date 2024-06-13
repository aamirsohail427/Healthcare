import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { SurgeryDetailComponent } from '../detail';
import Surgeryservice from '../surgery.service';

@Component({
  selector: 'app-surgery-list',
  templateUrl: './surgery-list.component.html',
  styleUrls: ['./surgery-list.component.scss']
})
export class SurgeryiesListComponent extends ListViewBase implements OnInit {
  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdSurgeries', { static: false }) grdSurgeries: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addSurgeryComponentRef: ComponentRef<SurgeryDetailComponent>;
  public dtsSurgeries: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: Surgeryservice) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onGrdSurgeriesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdSurgerysRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdSurgeriesToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', false, null),
      new DropDownListOptions(120, null, '', '', '', null, null, false));
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }

  public onBtnAddSurgeryClicked() {
    this.isDataProcessing = true;
    this.showSurgeryDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showSurgeryDetail(null, 'edit');
  }

  public showSurgeryDetail(entity, mode) {
    this.addSurgeryComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, SurgeryDetailComponent);
    const detailInstance = this.addSurgeryComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Surgery";
      detailInstance.addSurgery();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Surgery - " + entity.title;
      detailInstance.editSurgery(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addSurgeryComponentRef);
    });
  }
  public onCnmActionsItemClick(e) {

  }
}
