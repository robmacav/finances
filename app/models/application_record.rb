class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  scope :current_user_session, ->(user_id) { where(user_id: user_id) }

  def value_decimal_to_float
    if self.value.present?
      formatted = format('%.2f', self.value).tr('.', ',')

      parts = formatted.split(',')
      parts[0] = parts[0].reverse.scan(/\d{1,3}/).join('.').reverse

      parts.join(',')
    end
  end
end
