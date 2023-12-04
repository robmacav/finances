class CreateExpenses < ActiveRecord::Migration[7.0]
  def change
    create_table :expenses do |t|
      t.string :description, null: false
      t.decimal :value, default: 0, null: false
      t.integer :payment_method, null: false
      t.string :date, limit: 8, null: false
      t.references :expense_category, null: false, foreign_key: true
      t.references :card, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
