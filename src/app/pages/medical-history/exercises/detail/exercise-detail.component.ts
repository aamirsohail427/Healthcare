import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import ExerciseService from '../Exercise.service';
import * as _ from 'lodash';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import { DetailPopupViewBase } from 'src/app/shared';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.scss']
})
export class ExerciseDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmExerciseDetails', { static: false }) frmExerciseDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmExerciseDetail: any = {};
  public rawExerciseDetail: any = {};
  public currentExerciseDetail: any;

  constructor(private service: ExerciseService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addExercise() {
    super.toggleLoadingPanel(true);
    this.initExerciseDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editExercise(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentExerciseDetail = _.cloneDeep(entity);
    this.initExerciseDetail();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getUserDetails();
    }
    setTimeout(() => {
      this.popupVisible = true;
    });
    super.toggleLoadingPanel(false);
  }
  private getUserDetails() {
    this.service.getById(this.currentExerciseDetail.id).subscribe((response) => {
      this.frmExerciseDetail = response.data;
      this.cloneRawData();
    });
  }
  private initExerciseDetail() {
    this.frmExerciseDetail = {
      id: 0,
      title: null,
      description: null,
      ExerciseDate: null
    };
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getDetailPopupToolbarItems(
      new ButtonOptions('', false, null),
      new ButtonOptions('Cancel', true, this.onBtnCancelClick, this.isDataProcessing),
      new ButtonOptions('', this.isEditMode, this.onBtnRefreshClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndNewClick, this.isDataProcessing),
      new ButtonOptions('', true, this.onBtnSaveAndDoneClick, this.isDataProcessing)
    );
  }


  private onBtnRefreshClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        if (this.validateFormData()) {
          this.save(() => {
            this.cloneRawData();
            super.showSavedSuccessMsg(false);
          });
        }
      }, () => {
        this.getUserDetails();
      });
    } else {
      this.getUserDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmExerciseDetails.instance, 'title');
  }
  private onBtnCancelClick = () => {
    if (this.isDataChanged()) {
      super.confirmUnsavedChanges(() => {
        this.saveAndClose();
      }, () => {
        this.isChangesDiscarded = true;
        this.popupVisible = false;
      });
    } else {
      this.popupVisible = false;
    }
  }

  private onBtnSaveClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, this.saveCallback);
    });
  }

  private onBtnSaveAndNewClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(false, () => {
        this.isEditMode = false;
        this.initPopupToolbarItems();
        this.initExerciseDetail();
        this.cloneRawData();
        super.showSavedSuccessMsg(false);
      });
    });
  }

  private saveAndClose() {
    if (this.validateFormData()) {
      this.validateAndSave(true, this.saveAndDoneCallback);
    }
  }

  private onBtnSaveAndDoneClick = () => {
    this.setSaveButtonStatus(() => {
      this.validateAndSave(true, this.saveAndDoneCallback);
    });
  }

  private saveCallback = () => {
    super.showSavedSuccessMsg(false);
    this.isEditMode = true;
    this.initPopupToolbarItems();
    this.cloneRawData();
    this.currentExerciseDetail = { id: this.currentExerciseDetail.id };
    super.toggleLoadingPanel(false);
  }

  private setSaveButtonStatus(callbackFn: any = null) {
    this.isDataProcessing = true;
    this.initPopupToolbarItems();
    if (this.validateFormData()) {
      if (callbackFn != null) {
        callbackFn();
      }
    } else {
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
    }
  }

  private saveAndDoneCallback = () => {
    this.cloneRawData();
    super.showSavedSuccessMsg(true);
  }
  private validateAndSave(isSaveAndDone, callbackFn: any = null, isRefresh: boolean = false) {
    const validateData = this.getValidateData(this.isEditMode);
    super.toggleLoadingPanel(true);
    this.service.validate(validateData).subscribe(response => {
      if (response.data.isValid) {
        this.save(callbackFn);
      } else {
        this.isDataProcessing = false;
        this.initPopupToolbarItems();
        super.toggleLoadingPanel(false);
        this.showErrorMsg(this.service.getMessageByCode('U06'));
      }
    });
  }

  private showErrorMsg(msgCode: string) {
    CustomDialogHelper.alertErrorMsg(msgCode);
  }
  private save(callbackFn: any = null) {
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmExerciseDetail)
      : this.service.create(this.frmExerciseDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmExerciseDetail.id = result.data.id;
      }

      this.isDataSaved = true;
      this.isDataProcessing = false;
      this.initPopupToolbarItems();
      if (callbackFn != null) {
        callbackFn();
      }
    }, err => {
      super.toggleLoadingPanel(false);
    }, () => {
      super.toggleLoadingPanel(false);
    });
  }

  private getValidateData(isEditMode: boolean) {
    const data: any = {
      id: this.frmExerciseDetail.id
    };

    data.id = isEditMode ? this.frmExerciseDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawExerciseDetail = _.cloneDeep(this.frmExerciseDetail);
  }
  private restoreRawData() {
    this.frmExerciseDetail = _.cloneDeep(this.rawExerciseDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmExerciseDetail, this.rawExerciseDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmExerciseDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onPopupHiding(e) {
    this.popupVisible = false;
  }
}
