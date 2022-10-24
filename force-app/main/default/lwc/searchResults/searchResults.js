import { LightningElement,track, api ,wire } from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import searchByName from '@salesforce/apex/searchResultController.searchByName';
import getAllProducts from '@salesforce/apex/searchResultController.getAllProducts';

import nomatches from '@salesforce/label/c.No_matches_found_Label';
import noofresults from '@salesforce/label/c.No_of_Results_Label';

export default class SearchResults extends LightningElement {

    label = {
        nomatches,
        noofresults,
    };

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
        this.aftersearch = false;
        this.handleLoading();
        this.subToMessageChannel();
    }
    
    renderedCallback(){
        this.handleDoneLoading();
    }

    handleLoading() {
        this.isLoading = true;
    }

    handleDoneLoading() {
        this.isLoading = false;
    }

    subToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            beebetterChannel,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        this.searchTerm = message.searchQuery;
    }

    @wire(searchByName,{term : '$searchTerm'})
    getProducts(result){
        console.log(result);
        this.products = false;
        this.pricebookEntries = result;
        this.checkForResults(result);
        this.aftersearch = true;
    }

    checkForResults(result){
        if (result.data !== undefined) {
            if (result.data.length < 1) {
                this.resultsData = true;
                this.handleDoneLoading();
                this.resultSize = result.data.length;
                
            } else {
                this.resultsData = false;
                this.resultSize = result.data.length;
                this.handleDoneLoading();
            }
        }
    }

    @wire(getAllProducts)
    getAllProducts({data}){
        if(data){
            this.products = true;
            console.log(data);
            this.pricebookEntries = data;
            this.handleDoneLoading();
        }
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
    
    sendMessageService(prodId) {
        publish(this.messageContext, beebetterChannel, {recordId: prodId});
    }
}