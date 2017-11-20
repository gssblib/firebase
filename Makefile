CONFIG_DIR = $(shell pwd)/config
BACKUPS_DIR = $(shell pwd)/backups
PYTHON = $(shell pwd)/python-ve/bin/python
PIP = $(shell pwd)/python-ve/bin/pip
NODE_DEB_URL = https://deb.nodesource.com/setup_9.x

##> all : Build all components
all: server labels scripts client

##> help : Show this help text
.PHONY: help
help:
	@python scripts/makefile_self_document.py

python-ve:
	virtualenv python-ve

/usr/bin/node:
	curl -sL $(NODE_DEB_URL) | sudo -E bash -
	sudo apt-get install -y nodejs
	sudo npm install npm --global

##> ubuntu-env : Installs all necessary Ubuntu packages.
.PHONY: ubuntu-env
ubuntu-env: /usr/bin/node
	sudo apt-get install \
	    mysql-server \
	    virtualenv \
	    python-dev \
	    npm \
	    curl

##> database : Configures the database
.PHONY: database
database:
	cat sql/bootstrap.sql | mysql -p -u root
	cat sql/schema.sql | mysql -u gssb --password=gssblib spils

##> clean : Cleans the build from any generated files.
clean:
	rm -rf python-ve
	rm -rf client2/dist
	rm -rf client2/dist-public
	rm -rf client2/node_modules

####> Library Application Server <#############################################

##> server : Install/build the node server.
server: server/package.json
	cd server; \
	npm install

##> test-server : Run server tests.
.PHONY: test-server
test-server:
	cd server; \
	npm test

##> run-server : Run server on standard port.
.PHONY: run-server
run-server:
	cd server; \
	NODE_CONFIG_DIR=$(CONFIG_DIR) NODE_ENV=prod node ./src/library_server.js


####> Library Label Server <###################################################

##> labels : Install/build the label server/cli environment.
labels: labels/requirements.txt | python-ve
	$(PIP) install -r labels/requirements.txt

##> run-labels-server : Run labels server.
run-labels-server:
	NODE_CONFIG_DIR=$(CONFIG_DIR) NODE_ENV=prod \
	    $(PYTHON) `pwd`/labels/make_label.py serve


####> Old Client <#############################################################

##> old-client : Install/build the old client.
old-client: client/Gruntfile.js client/bower.json client/package.json
	cd client; \
	npm install; \
	sudo npm install grunt -g; \
	grunt bower:install


####> Client <#################################################################

##> client : Install client components.
client: client2/package.json
	cd client2; \
	npm install -g @angular/cli; \
	npm install

##> client-dist : Build volunteer client distribution
client-dist:
	cd client2; \
	ng build --base-href "/volunteers/"

##> client-dev : Start the volunteer client dev server on port 4200.
client-dev:
	cd client2; \
	ng serve --proxy-config proxy.conf.json

##> public-client-dist : Build public client distribution
public-client-dist:
	cd client2; \
	ng build --app public --base-href "/public/"

##> public-client-dev : Start the public client dev server on port 5200.
public-client-dev:
	cd client2; \
	ng serve --proxy-config proxy.conf.json --port 5200 --app public


####> Scripts <###############################################################

##> scripts : Install/build the scripts environment.
scripts: scripts/requirements.txt | python-ve
	$(PIP) install -r scripts/requirements.txt

##> backup : Create a backup of the database.
.PHONY: backup
backup:
	mkdir -p $(BACKUPS_DIR)
	NODE_ENV=prod $(PYTHON) scripts/backup_db.py --backup_dir $(BACKUPS_DIR)

##> restore FILE=<path>: Load the specified backup file into database.
.PHONY: restore
restore:
	zcat $(FILE) | mysql -u gssb --password=gssblib spils

##> reminder-emails-file : Create a file with reminder E-mails
.PHONY: reminder-emails
reminder-emails-file:
	NODE_ENV=prod $(PYTHON) \
	    scripts/reminder_email.py file email-recipients.txt

##> send-reminder-emails : Create a file with reminder E-mails
.PHONY: send-reminder-emails
send-reminder-emails:
	NODE_ENV=prod $(PYTHON) \
	    scripts/reminder_email.py email email-recipients.txt