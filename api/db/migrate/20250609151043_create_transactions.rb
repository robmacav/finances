class CreateTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :transactions do |t|
      t.string :summary
      t.text :details
      t.decimal :value
      t.string :date, limit: 8
      t.integer :transaction_kind_id, null: false
      t.integer :status_id, null: false
      t.integer :category_id
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
