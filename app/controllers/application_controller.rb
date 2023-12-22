class ApplicationController < ActionController::Base
    include Pagy::Backend

    before_action :authenticate_user!
    before_action :configure_permitted_parameters, if: :devise_controller?

    def convert_float_to_decimal(value)
        value&.gsub(".", "")&.sub(",",".")
    end

    def valid_admin
      redirect_to root_path if current_user.admin != 'Sim'
    end

    protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
    end
end
