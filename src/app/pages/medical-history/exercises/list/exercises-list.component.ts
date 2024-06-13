import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DxContextMenuComponent, DxDataGridComponent } from 'devextreme-angular';
import { ListViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, ComponentHelper, GridListHelper } from 'src/app/shared/utils';
import { ExerciseDetailComponent } from '../detail';

@Component({
  selector: 'app-exercises-list',
  templateUrl: './exercises-list.component.html',
  styleUrls: ['./exercises-list.component.scss']
})
export class ExcercisesListComponent extends ListViewBase implements OnInit {

  @ViewChild('componentContainer', { static: false, read: ViewContainerRef }) componentContainer: ViewContainerRef;
  @ViewChild('grdExcercises', { static: false }) grdExcercises: DxDataGridComponent;
  @ViewChild('cnmActions', { static: false }) cnmActions: DxContextMenuComponent;

  public addExcerciseComponentRef: ComponentRef<ExerciseDetailComponent>;
  public dtsExcercises: any;
  public cnmActionsVisible = false;
  public cnmActionsTarget = '';
  constructor(public gridListHelper: GridListHelper,
    private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
  }
  public initData() {

  }

  public onGrdExcercisesContentReady(e) {
    super.toggleLoadingPanel(false);
  }

  public onGrdExcercisesRowClick(e) {
    this.gridListHelper.onDoubleClick(e);
  }

  public onGrdExcercisesToolbarPreparing(e: any) {
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
  public onBtnAddExcerciseClicked() {
    this.isDataProcessing = true;
    this.showExcerciseDetail(null, 'create');
  }
  public onBtnMainActionClick(entity) {
    this.isDataProcessing = true;
    this.showExcerciseDetail(null, 'edit');
  }

  public showExcerciseDetail(entity, mode) {
    this.addExcerciseComponentRef =
      ComponentHelper.addComponent(this.componentFactoryResolver, this.componentContainer, ExerciseDetailComponent);
    const detailInstance = this.addExcerciseComponentRef.instance;

    if (mode === 'create') {
      detailInstance.popupTitle = "Add Excercise";
      detailInstance.addExercise();
    }
    if (mode === 'edit') {
      detailInstance.popupTitle = "Excercise -" + entity.title;
      detailInstance.editExercise(entity);
    }
    detailInstance.popupHiddenEvent.subscribe(response => {
      this.isDataProcessing = false;
      if (detailInstance.isDataSaved) {
        this.initData();
      }
      ComponentHelper.removeComponent(this.componentContainer, this.addExcerciseComponentRef);
    });
  }
}
