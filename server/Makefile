.ONESHELL:

.PHONY: clean install tests run all

clean:
	find . -type f -name '*.pyc' -delete
	find . -type f -name '*.log' -delete

install:
	virtualenv  venv; \
	. venv/bin/activate; \
	pip install -r requirements.txt;

tests:
	. venv/bin/activate; \
	python manage.py test

run:
	. venv/bin/activate; \
	python manage.py run
	
migrate:
	. venv/bin/activate; \
	python manage.py db init \
	&& python manage.py db migrate --message 'initial database migration' \
	&& python manage.py db upgrade

squash:
	rm -rf migrations
	find . -type f -name "flask_boilerplate_*.db" -delete
	

all: clean install tests run
