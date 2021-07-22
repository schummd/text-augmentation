## Endpoints we are implementing:

GET all texts for the specific user  
1 GET /text/{username}  

POST new text to belong to a specific user  
2 POST /text/

Update/delete specific text   
3 PUT /text/{username}/{text_id}    
4 DELETE /text/{username}/{text_id}    

GET specific text of the user that is not the one who is logged it, but connected   
5 GET /text/{username}/{following}/{text_id}  

Return keywords for the specified text (IBM-Watson)  
6 GET keywords/{text_id}  

Return Wikipedia article relevant to the word of interest  
7 GET/wikipedia/{word}    

Return Oxford dictionary definition for the word of interest  
8 GET/definitions/{word}  

Follow all public articles of another user. Does not require permission.    
9 PATCH /user/{username}/following - Adds or removes a users followers  
10 GET /user/{username}/following - gets all users a user is following  

Get news feed: most recent titles of the followed users  
11 GET /user/{username}/newsfeed
