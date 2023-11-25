class CreatePlannings < ActiveRecord::Migration[7.0]
  def change
    create_table :plannings do |t|
      t.string :month_year, limit: 6, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
