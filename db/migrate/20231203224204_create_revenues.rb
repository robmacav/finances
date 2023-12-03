class CreateRevenues < ActiveRecord::Migration[7.0]
  def change
    create_table :revenues do |t|
      t.string :description, null: false
      t.decimal :value, null: false
      t.string :date, limit: 8, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
