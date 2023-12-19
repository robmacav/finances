class AddTagToExpenses < ActiveRecord::Migration[7.0]
  def change
    add_reference :expenses, :tag, foreign_key: true
  end
end
