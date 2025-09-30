class V1::SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: :create

  def create
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = generate_token(user)
      render json: { token: token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end
end