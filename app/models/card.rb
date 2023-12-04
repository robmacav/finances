class Card < ApplicationRecord
  belongs_to :user

  validates_presence_of :description, :limit

  def limit_decimal_to_float
    formatted = format('%.2f', self.limit).tr('.', ',')

    parts = formatted.split(',')
    parts[0] = parts[0].reverse.scan(/\d{1,3}/).join('.').reverse

    parts.join(',')
  end

  def self.ransackable_associations(auth_object = nil)
    ["user"]
  end

  def self.ransackable_attributes(auth_object = nil)
    ["description"]
  end
end
