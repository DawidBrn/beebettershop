import { LightningElement,track, api ,wire } from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import searchByName from '@salesforce/apex/searchResultController.searchByName';
import getAllProducts from '@salesforce/apex/searchResultController.getAllProducts';

export default class SearchResults extends LightningElement {
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
    isLoading = false;

    @api
    selectedProduct;

   

    connectedCallback() {
        this.subToMessageChannel();
    }

    subToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            beebetterChannel,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.searchTerm = message.searchQuery;
    }

    @wire(searchByName,{term : '$searchTerm'})
    getProducts(result){
        console.log(result);
        this.products = false;
        this.pricebookEntries = result;
        this.checkForResults(result);
        
    }
    checkForResults(result){
        if(result !== 'undefined'){
            if(result.data.length < 1){
                this.resultsData = true;
                this.resultSize = 0;
            }else{
                this.resultsData = false;
                this.resultSize = result.data.length;
            }
        }
    }

    @wire(getAllProducts)
    getAllProducts({data}){
        if(data){
            this.products = true;
            console.log(data);
            this.pricebookEntries = data;
            this.checkForResults(data);

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