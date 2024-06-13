import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, GridListHelper, ListViewBase } from 'src/app/shared';
import { AttachmentDetailComponent } from '..';
import AttachmentService from '../attachment.service';

@Component({
  selector: 'app-attachments-list',
  templateUrl: './attachments-list.component.html',
  styleUrls: ['./attachments-list.component.scss']
})
export class AttachmentsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdAttachments', { static: false }) grdAttachments: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addAttachmentComponentRef: ComponentRef<AttachmentDetailComponent>;
  public dtsAttachments: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: AttachmentService) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onGrdAttachmentsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdRolesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdAttachmentsToolbarPreparing(e: any) {
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

  public onBtnAddAttachmentClicked() {
    this.isDataProcessing = true;
    this.showAttachmentDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showAttachmentDetail(null, 'edit');
  }

  public showAttachmentDetail(entity, mode) {
    this.addAttachmentComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AttachmentDetailComponent);
    const detailInstance = this.addAttachmentComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Attachment";
      detailInstance.addAttachment();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Attachment - " + entity.title;
      detailInstance.editAttachment(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addAttachmentComponentRef);
    });
  }
  public onCnmActionsItemClick(e) {

  }

}
