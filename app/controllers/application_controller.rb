class ApplicationController < ActionController::Base
    include Pagy::Backend

    before_action :authenticate_user!

    def convert_float_to_decimal(value)
        value&.gsub(".", "")&.sub(",",".")
    end
end
