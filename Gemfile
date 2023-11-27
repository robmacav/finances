source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.1"

gem "rails", "~> 7.0.4"
gem "sprockets-rails"
gem "puma", "~> 5.0"
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"
gem "jbuilder"
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]
gem "bootsnap", require: false
gem "sassc-rails"
gem "pagy", "3.5"
gem "ransack", "4.1.1"
gem "devise", "4.9.3"

group :development do
    gem "sqlite3", "1.6.8"
    gem "faker", "3.2.2"
end

group :production do
    gem "pg", "1.5.4"
    gem "dotenv-rails", "2.8.1"
end