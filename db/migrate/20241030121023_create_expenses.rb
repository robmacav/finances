class CreateExpenses < ActiveRecord::Migration[7.2]
  def change
    create_table :expenses do |t|
      t.string :description, null: false
      t.decimal :value, default: 0
      t.integer :payment_method
      t.string :date, limit: 8
      t.references :expense_category, foreign_key: true
      t.references :card, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
