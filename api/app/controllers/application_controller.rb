class ApplicationController < ActionController::API
    before_action :authenticate_token

    attr_reader :current_user

    private

    def authenticate_token
        token = request.headers['Authorization']
        expected_token = Rails.application.credentials.production.api_key

        unless ActiveSupport::SecurityUtils.secure_compare(token.to_s, expected_token)
            render json: { error: "Unauthorized" }, status: :unauthorized
        end
    end

    def authenticate_request
        puts "@@@@@@@@@@@@@"
        
        header = request.headers['Authorization'].to_s # "Bearer <token>"
        token  = header.split(' ').last
        payload = JWT.decode(token, jwt_secret, true, algorithm: 'HS256')[0] rescue nil
        @current_user = User.find_by(id: payload["sub"]) if payload
        render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
    end

    def jwt_secret
        Rails.application.credentials.jwt_secret || ENV["JWT_SECRET"]
    end

    def generate_token(user)
        # sub = subject (id do usuário), exp = expiração (opcional)
        payload = { sub: user.id, exp: 24.hours.from_now.to_i }
        JWT.encode(payload, jwt_secret, 'HS256')
    end
end
