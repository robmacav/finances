class CreatePlanningExpenses < ActiveRecord::Migration[7.0]
  def change
    create_table :planning_expenses do |t|
      t.string :description, null: false
      t.decimal :value, null: false
      t.references :planning_expense_category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
