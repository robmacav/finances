FROM ruby:3.4.2-slim

RUN apt update -qq && apt install -y build-essential libpq-dev libyaml-dev nodejs

WORKDIR /app

COPY Gemfile Gemfile.lock .

RUN gem install bundler:2.5.23

RUN bundle install

# COPY entrypoint.sh /usr/bin/

# RUN chmod +x /usr/bin/entrypoint.sh

# ENTRYPOINT ["entrypoint.sh"]

ENV RAILS_ENV=production

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]