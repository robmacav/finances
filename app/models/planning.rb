class Planning < ApplicationRecord
  belongs_to :user, optional: true
  
  has_many :incomes, class_name: 'PlanningIncome', dependent: :destroy
  has_many :expense_categories, class_name: 'PlanningExpenseCategory', dependent: :destroy
  has_many :expenses, class_name: 'PlanningExpense', through: :expense_categories, dependent: :destroy

  validates_presence_of :month_year

  scope :current_year, -> { where("month_year like ?", "%#{Time.now.strftime("%Y")}%") }
end
