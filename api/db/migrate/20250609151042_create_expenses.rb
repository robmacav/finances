class CreateExpenses < ActiveRecord::Migration[7.1]
  def change
    create_table :expenses do |t|
      t.string :summary
      t.text :details
      t.decimal :value
      t.string :date, limit: 8
      t.integer :status_id, null: false
      t.integer :category_id, null: false
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
