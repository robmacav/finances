class PlanningExpense < ApplicationRecord
  belongs_to :category, class_name: 'PlanningExpenseCategory', optional: true

  validates_presence_of :description, :value
end
