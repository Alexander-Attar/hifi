Install **virtualenv** and **pip**
==================================

PIP
---

PIP is a python package management tool and is a successor to easy_install.  To install PIP run ``easy_install pip`` or download pip from http://pypi.python.org/pypi/pip#downloads and install the package using the included setup.py file.

If you already have pip installed on your system, make sure that you have the latest version (0.8.2).  If you need to update pip you can do so by running ``pip install -U pip``

If you are running on OS X and use `homebrew <https://github.com/mxcl/homebrew>`_, you will want to install python and PIP via homebrew.  Doing so will properly configure pip to very easily and cleanly build packages with c extensions.

Virtualenv
----------

Virutalenv provides a simple and lightweight to install python pagackes into a contained space instead of to the system package directories.  This makes using muliple versions of a package on the same system possible and reduces the risk of unexpected interactions between different projects.

Virtualenv can be installed via pip with the command ``pip install virtualenv``.

You may also want to install `virtualenv_wrapper <http://www.doughellmann.com/projects/virtualenvwrapper/>`_ as it can make working with multiple virtualenvs easier to manage.  Installation and use instructions are available on the project site.

Setting up a virtualenv
=======================

Once pip and virtualenv are installed you'll want to create your virtualenv to work out of.  If you are using just virtualenv you will want to cd into your project directory and run ``virtualenv env``.  If you are using virtualenv_wrapper, you can run ``mkvirtualenv app``. (app can be called whatever you want)

Activating the virtualenv
=========================

To use a virtualenv you need to "activate" it.  You will need to do this each time you start a new terminal session and want to run project code.  If you are using just virtualenv, you will want to cd to the project directory and run the command ``source env/bin/activate``.  If you are using virtualenv_wrapper, you can simply run ``workon app`` from wherever.

Installing Dependencies
=======================

Most of the project's dependencies are managed via pip.  To install the dependencies, cd to your project directory and run the command ``pip install -r requirements.txt``.  Make sure that you have activated a virtualenv before doing this.  You will want to run this command whenever you pull updates from upstream as it will also update any dependencies as needed.

There are two dependencies which are managed outside of the process above as they can be tricky to install on some platforms.  These dependencies are ``PIL`` and ``psycopg2``.

Psycopg2
--------

If your on a mac, your using homebrew, and you've installed pip and postgresql through homebrew, then you can simply run ``pip install psycopg2``.  If you do fit this situation, you will probably want to install psycopg2 via your OS package manager of choice.

Configuration
=============

Under the ``src/config/settings`` directory, there is a file called ``settings.py``. Update the values in the this file to match your environment.  Most of the values should be either self-explanatory or safe to leave with default values.

Setup Database
==============

Create an empty database in postgresql with createdb <database name> and make sure that the credentials/settings to access it are setup in your ``config/settings.py`` file.  Once that is setup, cd into the ``src`` directory of your project and run the command ``./manage.py syncdb --migrate``.  While running this command, you will be asked if you'd like to create a super user.  Go ahead and fill out the fields to create the super user, but be aware that portions of the site will not work for this user as they were not created as part of the full registration process.  Once completed, you will have all of the database tables and basic data needed for your instance to work.

Much like the dependencies command, you will want to run this command whenever you pull upstream changes.  Doing so will apply any database changes your instance needs.

Run Development Server
======================

To run the application on your local machine, cd to the ``src`` directory and run the command ``./manage.py runserver``.  You should now be able to hit the app by going to http://127.0.01:8000.  If you'd like to hit your instance from a remote address (i.e. a VM), run the command ``./manage.py runsever 0.0.0.0:8000`` instead.


Heroku
=======================

Add the following to your .profile or .bash_profile where user name is your computer user name, and database name is
the name of the postgres database you created for the application.
export DJANGO_SECRET_KEY='local'
export DATABASE_URL='postgres://<user name>:@localhost:5432/<database name>'
