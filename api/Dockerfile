FROM ruby:3.1.0-slim

RUN apt update -qq && apt install -y build-essential libpq-dev nodejs

WORKDIR /app

COPY Gemfile Gemfile.lock .

RUN gem install bundler:2.5.23

RUN bundle install --without development

# COPY entrypoint.sh /usr/bin/

# RUN chmod +x /usr/bin/entrypoint.sh

# ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

ENV RAILS_ENV=production

CMD ["rails", "server", "-b", "0.0.0.0"]