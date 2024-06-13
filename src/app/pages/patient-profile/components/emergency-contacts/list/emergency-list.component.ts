import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import EmergencyContactService from '../contact.service';

@Component({
  selector: 'app-emergency-list',
  templateUrl: './emergency-list.component.html',
  styleUrls: ['./emergency-list.component.scss']
})
export class EmergencyContactsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdEmergencyContacts', { static: false }) grdEmergencyContacts: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public dtsRelations: any;
  public dtsEmergencyContacts: any = [];
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private service: EmergencyContactService) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onGrdEmergencyContactsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdEmergencyContactsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdEmergencyContactsToolbarPreparing(e: any) {
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

  public onBtnAddContactClicked() {
    this.grdEmergencyContacts.instance.addRow();
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
  }
  public onCnmActionsItemClick(e) {

  }
}
