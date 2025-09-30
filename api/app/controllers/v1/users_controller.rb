class V1::UsersController < ApplicationController
  def me
    render json: current_user.slice(:id, :name, :email)
  end
end