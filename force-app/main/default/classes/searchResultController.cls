public with sharing class searchResultController {
    @AuraEnabled
    public static List<PriceBookEntry> searchResults(String term){
        try {
            List<PriceBookEntry> PriceBookEntries = [
                SELECT  
                Id,
                UnitPrice,
                Product2Id,
                Pricebook2Id,
                IsActive,
                ProductCode FROM PriceBookEntry
                WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
                AND IsActive = true
                AND Product2Id IN (
                    SELECT
                            Id
                    FROM Product2
                    WHERE
                        Name LIKE :term + '%'
            )
            ];
            return PriceBookEntries;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static List<PriceBookEntry> getAllProducts(){
        try {
            List<PriceBookEntry> PriceBookEntries = [
                SELECT  
                Id,
                UnitPrice,
                Product2Id,
                Pricebook2Id,
                IsActive,
                ProductCode FROM PriceBookEntry
                WHERE Pricebook2Id = '01s7S000000iXSvQAM' 
                AND IsActive = true
                ];
            return PriceBookEntries;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}