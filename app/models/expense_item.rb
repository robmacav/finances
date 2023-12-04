class ExpenseItem < ApplicationRecord
  belongs_to :expense

  validates_presence_of :quantity, :description, :value

  after_save :update_expense_total
  after_destroy :update_expense_total

  def update_expense_total
    self.expense.calculate_total
    self.expense.save
  end
end
