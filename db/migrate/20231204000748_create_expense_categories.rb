class CreateExpenseCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :expense_categories do |t|
      t.string :description, null: false
      t.string :color, limit: 6, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
