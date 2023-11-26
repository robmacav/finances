class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  def self.ransackable_attributes(auth_object = nil)
    ["month_year"]
  end

  def value_decimal_to_float
    formatted = format('%.2f', self.value).tr('.', ',')

    parts = formatted.split(',')
    parts[0] = parts[0].reverse.scan(/\d{1,3}/).join('.').reverse

    parts.join(',')
  end
end
