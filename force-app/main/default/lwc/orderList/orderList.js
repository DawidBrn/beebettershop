import { LightningElement,wire,api,track } from 'lwc';
import Id from '@salesforce/user/Id';
import orders from '@salesforce/apex/orderController.getOrders';

export default class OrderList extends LightningElement {
    @track
    activeOrders;
    userId;
    showConnectedMessage;

    connectedCallback() {
        this.userId = Id;
    }

    @track isCaseOpen = false;
    @track isShippingOpen = false;
    openCase() {
        // to open modal set isModalOpen tarck value as true
        this.isCaseOpen = true;
    }
    closeCase() {
        // to close modal set isModalOpen tarck value as false
        this.isCaseOpen = false;
    }
    
    openShipping() {
        // to open modal set isModalOpen tarck value as true
        this.isShippingOpen = true;
    }
    closeShipping() {
        // to close modal set isModalOpen tarck value as false
        this.isShippingOpen = false;
    }


    @wire(orders,{userId: '$userId'})
    wiredOrders(result){
        console.log('result:', result);
        if (result.data !== undefined){
            if (result.data.length !== 0){
                this.showConnectedMessage = false;
            } else {
                this.showConnectedMessage = true;
            }
            this.reformatResults(result);
        }
    }

    reformatResults(result){
        let tempProps = JSON.parse(JSON.stringify(result));
        if (result.data){
            tempProps.data.forEach(order => {
                order.CreatedDate = order.CreatedDate.slice(0, -8).replace('T', ' ');
                Object.preventExtensions(tempProps);
            });
            Object.preventExtensions(tempProps);
            this.activeOrders = tempProps;
        }
    }

}