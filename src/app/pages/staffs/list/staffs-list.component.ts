import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, GridListHelper, ListViewBase } from 'src/app/shared';
import { StaffDetailComponent } from '../detail';

@Component({
  selector: 'app-staffs-list',
  templateUrl: './staffs-list.component.html',
  styleUrls: ['./staffs-list.component.scss']
})
export class StaffsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdStaffs', { static: false }) grdStaffs: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addStaffComponentRef: ComponentRef<StaffDetailComponent>;
  public dtsStaffs: any;
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

  public onGrdStaffsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdStaffRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdStaffsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnRefreshClick),
      null,
      null);
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }

  public onCnmActionsItemClick(e: any) {

  }
  public onBtnAddStaffClicked() {
    this.isDataProcessing = true;
    this.showStaffDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showStaffDetail(entity, 'edit');
  }

  public showStaffDetail(entity, mode) {
    this.addStaffComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, StaffDetailComponent);
    const detailInstance = this.addStaffComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Staff";
      detailInstance.addStaff();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Staff - " + entity.name;
      detailInstance.editStaff(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addStaffComponentRef);
    });
  }

}
