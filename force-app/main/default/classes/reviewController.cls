public with sharing class reviewController {
    
    @AuraEnabled(Cacheable = true)
    public static List<ProductReview__c> getReviews(String id){
        List<ProductReview__c> reviews = [
            SELECT Comment__c,Rating__c,Product__c,CreatedBy.Name,CreatedDate, CreatedBy.SmallPhotoUrl
            FROM ProductReview__c
            WHERE Product__c =: id
        ];
        if(reviews != null && !reviews.isEmpty()){
            return reviews;
           }else{
            return null;
           }
    }
    @AuraEnabled(Cacheable = true)
    public static List<ProductReview__c> getUserReview(String id,String prodId){
        List<ProductReview__c> reviews = [
            SELECT Id,Comment__c,Rating__c,Product__c,CreatedBy.Name,CreatedDate, CreatedBy.SmallPhotoUrl,CreatedById 
            FROM ProductReview__c
            WHERE CreatedById  =: id
            AND Product__c =: prodId
        ];
        if(reviews != null && !reviews.isEmpty()){
            return reviews;
           }else{
            return null;
           }
    }
    @AuraEnabled(Cacheable=true)
    public static Decimal getAvgRating(String id){
        List<AggregateResult> reviewRating = [
            SELECT AVG(Rating__c) FROM ProductReview__c WHERE Product__c =: id
        ];
        Decimal strToDec = decimal.valueOf(JSON.serialize(reviewRating[0].get('expr0')));
        return strToDec;
    }
}
