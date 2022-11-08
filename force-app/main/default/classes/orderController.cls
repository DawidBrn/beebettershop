public with sharing class orderController {

    @AuraEnabled(Cacheable=true)
    public static List<Order> getOrders(String userId){
        try {
            List<Order> orders = [
                SELECT Id, CreatedById, Status, CreatedDate, TotalAmount,OrderNumber,
                (SELECT Id, Quantity, Product2.Name, Product2.Description,Product2.DisplayUrl,
                        Product2.Family,Product2.Weight__c,Product2.ProductCode,TotalPrice
                FROM OrderItems)
                FROM Order
                WHERE CreatedById = :userId
                AND Status =: finalStringSettingsData.ORDER_ACTIVATED
                ORDER BY CreatedDate DESC
        ];
            return orders;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(Cacheable=true)
    public static String getOrderNumber(String id){
        try {
            List<Order> orders = [
                SELECT Id, CreatedById, Status, CreatedDate, TotalAmount,OrderNumber,
                (SELECT Id, Quantity, Product2.Name, Product2.Description,Product2.DisplayUrl,
                        Product2.Family,Product2.Weight__c,Product2.ProductCode,TotalPrice
                FROM OrderItems)
                FROM Order
                WHERE Id = :Id
        ];
        return orders[0].OrderNumber;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
