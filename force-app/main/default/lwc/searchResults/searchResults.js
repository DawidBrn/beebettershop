import { LightningElement,track, api ,wire } from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import searchByName from '@salesforce/apex/searchResultController.searchByName';
import getAllProducts from '@salesforce/apex/searchResultController.getAllProducts';
import getCategories from '@salesforce/apex/searchResultController.getCategories';
import FilteredEntries from '@salesforce/apex/searchResultController.getFilteredEntries';

import nomatches from '@salesforce/label/c.No_matches_found_Label';
import noofresults from '@salesforce/label/c.No_of_Results_Label';

export default class SearchResults extends LightningElement {

    label = {
        nomatches,
        noofresults,
    };
    products;
    @track
    categories;
    @track
    filerValue;
    filterdEntries;
    subscription = null;

    @wire(MessageContext)
    messageContext;
    searchTerm;

    @track
    pricebookEntries;
    @track
    resultsData = false;
    @track
    resultSize;
    products = true;
    @track
    isLoading = false;
    @track
    aftersearch = false;

    @api
    selectedProduct;

    connectedCallback() {
        this.isLoading = true;
        this.aftersearch = false;
        this.subToMessageChannel();
    }
    
    subToMessageChannel() {
        this.isLoading = true;
        this.subscription = subscribe(
            this.messageContext,
            beebetterChannel,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        console.log(message.searchQuery);
        this.searchTerm = message.searchQuery;
    }

    @wire(searchByName,{term : '$searchTerm'})
    getProducts(result){
        this.products = false;
        this.pricebookEntries = result;
        this.checkForResults(result);
        this.aftersearch = true;
        this.isLoading = false;
    }

    checkForResults(result){
        if (result.data !== undefined) {
            if (result.data.length < 1) {
                this.resultsData = true;
                this.resultSize = result.data.length;
                this.isLoading = false;
            } else {
                this.resultsData = false;
                this.resultSize = result.data.length;
                this.isLoading = false;
            }
        }
    }

    @wire(getAllProducts)
    getAllProducts({data}){
        if(data){
            this.products = true;
            this.pricebookEntries = data;
        }
        this.isLoading = false;
    }
    
    sendMessageService(prodId) {
        publish(this.messageContext, beebetterChannel, {recordId: prodId});
    }
}