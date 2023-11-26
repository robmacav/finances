class SettingsController < ApplicationController
  before_action :set_user, only: %i[ edit update ]

  def index
    @user = current_user
  end

  def edit
    @user = current_user
  end

  def update
    respond_to do |format|
      if current_user.update(user_params)
        format.html { redirect_to settings_path, notice: "Dados atualizados com sucesso!" }
      else
        format.html { redirect_to "/settings/#{user_params[current_user.id]}/edit", notice: "Ocorreu um erro. Tente novamente ou contate o suporte!" }
      end
    end
  end

  def destroy
    respond_to do |format|
      if current_user.update(status: 1)
        format.html { redirect_to settings_path, notice: "Solicitação de exclusão realizada com sucesso!" }
      else
        format.html { redirect_to settings_path, notice: "Ocorreu um erro. Tente novamente ou contate o suporte!" }
      end
    end
  end

  private

  def set_user
    @user = User.find(current_user.id)
  end

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name)
  end
end