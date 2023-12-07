class ExpenseCategory < ApplicationRecord
  belongs_to :user

  validates_presence_of :description

  before_create :generate_random_attribute_color

  private

  def generate_random_attribute_color
    self.color = SecureRandom.hex(3)
  end
end
