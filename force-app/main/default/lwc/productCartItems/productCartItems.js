import { LightningElement,api,wire,track } from 'lwc';
import { CurrentPageReference,NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

import getUserOrderItems from '@salesforce/apex/cartController.getOrderItems';
import finishOrder from '@salesforce/apex/cartController.finishOrder';
import deleteItem from '@salesforce/apex/cartController.deleteFromCart';
import emptyTheCart from '@salesforce/apex/cartController.emptyTheCart';

import addtocart from '@salesforce/label/c.Add_to_Cart_Button';
import faq from '@salesforce/label/c.FAQ_Label';
import dosage from '@salesforce/label/c.Dosage_of_supps_Label';
import shippingandcomplatins from '@salesforce/label/c.Shipping_and_complaints_Label';
import storingdrugsandsupps from '@salesforce/label/c.Stroing_drugs_supps_Label';
import description from '@salesforce/label/c.Description_Label';
import recommendeduse from '@salesforce/label/c.Recommended_Use_Label';
import componentsofprod from '@salesforce/label/c.Components_of_the_product_Label';
import cartisempty from '@salesforce/label/c.Cart_is_empty_Label';
import shipping from '@salesforce/label/c.Shipping_Label';
import summary from '@salesforce/label/c.Summary_Label';
import tax from '@salesforce/label/c.Tax_Label';
import useful from '@salesforce/label/c.Useful_information_Label';

export default class ProductCartItems extends NavigationMixin(LightningElement) {
    @track
    cartState = false;
    @track
    confirmation = false;
    @track
    cartFlag = false;
    recordId;
    item;
    @track
    orderItems;
    @track
    checkoutItems = [];
    summaryCost;
    list = [];
    current = 1;

    label = {
        addtocart,
        faq,
        dosage,
        shippingandcomplatins,
        storingdrugsandsupps,
        description,
        recommendeduse,
        componentsofprod,
        summary,
        tax,
        shipping,
        cartisempty,
        useful
    };
    isLoading = false;
    billingStreet = '';
    billingCity = '';
    billingStateProvince = '';
    billingCountry = '';
    billingZipPostalCode = '';
    @track type='';
    @track message = '';
    @track messageIsHtml=false;
    @track showToastBar = false;
    @api autoCloseTime = 3000;
    @track icon='utility:success';
    @track isShowModal = false;

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    @track isCheckoutOpen = false;
    openCheckout() {
        // to open modal set isModalOpen tarck value as true
        this.isCheckoutOpen = true;
    }
    closeCheckout() {
        // to close modal set isModalOpen tarck value as false
        this.isCheckoutOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
        this.showToast('success','<strong>Order fullfiled<strong/>','utility:success',300);
    }

    @wire(CurrentPageReference)
    currentPageReference; 

    get recordIdFromState(){
        return this.currentPageReference &&
            this.currentPageReference.state.recordId; 
    }

    connectedCallback()
    {
        this.recordId=this.recordIdFromState;
        this.summaryCost = 0;
    }

    get recordIdState(){
        return this.recordId;
    }

    @wire(getUserOrderItems,{orderId : '$recordId'})
    getItems(result){
    if(result.data !== undefined){
        this.orderItems = result.data;
        this.orderItems.length == 0 ? this.cartFlag = false : this.cartFlag = true;
        this.summaryCalculator();
        }
    }
    previous(){
        if(this.confirmation == true){
            this.confirmation = false;
            this.cartState = true;
        }else{
            this.cartState = false;
        }
    }
    next(){
        if(this.cartState == true){
            this.confirmation = true;
        }else{
            this.cartState = true;
        }
        
    }
    checkout() {
        
        if (
            this.billingStreet === "" ||
            this.billingCity === "" ||
            this.billingStateProvince === "" ||
            this.billingCountry === "" ||
            this.billingZipPostalCode === ""
        ) {
            this.message = 'Please fill all empty fields.'
        }
        else {
            this.isLoading = true;
            this.message = '';
            this.createActiveOrder();
            this.goToConfirmation();
        }
    }
    createActiveOrder(){
        let item;
        this.checkoutItems.forEach(element => {
            item = {
                Id: element.cartItem_orderItemId,
                Quantity: element.cartItem_Quantity
            }
            this.list.push(item);
        });
        finishOrder({
            billingStreet: this.billingStreet,
            billingCity: this.billingCity,
            billingStateProvince: this.billingStateProvince,
            billingCountry: this.billingCountry,
            billingZipPostalCode: this.billingZipPostalCode,
            orderId: this.recordId,
            finallist: JSON.stringify(this.list),
        })
            .then((result) => {
            })
            .catch((error) => {
                this.error = error;
            });
    }

    decQuantity(){
        const id = event.target.dataset.id;
        const index = event.target.dataset.index;
        if(this.checkoutItems[index].cartItem_Quantity>0){
            this.checkoutItems[index].cartItem_Quantity--;
        }
        this.newCost();
    }
    incQuantity(){
        const id = event.target.dataset.id;
        const index = event.target.dataset.index;
        this.checkoutItems[index].cartItem_Quantity++;
        this.newCost();
    }
    newCost(){
        this.summaryCost = 0;
        for (let i = 0; i < this.checkoutItems.length; i++) {
            let costOfItem = this.checkoutItems[i].cartItem_Quantity * this.checkoutItems[i].cartItem_UnitPrice;
            this.checkoutItems[i].cartItem_CostItem = costOfItem;
            this.summaryCost += costOfItem;
        }
            this.summaryCost = this.summaryCost.toFixed(2);
    }

    summaryCalculator(){
        let cartItem;
        this.summaryCost = 0;
        for (let i = 0; i < this.orderItems.length; i++) {
            let costOfItem = this.orderItems[i].Quantity * this.orderItems[i].UnitPrice;
            this.summaryCost += costOfItem;
            cartItem = {
                cartItem_Quantity: this.orderItems[i].Quantity,
                cartItem_UnitPrice: this.orderItems[i].UnitPrice,
                cartItem_Name: this.orderItems[i].Product2.Name,
                cartItem_Family: this.orderItems[i].Product2.Family,
                cartItem_CostItem: costOfItem,
                cartItem_Id: this.orderItems[i].Product2.Id,
                cartItem_orderItemId: this.orderItems[i].Id,
                cartItem_Display_URL: this.orderItems[i].Product2.DisplayUrl
            }
            this.checkoutItems.push(cartItem);
        }
        this.summaryCost = this.summaryCost.toFixed(2);
    }

    deleteFromCart(){
        this.isLoading = true;
        const index = event.target.dataset.index;
        deleteItem({
            orderItemId: event.target.dataset.oiid
        }).then(() => {
            this.checkoutItems.splice(index,1);
            this.newCost();
            this.isLoading = false;
        });
        this.showToast('success','<strong>Item deleted from cart<strong/>','utility:success',300);
        this.checkoutItems.length == 0 ? this.cartFlag = false : this.cartFlag = true;
    }

    emptyCart(){
        emptyTheCart({
            Id: this.recordId
        }).then((result) => {
            this.checkoutItems = [];
            this.orderItems = [];
            this.showModalBox = false;
            this.cartFlag = false;
            this.newCost();
        });
    }

    goToConfirmation() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://beebetter-dev-ed.develop.my.site.com/s/order-finished?recordId=' + this.recordId
            }
        }).then(generatedUrl => {
            window.open(generatedUrl,"_self");
        });
    }

    goToItem(){
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://beebetter-dev-ed.develop.my.site.com/s/prod-details?recordId=' + event.target.dataset.key
            }
        }).then(generatedUrl => {
            window.open(generatedUrl,"_self");
        });
    }
    goToProducts(){
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://beebetter-dev-ed.develop.my.site.com/s/searchresults'
            }
        }).then(generatedUrl => {
            window.open(generatedUrl,"_self");
        });
    }

    
    handleBilling(event) {
        this.billingStreet = event.target.value;
        console.log(this.billingStreet);
    }
    handleCity(event) {
        this.billingCity = event.target.value;
        console.log(this.billingCity);
    }
    handleStateProvince(event) {
        this.billingStateProvince = event.target.value;
        console.log(this.billingProvince);
    }
    handleCountry(event) {
        this.billingCountry = event.target.value;
        console.log(this.billingCountry);
    }
    handleZipPostalCode(event) {
        this.billingZipPostalCode = event.target.value;
    }

    
    @api
    showToast(type, message,icon,time) {
        this.type = type;
        this.message = message;
        this.icon=icon;
        this.autoCloseTime=time;
        this.showToastBar = true;
        setTimeout(() => {
            this.closeModel();
        }, this.autoCloseTime);
    }

    closeModel() {
        this.showToastBar = false;
        this.type = '';
        this.message = '';
        window.location.reload();
    }
    get getIconName() {
        if(this.icon)
        {
            return this.icon;
        }
        return 'utility:' + this.type;
    }
 
    get innerClass() {
        return 'slds-icon_container slds-icon-utility-' + this.type + ' slds-m-right_small slds-no-flex slds-align-top';
    }
 
    get outerClass() {
        return 'slds-notify slds-notify_toast slds-theme_' + this.type;
    }
}