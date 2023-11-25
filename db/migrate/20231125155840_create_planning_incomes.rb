class CreatePlanningIncomes < ActiveRecord::Migration[7.0]
  def change
    create_table :planning_incomes do |t|
      t.string :description, null: false
      t.decimal :value, null: false
      t.references :planning, null: false, foreign_key: true

      t.timestamps
    end
  end
end
