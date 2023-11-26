class ApplicationController < ActionController::Base
    include Pagy::Backend

    def convert_float_to_decimal(value)
        value&.gsub(".", "")&.sub(",",".")
    end
end
