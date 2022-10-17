import { LightningElement,track, api ,wire } from 'lwc';
import { subscribe,publish, MessageContext } from 'lightning/messageService';
import beebetterChannel from '@salesforce/messageChannel/beebetterChannel__c';
import searchResults from '@salesforce/apex/searchresultController.searchResults';

export default class SearchResults extends LightningElement {
    @track
    pricebookEntries;
    isLoading = false;

    subscription = null;

    @wire(MessageContext)
    messageContext;

    searchTerm;

    @api
    selectedProduct;

    @track
    emptyResults = false;

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
        this.searchTerm = message.searchTerm;
    }
    @wire(searchResults,{
        carNameSearchKey : '$searchTerm'
    })getProducts(result){
        this.pricebookEntries = result;
        this.notifyLoading(false);
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}