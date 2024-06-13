import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import CurrentMedicationService from '../current-medication.service';
import * as _ from 'lodash';
import { DetailPopupViewBase } from 'src/app/shared';

@Component({
  selector: 'app-current-medication-detail',
  templateUrl: './current-medication-detail.component.html',
  styleUrls: ['./current-medication-detail.component.scss']
})
export class CurrentMedicationDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmMedicationDetails', { static: false }) frmMedicationDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmMedicationDetail: any = {};
  public rawMedicationDetail: any = {};
  public currentClassDetail: any;
  public dtsMedications: any[];

  constructor(private service: CurrentMedicationService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addMedication() {
    super.toggleLoadingPanel(true);
    this.initMedicationDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editMedication(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentClassDetail = _.cloneDeep(entity);
    this.initMedicationDetail();
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
    this.service.getById(this.currentClassDetail.id).subscribe((response) => {
      this.frmMedicationDetail = response.data;
      this.cloneRawData();
    });
  }
  private initMedicationDetail() {
    this.frmMedicationDetail = {
      id: 0,
      title: null,
      classId:null
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
    super.setFormFocus(this.frmMedicationDetails.instance, 'title');
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
        this.initMedicationDetail();
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
    this.currentClassDetail = { id: this.currentClassDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmMedicationDetail)
      : this.service.create(this.frmMedicationDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmMedicationDetail.id = result.data.id;
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
      id: this.frmMedicationDetail.id
    };

    data.id = isEditMode ? this.frmMedicationDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawMedicationDetail = _.cloneDeep(this.frmMedicationDetail);
  }
  private restoreRawData() {
    this.frmMedicationDetail = _.cloneDeep(this.rawMedicationDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmMedicationDetail, this.rawMedicationDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmMedicationDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }
  public onPopupHiding(e) {
    this.popupVisible = false;
  }
  public onMedicationsValueChanged(e) {

  }
}
