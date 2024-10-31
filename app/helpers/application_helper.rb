module ApplicationHelper
    include Pagy::Frontend

    def decimal_to_float(value)
        integer, decimal = format('%.2f', value).split('.')
        integer.reverse.gsub(/(\d{3})(?=\d)/, '\1.').reverse + ',' + decimal
    end
end