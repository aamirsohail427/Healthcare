import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { DetailPopupViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import * as _ from 'lodash';
import FamilyService from '../family.service';

@Component({
  selector: 'app-family-detail',
  templateUrl: './family-detail.component.html',
  styleUrls: ['./family-detail.component.scss']
})
export class FamilyDetailComponent extends DetailPopupViewBase implements OnInit {

  @ViewChild('frmFamilyDetails', { static: false }) frmFamilyDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmFamilyDetail: any = {};
  public rawFamilyrDetail: any = {};
  public currentFamilyDetail: any;

  constructor(private service: FamilyService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }

  public addFamily() {
    super.toggleLoadingPanel(true);
    this.initClassRoomDetails();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editFamily(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentFamilyDetail = _.cloneDeep(entity);
    this.initClassRoomDetails();
    this.initFormData(true);
  }


  private initFormData(isEditMode: boolean) {
    this.isEditMode = isEditMode;
    this.initPopupToolbarItems();
    this.initEditors();
  }

  private initEditors() {
    if (this.isEditMode) {
      this.getClassRoomDetails();
    }
    setTimeout(() => {
      this.popupVisible = true;
    });
    super.toggleLoadingPanel(false);
  }
  private getClassRoomDetails() {
    this.service.getById(this.currentFamilyDetail.id).subscribe((response) => {
      this.frmFamilyDetail = response.data;
      this.cloneRawData();
    });
  }
  private initClassRoomDetails() {
    this.frmFamilyDetail = {
      id: 0,
      firstName: null,
      lastName: null,
      userId: null,
      password: null,
      confirmPassword: null,
      email: null
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
        this.getClassRoomDetails();
      });
    } else {
      this.getClassRoomDetails();
    }
    this.focusToFirstField();
  }
  private focusToFirstField() {
    super.setFormFocus(this.frmFamilyDetails.instance, 'firstName');
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
        this.initClassRoomDetails();
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
    this.currentFamilyDetail = { id: this.frmFamilyDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmFamilyDetail)
      : this.service.create(this.frmFamilyDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmFamilyDetail.id = result.data.id;
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
      id: this.frmFamilyDetail.id
    };

    data.id = isEditMode ? this.frmFamilyDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawFamilyrDetail = _.cloneDeep(this.frmFamilyDetail);
  }
  private restoreRawData() {
    this.frmFamilyDetail = _.cloneDeep(this.rawFamilyrDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmFamilyDetail, this.rawFamilyrDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmFamilyDetails.instance.validate();
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
