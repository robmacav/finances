class ApplicationController < ActionController::API
    before_action :authenticate_token

    private

    def authenticate_token
        token = request.headers['Authorization']
        expected_token = Rails.application.credentials.production.api_key

        unless ActiveSupport::SecurityUtils.secure_compare(token.to_s, expected_token)
            render json: { error: "Unauthorized" }, status: :unauthorized
        end
    end
end
