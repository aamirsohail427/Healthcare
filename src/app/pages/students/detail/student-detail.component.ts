import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { TrowserViewBase } from 'src/app/shared/base-classes';
import { ButtonOptions, CustomDialogHelper } from 'src/app/shared/utils';
import * as _ from 'lodash';
import StudentService from '../student.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent extends TrowserViewBase implements OnInit {
  @ViewChild('frmStudentDetails', { static: false }) frmStudentDetails: DxFormComponent;
  public popupToolbarItems: any[];
  public frmStudentDetail: any = {};
  public rawStudentDetail: any = {};
  public currentStudentDetail: any;
  public dtsGenderTypes: any[];
  public dtsCountries: any[];
  public dtsStates: any[];
  public dtsCities: any[];
  public dtsBloodTypes: any[];
  public dtsClasses: any[];
  constructor(private service: StudentService) {
    super();
  }

  ngOnInit(): void {
    this.initPopupToolbarItems();
  }


  public addStudent() {
    super.toggleLoadingPanel(true);
    this.initUserDetail();
    this.initFormData(false);
    this.cloneRawData();
  }

  public editStudent(entity) {
    this.isEditMode = true;
    super.toggleLoadingPanel(true);
    this.currentStudentDetail = _.cloneDeep(entity);
    this.initUserDetail();
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
    this.service.getById(this.currentStudentDetail.id).subscribe((response) => {
      this.frmStudentDetail = response.data;
      this.frmStudentDetail.confirmPassword = response.data.password;
      this.cloneRawData();
    });
  }
  private initUserDetail() {
    this.frmStudentDetail = {
      id: 0,
      firstName: null,
      lastName: null,
      userId: null,
      password: null,
      confirmPassword: null,
      email: null,
    };
  }


  private initPopupToolbarItems(): void {
    this.popupToolbarItems = super.getTrowserToolbarItems(
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
    super.setFormFocus(this.frmStudentDetails.instance, 'firstName');
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
        this.initUserDetail();
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
    this.currentStudentDetail = { id: this.frmStudentDetail.id };
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
    const saveMethod: any = this.isEditMode ? this.service.update(this.frmStudentDetail)
      : this.service.create(this.frmStudentDetail);
    saveMethod.subscribe(result => {
      if (!this.isEditMode) {
        this.frmStudentDetail.id = result.data.id;
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
      id: this.frmStudentDetail.id
    };

    data.id = isEditMode ? this.frmStudentDetail.id : 0;
    return data;
  }

  private cloneRawData() {
    this.rawStudentDetail = _.cloneDeep(this.frmStudentDetail);
  }
  private restoreRawData() {
    this.frmStudentDetail = _.cloneDeep(this.rawStudentDetail);
  }
  private isDataChanged(): boolean {
    if (super.isEqual(this.frmStudentDetail, this.rawStudentDetail)) {
      return false;
    } else {
      return true;
    }
  }
  private validateFormData(): boolean {

    const result: any = this.frmStudentDetails.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return false;
    }
    return true;
  }

  public comparePassword = () => {
    return this.frmStudentDetails.instance.option("formData").password;
  };
  public onPopupHiding(e) {
    this.popupVisible = false;
  }
}
