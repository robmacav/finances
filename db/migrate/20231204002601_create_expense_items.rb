class CreateExpenseItems < ActiveRecord::Migration[7.0]
  def change
    create_table :expense_items do |t|
      t.integer :quantity, default: 1, null: false
      t.string :description, null: false
      t.decimal :value, null: false
      t.references :expense, null: false, foreign_key: true

      t.timestamps
    end
  end
end
