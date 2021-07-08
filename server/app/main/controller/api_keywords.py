import flask
from flask_restx import Resource
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, ConceptsOptions, KeywordsOptions
import logging
from flask import request
from flask_restx import Resource
import os
from dotenv import load_dotenv, find_dotenv
from .. util.decorator import admin_token_required
from ..util.dto import Keywords
from ..service.user_service import save_new_user, get_all_users, get_a_user
from typing import Dict, Tuple

logging.basicConfig(level=logging.DEBUG)
# cors = flask_cors.CORS()


api = Keywords.api
# _user = UserDto.user

# session = requests.Session()

def watsonKeywords(textToAnalyse):
    load_dotenv(find_dotenv('server.env'))
    IBM_WATSON_API_KEY = os.environ.get("IBM_WATSON_API_KEY")
    url = "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/e3ac764e-7638-493a-94af-4b2939ba3861"
    authenticator = IAMAuthenticator(IBM_WATSON_API_KEY)
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        version='2021-03-25',
        authenticator=authenticator
    )
    natural_language_understanding.set_service_url(url)
    response = natural_language_understanding.analyze(
        text=textToAnalyse,
        features=Features(concepts=ConceptsOptions(limit=6), keywords=KeywordsOptions(emotion=False, sentiment=False,
                                                   limit=6))).get_result()

    _keywords = response["keywords"]
    results = []
    for word in _keywords:
        results.append(word['text'])
    _concepts = response["concepts"]
    for word in _concepts:
        results.append(word['text'])
    return results

# (entities=EntitiesOptions(emotion=True, sentiment=True, limit=2)

@api.response(200, 'OK')
@api.response(400, 'Bad request')
@api.route('/<int:textId>')
class RetrieveKeywords(Resource):

    @api.doc(params={'textId': "Text for analysis - ID"})
    # @api.marshal_list_with(_user, envelope='data')
    def get(self, textId):
        # textToAnalyse = f'Few studies have assessed attitudes and beliefs of school teachers on vaccination. Our ' \
        #                 f'cross-sectional questionnaire-based prospective survey aims to explore vaccination coverage ' \
        #                 f'and relevant knowledge of school teachers in Greece. Out of the 217 respondents, ' \
        #                 f'93% believe that vaccines offer protection but only 69.7% were completely vaccinated as per ' \
        #                 f'adults" National Immunization Schedule. In multivariate analysis, female gender, ' \
        #                 f'being a parent, beliefs that vaccination should be mandatory and imposing penalties to ' \
        #                 f'vaccine refusals are the main factors that account for teachers" "behavioral" variability ' \
        #                 f'towards vaccination. Strengthening the training of school teachers in health promotion ' \
        #                 f'should become a priority in the era of the highly anticipated vaccine against severe acute ' \
        #                 f'respiratory syndrome-coronavirus-2 (SARS-CoV-2). '
        # keywords = watsonKeywords(textToAnalyse)

        print(textId)
        return 200
