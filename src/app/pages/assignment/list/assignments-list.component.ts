import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ButtonOptions, ComponentHelper, GridListHelper, ListViewBase } from 'src/app/shared';
import { AssignmentDetailComponent } from '..';
import AssignmentService from '../assignment.service';

@Component({
  selector: 'app-assignments-list',
  templateUrl: './assignments-list.component.html',
  styleUrls: ['./assignments-list.component.scss']
})
export class AssignmentsListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdAssignments', { static: false }) grdAssignments: DxDataGridComponent;
  @ViewChild('cnmBatchActions', { static: false }) cnmBatchActions: DxContextMenuComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addAssignmentComponentRef: ComponentRef<AssignmentDetailComponent>;
  public dtsAssignments: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: AssignmentService) {
    super();
  }

  ngOnInit(): void {
    this.initData();
  }
  public initData() {
  }

  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
    this.isBatchAction = false;
    this.cnmActionsTarget = '#' + AnchorId;
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdAssignmentsContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdAssignmentsRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdAssignmentsToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnBatchActionClick), null);
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
  public onBtnAssignmentClicked() {
    this.isDataProcessing = true;
    this.showClassDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showClassDetail(null, 'edit');
  }

  public showClassDetail(entity, mode) {
    this.addAssignmentComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, AssignmentDetailComponent);
    const detailInstance = this.addAssignmentComponentRef.instance;
    detailInstance.popupTitle = "Add Assignment";
    if (mode === 'create') {
      detailInstance.addAssignment();
    }
    if (mode === 'edit') {
      detailInstance.editAssignment(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addAssignmentComponentRef);
    });
  }

}
