GET specific text of the user that is not necessarily the one who is logged it, but connected. 
GET /text/{username}/{text_id}

GET all texts for the specific user
GET /text/{username}

POST new text to belong to a specific user
POST /text/{username}

Update/delete specific text 
PUT /text/{username}/{text_id}
DELETE /text/{username}/{text_id}

Return keywords for the specified text (IBM-Watson)
GET keywords/{text_id}

Return Wikipedia article relevant to the word of interest
GET/wikipedia/{word}

Return Oxford dictionary definition for the word of interest
GET/definitions/{word}


