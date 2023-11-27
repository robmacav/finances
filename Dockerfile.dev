FROM ruby:3.0.1-slim

RUN apt update -qq && apt install -y build-essential libsqlite3-dev sqlite3 nodejs

WORKDIR /app

COPY Gemfile Gemfile.lock .

RUN bundle config set --local without 'production test'

RUN bundle install

COPY entrypoint.sh /usr/bin/

RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

ENV RAILS_ENV=development

CMD ["rails", "server", "-b", "0.0.0.0"]