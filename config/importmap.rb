# Pin npm packages by running ./bin/importmap

pin "application"
pin "legislacao-script", to: "legislacao-script.js"
pin "detail-script", to: "detail-script.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
