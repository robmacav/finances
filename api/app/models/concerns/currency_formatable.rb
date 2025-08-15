module CurrencyFormatable
  extend ActiveSupport::Concern

  def format_currency_without_decimal(value)
    return "" if value.nil?

    whole, decimal = sprintf('%.2f', value).split(".")

    whole_with_delimiter = whole.reverse.gsub(/(\d{3})(?=\d)/, '\\1.').reverse

    "R$ #{whole_with_delimiter}"
  end

def format_currency(value)
    return "" if value.nil?

    whole, decimal = sprintf('%.2f', value).split(".")

    whole_with_delimiter = whole.reverse.gsub(/(\d{3})(?=\d)/, '\\1.').reverse

    "R$ #{whole_with_delimiter},#{decimal}"
  end
end
