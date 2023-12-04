require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"

Bundler.require(*Rails.groups)

module Finances
  class Application < Rails::Application
    config.load_defaults 7.0
    config.generators.system_tests = nil

    config.i18n.default_locale = "pt-BR"

    config.generators do |g|
      g.system_tests = nil
      g.helper false
      g.stylesheets false
      g.javascripts false
      g.skip_routes true
      g.test_framework false
    end
  end
end
