FROM ruby:3.4.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev

WORKDIR /app

RUN gem install bundler

COPY Gemfile Gemfile.lock ./

RUN bundle install

COPY . .

EXPOSE 3000
