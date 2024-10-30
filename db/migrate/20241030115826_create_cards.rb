class CreateCards < ActiveRecord::Migration[7.2]
  def change
    create_table :cards do |t|
      t.string :description, null: false
      t.decimal :limit
      t.references :user, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
