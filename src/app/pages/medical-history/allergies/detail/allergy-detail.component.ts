import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ButtonOptions, CustomDialogHelper, DetailPopupViewBase } from 'src/app/shared';
import * as _ from 'lodash';
import AllergyService from '../allergy.service';

@Component({
  selector: 'app-allergy-detail',
  templateUrl: './allergy-detail.component.html',
  styleUrls: ['./allergy-detail.component.scss']
})
export class AllergyDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmAllergyDetails', { static: false }) frmAllergyDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmAllergyDetail: any = {};
  public rawAllergyDetail: any = {};
  public currentAllergyDetail: any;

  constructor(private service: AllergyService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addAllergy() {
    super.toggleLoadingPanel(true);
    this.initClassDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editAllergy(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentAllergyDetail = _.cloneDeep(entity);
    this.initClassDetail();
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
    this.service.getById(this.currentAllergyDetail.id).subscribe((response) => {
      this.frmAllergyDetail = response.data;
      this.cloneRawData();
    });
  }
  private initClassDetail() {
    this.frmAllergyDetail = {
      id: 0,
      title: null,
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
    super.setFormFocus(this.frmAllergyDetails.instance, 'title');
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
        this.initClassDetail();
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
    this.currentAllergyDetail = { id: this.currentAllergyDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmAllergyDetail)
      : this.service.create(this.frmAllergyDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmAllergyDetail.id = result.data.id;
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
      id: this.frmAllergyDetail.id
    };

    data.id = isEditMode ? this.frmAllergyDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawAllergyDetail = _.cloneDeep(this.frmAllergyDetail);
  }
  private restoreRawData() {
    this.frmAllergyDetail = _.cloneDeep(this.rawAllergyDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmAllergyDetail, this.rawAllergyDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmAllergyDetails.instance.validate();
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
