class Card < ApplicationRecord
  belongs_to :user

  validates_presence_of :description, :limit

  scope :all_by_current_user, ->(user) { where(user_id: user.id) }

  def limit_decimal_to_float
    formatted = format('%.2f', self.limit).tr('.', ',')

    parts = formatted.split(',')
    parts[0] = parts[0].reverse.scan(/\d{1,3}/).join('.').reverse

    parts.join(',')
  end
end
