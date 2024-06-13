import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { Action, ButtonOptions, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import SocialAccountservice from '../social-account.service';

@Component({
  selector: 'app-social-accounts-list',
  templateUrl: './social-accounts-list.component.html',
  styleUrls: ['./social-accounts-list.component.scss']
})
export class SocialAccountsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdSocialAccounts', { static: false }) grdSocialAccounts: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;


  public dtsRelations: any;
  public dtsSocialAccounts: any = [];
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActions: Action[] = [
    new Action('Del', 'Delete'),
    new Action('Can', 'Cancel')
  ];
  constructor(public gridListHelper: GridListHelper,
    private service: SocialAccountservice) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onGrdSocialAccountsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdSocialAccountsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdSocialAccountsToolbarPreparing(e: any) {
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

  public onBtnAddAccountClicked() {
    this.grdSocialAccounts.instance.addRow();
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
  }
  public onCnmActionsItemClick(e) {

  }
  public onBtnSaveActionClick() {
    this.grdSocialAccounts.instance.saveEditData();
  }
  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
  }
}
