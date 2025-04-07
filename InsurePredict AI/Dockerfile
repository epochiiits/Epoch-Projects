#Stage 1: Building Frontend
FROM node:18 AS build-stage

WORKDIR /code

COPY ./frontend/ /code/frontend

WORKDIR /code/frontend

# Installing Packages
RUN npm install

# producing build
RUN npm run build

#Stage 2: Building Backend
FROM python:3.11 

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code
# copy django project
COPY ./backend/ /code/backend

RUN pip install -r ./backend/requirements.txt

# copy react build file  to django
COPY --from=build-stage ./code/frontend/build /code/backend/static

COPY --from=build-stage ./code/frontend/build/static /code/backend/static
COPY --from=build-stage ./code/frontend/build/index.html /code/backend/churn/templates/index.html

# Run Django Migrations
RUN python ./backend/manage.py makemigrations
# RUN python ./backend/manage.py migrate

# Run Django Collectstatic
RUN python ./backend/manage.py collectstatic --no-input

# Expose the port the app runs on
EXPOSE 8000

WORKDIR /code/backend

# run django server
CMD ['gunicorn',"backed.wsgi.application","--bind","0.0.0.0:8000"]
