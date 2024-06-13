import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { Action, ButtonOptions, ComponentHelper, DropDownListOptions, GridListHelper } from 'src/app/shared/utils';
import { PhysicianDetailComponent } from '../detail';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import PhysicianService from '../physician.service';


@Component({
  selector: 'app-physicians-list',
  templateUrl: './physicians-list.component.html',
  styleUrls: ['./physicians-list.component.scss']
})
export class PhysiciansListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdPhysicians', { static: false }) grdPhysicians: DxDataGridComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addPhysicianComponentRef: ComponentRef<PhysicianDetailComponent>;
  public dtsPhysicians: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  public cnmBatchActionsVisible = false;
  public dtsActiveStates: any[];
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver,
    private service: PhysicianService) {
    super();
  }

  ngOnInit(): void {
    this.initData();
    this.initActions();
  }
  public initData() {
  }
  public initActions() {
    this.dtsActions.push(new Action("Archive", "Archive"));
  }
  public onBtnMoreActionsClick(e, entity, AnchorId, isEditing) {
    this.isBatchAction = false;
    this.cnmActionsTarget = '#' + AnchorId;
    this.cnmActions.instance.option('dataSource', this.dtsActions);
    this.cnmActionsVisible = true;
  }

  public onGrdPhysiciansContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdPhysiciansRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdPhysiciansToolbarPreparing(e: any) {
    this.gridListHelper.getListGrdToolbarItems(false,
      e,
      new ButtonOptions('', true, this.onBtnRefreshClick),
      new ButtonOptions('', true, this.onBtnExportToPDFClick),
      new ButtonOptions('', false, null),
      new DropDownListOptions(120, this.dtsActiveStates, 'value', 'text', 'Active', null, null, false));
  }
  private onBtnRefreshClick = () => {
    this.initData();
  }
  private onBtnExportToPDFClick = () => {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.grdPhysicians.instance
    }).then(() => {
      doc.save('Subjects.pdf');
    })
  }

  public onCnmActionsItemClick(e: any) {

  }
  public onBtnAddPhysicianClicked() {
    this.isDataProcessing = true;
    this.showPhysicianDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showPhysicianDetail(null, 'edit');
  }

  public showPhysicianDetail(entity, mode) {
    this.addPhysicianComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, PhysicianDetailComponent);
    const detailInstance = this.addPhysicianComponentRef.instance;
    detailInstance.popupTitle = "Schedule Physician";
    if (mode === 'create') {
      detailInstance.addPhysician();
    }
    if (mode === 'edit') {
      detailInstance.editPhysician(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addPhysicianComponentRef);
    });
  }

}
