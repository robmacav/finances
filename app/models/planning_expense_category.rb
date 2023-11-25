class PlanningExpenseCategory < ApplicationRecord
  belongs_to :planning, optional: true
  
  has_many :expenses, class_name: 'PlanningExpense', dependent: :destroy

  validates_presence_of :description, :color

  before_validation :gerate_random_color_attribute

  private

  def gerate_random_color_attribute
    self.color = SecureRandom.hex(3)
  end
end
