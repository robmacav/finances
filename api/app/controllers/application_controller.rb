class ApplicationController < ActionController::API
    def about
        render json: {
            name: "Finances API",
            version: "1.0.0"
        }
    end
end
