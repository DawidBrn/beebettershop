import { LightningElement,api,wire,track } from 'lwc';
import {NavigationMixin} from "lightning/navigation";
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAllPriceBooks from '@salesforce/apex/productDiscountManagerController.getAllPriceBooks';
import getProducts from '@salesforce/apex/productDiscountManagerController.getAllProducts';
import newPricebook from '@salesforce/apex/productDiscountManagerController.createPricebook';
import deletePricebook from '@salesforce/apex/productDiscountManagerController.deletePricebook2';
import newProductPrices from '@salesforce/apex/productDiscountManagerController.addProductsToPricebook';

const pricebookColumns = [
    {label: 'PriceBook Name', fieldName: 'Name'},
    {label: 'Percent Discount', fieldName: 'FlatValueDiscount__c'},
    {label: 'Currency Discount', fieldName: 'PercentValueDiscount__c'},
    {label: 'Is Active', fieldName: 'IsActive'},
];
const productColumns = [
    {label: 'Product Image', fieldName: 'DisplayUrl',type:'image'},
    {label: 'Product Name', fieldName: 'Name'},
    {label: 'Product Family', fieldName: 'Family'},
    
];

export default class ProductDicountManager extends NavigationMixin(LightningElement) {

    @track
    isNewPricebookModalOpen = false;

    pricebookColumns = pricebookColumns;
    productColumns = productColumns;
    @track
    priceBooks = [];
    @track
    newpricebooks = [];
    products = [];
    discountWrapper;
    selectedPricebook;
    selectedPricebookId;
    selectedProducts = [];

    openPricebookModal() {
        this.isNewPricebookModalOpen = true;
    }

    closePricebookModal() {
        this.isNewPricebookModalOpen = false;
    }
    get options() {
        return [
            {label: 'Percent', value: 'Percent'},
            {label: 'Currency', value: 'Currency'},
        ];
    }
    discountType = '';
    discountValue;
    discountName = '';

    handleDiscountType(event) {
        this.discountType = event.detail.value;
    }

    handleDiscountName(event) {
        this.discountName = event.detail.value;
    }

    handleDiscountValue(event) {
        this.discountValue = event.detail.value;
    }

    createPricebook() {
        this.isLoading = true;
        this.discountWrapper = {
            discountValue: this.discountValue,
            discountType: this.discountType,
            discountName: this.discountName
        }
        newPricebook({wrp: JSON.stringify(this.discountWrapper)})
            .then((result) => {
                console.log('result here'+result);
                this.isNewPricebookModalOpen = false;
            })
            .then(()=>{
                console.log('this.priceBooks:', this.data);
                refreshApex(this.wiredDataResult)
                .then(() => {
                    console.log('this.priceBooks:', this.data);
                })
            })
            .catch(error => {
                this.error = error;
            });
    }

    connectedCallback() {
    }

    wiredDataResult;
    wiredpDataResult;
    @track error;
    @track data;
    @wire(getAllPriceBooks)
    wiredPricebooks(result){
        this.wiredDataResult = result;
        if(result.data){
            this.data = result.data;
        }
    }
    @wire(getProducts)
    wiredProducts(result){
        this.wiredpDataResult = result;
        if(result.data){
            this.products = result.data;
            console.log(JSON.stringify(this.products));
        }
    }

    deletePricebk(){
        deletePricebook({id:this.selectedPricebookId})
        .then(() => {
            refreshApex(this.wiredDataResult)
                .then(() => {
                    console.log('this.priceBooks:', this.data);
                })
        })
    }
    addProductsToPricebook() {
        newProductPrices({
            products: this.selectedProducts,
            pricebook: this.selectedPricebook[0]
        })
        .then(() => {
            let toastMessage = {
                title: 'Success!',
                message: 'Pricebook successfully assigned to product!',
                variant: 'success',
            }
            this.showNotification(toastMessage);
        })
        .catch((error) => {
            let errorMessage = {
                title: 'Error',
                message: error,
                variant: 'error',
            }
            this.showNotification(errorMessage);
        })
            
    }

    showNotification(toastMessage) {
        const evt = new ShowToastEvent({
            title: toastMessage.title,
            message: toastMessage.message,
            variant: toastMessage.variant,
        });
        this.dispatchEvent(evt);
    }

    getSelectedRowPriceBook() {
        var selectedRecord =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecord.length > 0){
            let id = '';
            selectedRecord.forEach(currentItem => {
                id = currentItem.Id;
            });
            this.selectedPricebookId = id;
            this.selectedPricebook = selectedRecord;
            console.log(JSON.stringify(this.selectedPricebook));
        }  
        
      }
      getSelectedRowProduct() {
        var selectedRecord =  this.template.querySelector("c-salesforce-codex-data-table").getSelectedRows();
        this.selectedProducts = [];
        if(selectedRecord.length > 0){
            selectedRecord.forEach(currentItem => {
                this.selectedProducts.push(currentItem);
            });
        }   
      }

}