class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories do |t|
      t.string :summary
      t.string :color
      t.integer :user_id, null: false

      t.timestamps
    end
  end
end
