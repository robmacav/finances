class Expense < ApplicationRecord
  belongs_to :expense_category
  belongs_to :card, optional: true
  belongs_to :user
  has_many :items, class_name: "ExpenseItem", dependent: :destroy

  accepts_nested_attributes_for :items, allow_destroy: true
end
