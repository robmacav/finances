class Expense < ApplicationRecord
    belongs_to :expense_category, optional: true
    belongs_to :card, optional: true
    belongs_to :user
    has_many :items, class_name: "ExpenseItem", dependent: :destroy
end
