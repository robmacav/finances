class Admin::UsersController < ApplicationController
    before_action :valid_admin
    
    def index
        @q = User.ransack(params[:q])
        @pagy, @users = pagy(@q.result, items: params[:per_page] || 5)
    end
end
