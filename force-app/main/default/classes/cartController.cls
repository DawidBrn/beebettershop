public with sharing class cartController {

    @AuraEnabled
    public static OrderItem setOrderItem(String orderId,PriceBookEntry record,Integer quantity,List<OrderItem> items){
        String pricebookentryId = record.Id;
        String productId = record.Product2Id;
        Order order = new Order();
        Map<Id,OrderItem> finalMap = new Map<Id,OrderItem>();
        for(OrderItem item : items){
            finalMap.put(item.Product2Id,item);
        }
        if(orderId == null || orderId == 'undefined'){
            order.AccountId = finalStringSettingsData.CUSTOMER_ACCOUNT;
            order.EffectiveDate = System.today();
            order.Status = 'Draft';
            order.PriceBook2Id = finalStringSettingsData.ORDER_DRAFT;
            insert order;
        }
            if(!finalMap.containsKey(record.Product2Id)){
                if(order.Id == null){
                    OrderItem cartItem = new OrderItem();
                    cartItem.OrderId = orderId;
                    cartItem.Quantity = quantity;
                    cartItem.UnitPrice = record.UnitPrice;
                    cartItem.Product2id = productId;
                    cartItem.PricebookEntryId = pricebookEntryId;
                    insert cartItem;
                    return cartItem;
                }else {
                    OrderItem cartItem = new OrderItem();
                    cartItem.OrderId = order.Id;
                    cartItem.Quantity = quantity;
                    cartItem.UnitPrice = record.UnitPrice;
                    cartItem.Product2id = productId;
                    cartItem.PricebookEntryId = pricebookentryId;
                    insert cartItem;
                    return cartItem;
                }
            }else{
                OrderItem oldItem = finalMap.get(record.Product2Id);
                OrderItem cartItem = new OrderItem();
                    cartItem.OrderId = oldItem.Id;
                    oldItem.Quantity = quantity + oldItem.Quantity;
                    cartItem.UnitPrice = record.UnitPrice;
                    cartItem.Product2id = productId;
                    cartItem.PricebookEntryId = pricebookentryId;
                update oldItem;
                return oldItem;
            }
    }

    @AuraEnabled(cacheable=true)
    public static String getActivePriceBookId(){
        PriceBook2 pricebook = [
            SELECT Id,IsActive
            FROM PriceBook2
            WHERE IsActive = true
            AND Id = '01s7S000000iXSvQAM'
        ];
        return pricebook.Id;
    }
    
    @AuraEnabled(cacheable=true)
    public static String getUserOrder(String userId){
        try{
            Order order = [
                SELECT Id, OwnerId, Status
                FROM Order
                WHERE OwnerId = :userId
                AND Status = 'Draft'
        ];
        return order.Id;
        }catch(Exception e){
            return null;
        }
    }
    @AuraEnabled(cacheable=true)
    public static String getAccountId(String userId) {
        User user = [
                SELECT Account.Id
                FROM User
                WHERE Id = :userId
        ];
        return user.Account.Id;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId){
        return [ SELECT Id,Product2Id,Product2.Name,Product2.Family,
            Product2.ProductCode,Product2.Weight__c,Product2.DisplayUrl,
            Quantity, OrderId, UnitPrice
            FROM OrderItem
            WHERE OrderId =: orderId
        ];
    }
    @AuraEnabled
    public static String finishOrder(String billingStreet, String billingCity, String billingStateProvince,
    String billingCountry, String billingZipPostalCode, String orderId , String finallist){

        Order order = [
            SELECT Id
            FROM Order
            WHERE Id = :orderId
        ];
        List<OrderItem> orderItems = [
            SELECT Id,Quantity 
            From OrderItem 
            WHERE OrderId =: orderId
        ];
        List<wrapper> changedItems = (List<wrapper>) JSON.deserialize(finallist,List<wrapper>.class);
        for(Integer i = 0 ; i < orderItems.size(); i++){
            orderItems[i].Quantity = changedItems[i].Quantity;
            System.debug('here' + orderItems[i]);
        }
        
        update orderItems;
        order.BillingStreet = billingStreet;
        order.BillingCity = billingCity;
        order.BillingState = billingStateProvince;
        order.BillingCountry = BillingCountry;
        order.BillingPostalCode = billingStreet;
        order.Status = 'Activated';
        try {
            
            update order;
            Order order2 = new Order();
                order2.AccountId = finalStringSettingsData.CUSTOMER_ACCOUNT;
                order2.EffectiveDate = System.today();
                order2.Status = finalStringSettingsData.ORDER_DRAFT;
                order2.PriceBook2Id = getActivePriceBookId();
                insert order2;
            return JSON.serialize(finallist);
        } catch (Exception e) {
            System.debug(e);
            return e.getMessage();
        }
    }

    @AuraEnabled
    public static String deleteFromCart(String orderItemId){
        OrderItem orderItem = [
                SELECT Product2Id
                FROM OrderItem
                WHERE Id = :orderItemId
        ];
        try{
            delete orderItem;
            return 'ok';
        }catch(Exception e){
            return e.getMessage();
        }
    }
    @AuraEnabled
    public static String emptyTheCart(String Id){
        List<OrderItem> orderItems = [
                SELECT Product2Id,OrderId
                FROM OrderItem
                WHERE OrderId =:id
        ];
        try{
            delete orderItems;
            return 'ok';
        }catch(DmlException  e){
            return e.getMessage();
        }
    }

    public class wrapper{
        public String Id;
        public Decimal Quantity;
    }
}
