class CreateIncomes < ActiveRecord::Migration[7.2]
  def change
    create_table :incomes do |t|
      t.string :description, null: false
      t.decimal :value
      t.string :date, limit: 8
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
