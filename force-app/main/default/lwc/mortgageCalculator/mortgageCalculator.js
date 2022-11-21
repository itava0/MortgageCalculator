import { LightningElement , wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import insertRecord from '@salesforce/apex/handleRecord.insertRecord';
import mortgageRecords from '@salesforce/apex/handleRecord.getRecord';
import deleteRecord from '@salesforce/apex/handleRecord.deleteRecord';

export default class MortgageCalculator extends NavigationMixin(LightningElement) {
  @track homePrice;
  @track interestRate;
  @track loanTerm;
  @track paymentFrequency;
  @track mortgagePayment;
  @track overallPaymentAmount;
  @track data = [];
  wiredData;

  @wire (mortgageRecords)
  getRecords(records){
      this.wiredData = records;
        if(records.data) {
            this.data = records.data;
            console.log(this.data);
        }
        else {
            console.log("Data error");
        }
    }

  

  homePriceHandler(e) {
    this.homePrice = e.target.value;
  }

  interestRateHandler(e) {
    this.interestRate = e.target.value;
  }

  loanTermHandler(e) {
    this.loanTerm = e.target.value;
  }

  get pickList() {
    return [
      {label: 'Monthly', value: 'Monthly'},
      {label: 'Semimonthly', value: 'Semimonthly'}
    ]
  }

  pickListChange(e) {
    this.paymentFrequency = e.detail.value
  }

  getResult() {
    let homePrice = this.homePrice;
    let interestRate = this.interestRate / 1200;
    
    let loanTerm;
    if(this.paymentFrequency == 'Monthly') {
      loanTerm = this.loanTerm * 12;
    } else {
      loanTerm = this.loanTerm * 6;
    }



    this.mortgagePayment = homePrice*(interestRate* Math.pow((1 + interestRate), loanTerm))/(Math.pow((1+ interestRate), loanTerm) - 1);

    this.overallPaymentAmount = this.mortgagePayment * loanTerm;

  }

  saveResult() {
    insertRecord({
      amortization: this.loanTerm,
      interestRate: this.interestRate,
      mortgageAmount: this.homePrice,
      paymentFrequency: this.paymentFrequency,
      overallPayment: this.overallPaymentAmount,
      payment: this.mortgagePayment
    })
    .then((response) => {
        console.log(response)
        return refreshApex(this.wiredData);
    })
    .catch((error) =>{
        console.log(error)
    })
  }

  resetInputFields() {
    this.template.querySelectorAll('lightning-input[data-id="reset"]').forEach(element => {
      element.value = null;
    });
    this.template.querySelectorAll('lightning-combobox[data-id="reset"]').forEach(each => {
      each.value = null;
    });
    this.mortgagePayment = null;
    this.overallPaymentAmount = null;
  }

  deleteField(event) {
    deleteRecord({searchId: event.target.dataset.id})
    .then((response) => {
      console.log("Success")
      console.log(event.target.dataset.id)
      return refreshApex(this.wiredData);
    })
    .catch((error) =>{
      console.log("Deletion Error")
      console.log(event.target.dataset.id)
    })
    console.log("I'm inside of the delete func")
  }

  recordPageUrl;
  viewRecord(event) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.target.value,
            objectApiName: "Mortgage_Details__c",
            actionName: "view"
        },
    }).then((url) => {
      this.recordPageUrl = url;
  });
}
}