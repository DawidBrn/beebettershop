public with sharing class cartController {

    @AuraEnabled
    public static OrderItem setOrderItem(String orderId, String accountId,PriceBookEntry record,Integer quantity){
        String pricebookentryId = record.Id;
        String productId = record.Product2Id;
        if(orderId != null && orderId != 'undefined'){
            OrderItem cartItem = new OrderItem();
            cartItem.OrderId = orderId;
            cartItem.Quantity = quantity;
            cartItem.UnitPrice = record.UnitPrice;
            cartItem.Product2id = productId;
            cartItem.PricebookEntryId = pricebookEntryId;
            insert cartItem;
            System.debug(cartItem);
            return cartItem;
        }else {
            OrderItem cartItem = new OrderItem();
            cartItem.OrderId = setOrder(accountId);
            cartItem.Quantity = quantity;
            cartItem.UnitPrice = record.UnitPrice;
            cartItem.Product2id = productId;
            cartItem.PricebookEntryId = pricebookentryId;
            insert cartItem;
            System.debug(cartItem);
            return cartItem;
        }
    }

    @AuraEnabled
    public static String setOrder(String accountId){
        Order order = new Order();
        order.AccountId = accountId;
        order.EffectiveDate = System.today();
        order.Status = 'Draft';
        order.PriceBook2Id = getActivePriceBookId();
        insert order;
        return order.id;
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderItems(String orderId){
        return [
            SELECT Id,Product2Id,Product2.Name,Product2.Family,
            Product2.ProductCode,Product2.Weight__c,Product2.Details_URL__c,
            Quantity, OrderId, UnitPrice
            FROM OrderItem
            WHERE OrderId =: orderId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static String getActivePriceBookId(){
        PriceBook2 pb = [
            SELECT Id,IsActive
            FROM PriceBook2
            WHERE IsActive = true
        ];
        return pb.Id;
    }
    
    @AuraEnabled(cacheable=true)
    public static Order getUserOrder(String userId){
        Order order = [
                SELECT Id, OwnerId, Status
                FROM Order
                WHERE OwnerId = :userId
                AND Status = 'Draft'
        ];
        return order;
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
}
